import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  TrainingFormData,
  TrainingResult,
} from "../../lib/types";

type FunctionContext = {
  log?: (...args: unknown[]) => void;
  res?: {
    status: number;
    body: ApiErrorResponse | ApiSuccessResponse;
    headers?: Record<string, string>;
  };
};

type HttpRequest = {
  body?: unknown;
  method?: string;
  rawBody?: string;
};

type AzureChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

class InvalidModelResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidModelResponseError";
  }
}

const requiredEnvVars = [
  "AZURE_OPENAI_ENDPOINT",
  "AZURE_OPENAI_API_KEY",
  "AZURE_OPENAI_DEPLOYMENT_NAME",
  "AZURE_OPENAI_API_VERSION",
] as const;

const deliveryFormats: TrainingFormData["deliveryFormat"][] = [
  "workshop",
  "self-paced",
  "presentation",
  "hands-on-lab",
];

const experienceLevels: TrainingFormData["experienceLevel"][] = [
  "beginner",
  "intermediate",
  "advanced",
  "mixed",
];

const tones: TrainingFormData["tone"][] = [
  "practical",
  "friendly",
  "technical",
  "executive",
];

function jsonResponse(
  context: FunctionContext,
  status: number,
  body: ApiErrorResponse | ApiSuccessResponse,
) {
  context.res = {
    body,
    headers: {
      "Content-Type": "application/json",
    },
    status,
  };
}

function errorResponse(
  context: FunctionContext,
  status: number,
  message: string,
  code: string,
  details?: string[],
) {
  jsonResponse(context, status, {
    error: {
      code,
      details,
      message,
    },
    success: false,
  });
}

function parseRequestBody(req: HttpRequest): unknown {
  if (typeof req.body === "string") {
    return JSON.parse(req.body);
  }

  if (req.body !== undefined) {
    return req.body;
  }

  if (req.rawBody) {
    return JSON.parse(req.rawBody);
  }

  return {};
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validateFormData(value: unknown): {
  data?: TrainingFormData;
  errors: string[];
} {
  const errors: string[] = [];

  if (!isRecord(value)) {
    return {
      errors: ["Request body must be a JSON object."],
    };
  }

  const topic = typeof value.topic === "string" ? value.topic.trim() : "";
  const audience =
    typeof value.audience === "string" ? value.audience.trim() : "";
  const durationMinutes =
    typeof value.durationMinutes === "number"
      ? value.durationMinutes
      : Number(value.durationMinutes);
  const deliveryFormat = value.deliveryFormat;
  const experienceLevel = value.experienceLevel;
  const tone = value.tone;

  if (!topic) {
    errors.push("Training topic is required.");
  }

  if (!audience) {
    errors.push("Audience is required.");
  }

  if (
    !experienceLevels.includes(
      experienceLevel as TrainingFormData["experienceLevel"],
    )
  ) {
    errors.push("Learner skill level is required.");
  }

  if (
    !deliveryFormats.includes(
      deliveryFormat as TrainingFormData["deliveryFormat"],
    )
  ) {
    errors.push("Delivery format is required.");
  }

  if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
    errors.push("Time available is required.");
  }

  if (!tones.includes(tone as TrainingFormData["tone"])) {
    errors.push("Tone is required.");
  }

  if (errors.length > 0) {
    return { errors };
  }

  return {
    data: {
      audience,
      deliveryFormat: deliveryFormat as TrainingFormData["deliveryFormat"],
      durationMinutes,
      experienceLevel: experienceLevel as TrainingFormData["experienceLevel"],
      tone: tone as TrainingFormData["tone"],
      topic,
    },
    errors,
  };
}

function getAzureConfig(): {
  config?: Record<(typeof requiredEnvVars)[number], string>;
  missing: string[];
} {
  const missing = requiredEnvVars.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    return { missing };
  }

  return {
    config: {
      AZURE_OPENAI_API_KEY: process.env.AZURE_OPENAI_API_KEY ?? "",
      AZURE_OPENAI_API_VERSION: process.env.AZURE_OPENAI_API_VERSION ?? "",
      AZURE_OPENAI_DEPLOYMENT_NAME:
        process.env.AZURE_OPENAI_DEPLOYMENT_NAME ?? "",
      AZURE_OPENAI_ENDPOINT: process.env.AZURE_OPENAI_ENDPOINT ?? "",
    },
    missing,
  };
}

function buildTrainingPrompt(formData: TrainingFormData): string {
  return [
    "Create structured training materials as JSON only.",
    "The JSON must match this TypeScript shape exactly:",
    "{ title: string; summary: string; learningObjectives: { id: string; description: string }[]; agenda: { id: string; title: string; durationMinutes: number; description: string }[]; mainLesson: { title: string; sections: string[] }; scenarioActivity: { title: string; setup: string; instructions: string[]; debriefQuestions: string[] }; facilitatorNotes: string[]; knowledgeCheck: { id: string; question: string; options: string[]; correctAnswer: string; explanation?: string }[]; markdownDraft: string }",
    "Do not wrap the JSON in Markdown fences.",
    "",
    `Training topic: ${formData.topic}`,
    `Audience: ${formData.audience}`,
    `Learner skill level: ${formData.experienceLevel}`,
    `Delivery format: ${formData.deliveryFormat}`,
    `Time available: ${formData.durationMinutes} minutes`,
    `Tone: ${formData.tone}`,
  ].join("\n");
}

function parseModelContent(content: string): unknown {
  const trimmed = content.trim();

  if (trimmed.startsWith("```")) {
    const withoutFence = trimmed
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "");
    return JSON.parse(withoutFence);
  }

  return JSON.parse(trimmed);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function validateTrainingResult(value: unknown): TrainingResult | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    typeof value.title !== "string" ||
    typeof value.summary !== "string" ||
    typeof value.markdownDraft !== "string"
  ) {
    return null;
  }

  if (
    !Array.isArray(value.learningObjectives) ||
    !Array.isArray(value.agenda) ||
    !Array.isArray(value.knowledgeCheck) ||
    !isStringArray(value.facilitatorNotes) ||
    !isRecord(value.mainLesson) ||
    !isRecord(value.scenarioActivity)
  ) {
    return null;
  }

  const learningObjectives = value.learningObjectives.every(
    (item) =>
      isRecord(item) &&
      typeof item.id === "string" &&
      typeof item.description === "string",
  );
  const agenda = value.agenda.every(
    (item) =>
      isRecord(item) &&
      typeof item.id === "string" &&
      typeof item.title === "string" &&
      typeof item.durationMinutes === "number" &&
      typeof item.description === "string",
  );
  const knowledgeCheck = value.knowledgeCheck.every(
    (item) =>
      isRecord(item) &&
      typeof item.id === "string" &&
      typeof item.question === "string" &&
      isStringArray(item.options) &&
      typeof item.correctAnswer === "string" &&
      (item.explanation === undefined || typeof item.explanation === "string"),
  );
  const mainLesson =
    typeof value.mainLesson.title === "string" &&
    isStringArray(value.mainLesson.sections);
  const scenarioActivity =
    typeof value.scenarioActivity.title === "string" &&
    typeof value.scenarioActivity.setup === "string" &&
    isStringArray(value.scenarioActivity.instructions) &&
    isStringArray(value.scenarioActivity.debriefQuestions);

  if (
    !learningObjectives ||
    !agenda ||
    !knowledgeCheck ||
    !mainLesson ||
    !scenarioActivity
  ) {
    return null;
  }

  return value as TrainingResult;
}

async function callAzureOpenAI(
  formData: TrainingFormData,
  config: Record<(typeof requiredEnvVars)[number], string>,
): Promise<TrainingResult> {
  const endpoint = config.AZURE_OPENAI_ENDPOINT.replace(/\/+$/, "");
  const deployment = encodeURIComponent(config.AZURE_OPENAI_DEPLOYMENT_NAME);
  const apiVersion = encodeURIComponent(config.AZURE_OPENAI_API_VERSION);
  // Azure OpenAI deployments are addressed by deployment name, not model name.
  const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

  const response = await fetch(url, {
    body: JSON.stringify({
      messages: [
        {
          content:
            "You generate concise, practical training materials and return valid JSON only.",
          role: "system",
        },
        {
          content: buildTrainingPrompt(formData),
          role: "user",
        },
      ],
      response_format: {
        type: "json_object",
      },
      temperature: 0.4,
    }),
    headers: {
      "Content-Type": "application/json",
      "api-key": config.AZURE_OPENAI_API_KEY,
    },
    method: "POST",
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(
      `Azure OpenAI request failed with ${response.status}: ${responseText}`,
    );
  }

  const completion = (await response.json()) as AzureChatCompletionResponse;
  const content = completion.choices?.[0]?.message?.content;

  if (!content) {
    throw new InvalidModelResponseError(
      "Azure OpenAI response did not include message content.",
    );
  }

  let parsed: unknown;

  try {
    parsed = parseModelContent(content);
  } catch {
    throw new InvalidModelResponseError(
      "Azure OpenAI response was not valid JSON.",
    );
  }

  const result = validateTrainingResult(parsed);

  if (!result) {
    throw new InvalidModelResponseError(
      "Azure OpenAI response did not match TrainingResult.",
    );
  }

  return result;
}

export default async function generateTraining(
  context: FunctionContext,
  req: HttpRequest,
): Promise<void> {
  if (req.method?.toUpperCase() !== "POST") {
    errorResponse(
      context,
      405,
      "Only POST requests are supported.",
      "METHOD_NOT_ALLOWED",
    );
    return;
  }

  let body: unknown;

  try {
    body = parseRequestBody(req);
  } catch {
    errorResponse(context, 400, "Request body must be valid JSON.", "BAD_JSON");
    return;
  }

  const validation = validateFormData(body);

  if (!validation.data) {
    errorResponse(
      context,
      400,
      "Missing or invalid required fields.",
      "VALIDATION_ERROR",
      validation.errors,
    );
    return;
  }

  const { config, missing } = getAzureConfig();

  if (!config) {
    errorResponse(
      context,
      500,
      "Azure OpenAI environment variables are not configured.",
      "MISSING_ENVIRONMENT",
      missing,
    );
    return;
  }

  try {
    const result = await callAzureOpenAI(validation.data, config);

    jsonResponse(context, 200, {
      data: result,
      success: true,
    });
  } catch (error) {
    context.log?.("generate-training failed", error);

    if (error instanceof InvalidModelResponseError) {
      errorResponse(
        context,
        502,
        "The model returned an invalid training result.",
        "INVALID_MODEL_RESPONSE",
      );
      return;
    }

    errorResponse(
      context,
      502,
      "Training generation failed.",
      "AZURE_OPENAI_ERROR",
    );
  }
}
