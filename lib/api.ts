import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  TrainingFormData,
  TrainingResult,
} from "./types";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

function buildApiUrl(path: string): string {
  return `${apiBaseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return (
    isRecord(value) &&
    value.success === false &&
    isRecord(value.error) &&
    typeof value.error.message === "string"
  );
}

function isApiSuccessResponse(
  value: unknown,
): value is ApiSuccessResponse<TrainingResult> {
  return isRecord(value) && value.success === true && isRecord(value.data);
}

async function parseJsonResponse(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error("The server returned an unreadable response.");
  }
}

export async function generateTraining(
  request: TrainingFormData,
): Promise<TrainingResult> {
  let response: Response;

  try {
    response = await fetch(buildApiUrl("/generate-training"), {
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
  } catch {
    throw new Error("Unable to reach the training generator API.");
  }

  const payload = await parseJsonResponse(response);

  if (!response.ok) {
    if (isApiErrorResponse(payload)) {
      const details = payload.error.details?.length
        ? ` ${payload.error.details.join(" ")}`
        : "";

      throw new Error(`${payload.error.message}${details}`);
    }

    throw new Error("The training generator API returned an error.");
  }

  if (!isApiSuccessResponse(payload)) {
    throw new Error("The training generator API returned an invalid response.");
  }

  return payload.data;
}
