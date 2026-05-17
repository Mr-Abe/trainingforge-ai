"use client";

import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingState } from "@/components/LoadingState";
import {
  TrainingForm,
  type TrainingFormErrors,
  type TrainingFormValues,
} from "@/components/TrainingForm";
import { TrainingResults } from "@/components/TrainingResults";
import type { TrainingFormData, TrainingResult } from "@/lib/types";
import { useState } from "react";

const initialValues: TrainingFormValues = {
  audience: "",
  deliveryFormat: "",
  durationMinutes: "",
  experienceLevel: "",
  tone: "",
  topic: "",
};

const formatLabels: Record<TrainingFormData["deliveryFormat"], string> = {
  "hands-on-lab": "hands-on lab",
  presentation: "presentation",
  "self-paced": "self-paced module",
  workshop: "workshop",
};

const toneLabels: Record<TrainingFormData["tone"], string> = {
  executive: "executive",
  friendly: "friendly",
  practical: "practical",
  technical: "technical",
};

function validateForm(values: TrainingFormValues): TrainingFormErrors {
  const errors: TrainingFormErrors = {};

  if (!values.topic.trim()) {
    errors.topic = "Training topic is required.";
  }

  if (!values.audience.trim()) {
    errors.audience = "Audience is required.";
  }

  if (!values.experienceLevel) {
    errors.experienceLevel = "Learner skill level is required.";
  }

  if (!values.deliveryFormat) {
    errors.deliveryFormat = "Delivery format is required.";
  }

  if (!values.durationMinutes.trim()) {
    errors.durationMinutes = "Time available is required.";
  }

  if (!values.tone) {
    errors.tone = "Tone is required.";
  }

  return errors;
}

function toTrainingFormData(values: TrainingFormValues): TrainingFormData {
  return {
    audience: values.audience.trim(),
    deliveryFormat: values.deliveryFormat as TrainingFormData["deliveryFormat"],
    durationMinutes: Number(values.durationMinutes),
    experienceLevel: values.experienceLevel as TrainingFormData["experienceLevel"],
    tone: values.tone as TrainingFormData["tone"],
    topic: values.topic.trim(),
  };
}

function createMockTrainingResult(formData: TrainingFormData): TrainingResult {
  const duration = formData.durationMinutes;
  const firstSegment = Math.max(10, Math.round(duration * 0.2));
  const secondSegment = Math.max(15, Math.round(duration * 0.35));
  const thirdSegment = Math.max(15, Math.round(duration * 0.3));
  const finalSegment = Math.max(5, duration - firstSegment - secondSegment - thirdSegment);

  return {
    agenda: [
      {
        description:
          "Frame the purpose, define success for the session, and connect the topic to the audience's day-to-day work.",
        durationMinutes: firstSegment,
        id: "agenda-1",
        title: "Context and outcomes",
      },
      {
        description:
          "Introduce the core process, examples, and decision points learners need to understand.",
        durationMinutes: secondSegment,
        id: "agenda-2",
        title: "Guided lesson",
      },
      {
        description:
          "Practice with a realistic scenario and compare approaches in small groups.",
        durationMinutes: thirdSegment,
        id: "agenda-3",
        title: "Scenario activity",
      },
      {
        description:
          "Check understanding, answer questions, and identify next actions.",
        durationMinutes: finalSegment,
        id: "agenda-4",
        title: "Knowledge check and wrap-up",
      },
    ],
    facilitatorNotes: [
      `Keep examples specific to ${formData.audience}.`,
      `Use a ${toneLabels[formData.tone]} tone and avoid unnecessary jargon unless it helps the audience.`,
      "Ask learners to explain tradeoffs in their own words before showing the recommended answer.",
      "Capture unanswered questions for follow-up material in a later version.",
    ],
    knowledgeCheck: [
      {
        correctAnswer: "Apply the process to a realistic example and explain the decision.",
        explanation:
          "The goal is not recall alone. Learners should demonstrate how they would use the training in context.",
        id: "question-1",
        options: [
          "Repeat the session title",
          "Apply the process to a realistic example and explain the decision.",
          "List every agenda item from memory",
          "Skip practice and move directly to feedback",
        ],
        question: `What is the best evidence that ${formData.audience} understood ${formData.topic}?`,
      },
      {
        correctAnswer: "Pause, clarify the scenario, and connect the next step to the objective.",
        explanation:
          "Facilitation should bring the group back to the desired behavior instead of rushing through content.",
        id: "question-2",
        options: [
          "Move on quickly to preserve time",
          "Pause, clarify the scenario, and connect the next step to the objective.",
          "Give everyone the answer immediately",
          "Remove the activity from the session",
        ],
        question: "What should the facilitator do if learners get stuck during the activity?",
      },
    ],
    learningObjectives: [
      {
        description: `Explain the purpose of ${formData.topic} in language that fits ${formData.audience}.`,
        id: "objective-1",
      },
      {
        description:
          "Identify the most important steps, risks, and success criteria for the topic.",
        id: "objective-2",
      },
      {
        description:
          "Apply the core lesson to a realistic scenario and justify the chosen approach.",
        id: "objective-3",
      },
    ],
    mainLesson: {
      sections: [
        `Start by defining what ${formData.topic} means for ${formData.audience} and why it matters now.`,
        "Break the concept into a small set of repeatable decisions learners can recognize and practice.",
        "Use contrast examples to show the difference between a weak response and a strong response.",
        "Close the lesson by connecting the concept back to the scenario activity and knowledge check.",
      ],
      title: "Main lesson",
    },
    markdownDraft: "",
    scenarioActivity: {
      debriefQuestions: [
        "What information did your group need before making a decision?",
        "Where did the scenario feel ambiguous or risky?",
        "What would you do differently with a real stakeholder or customer involved?",
      ],
      instructions: [
        "Split learners into pairs or small groups.",
        "Give each group a short scenario connected to the training topic.",
        "Ask each group to choose a response and explain the reasoning.",
        "Compare responses as a full group and identify the strongest pattern.",
      ],
      setup: `Learners work through a realistic ${formatLabels[formData.deliveryFormat]} scenario where ${formData.audience} must apply ${formData.topic} under time pressure.`,
      title: "Practice scenario",
    },
    summary: `A ${duration}-minute ${formatLabels[formData.deliveryFormat]} for ${formData.experienceLevel} learners, written in a ${toneLabels[formData.tone]} tone.`,
    title: `${formData.topic} training for ${formData.audience}`,
  };
}

function waitForMockResult() {
  return new Promise((resolve) => {
    window.setTimeout(resolve, 800);
  });
}

export default function GeneratorPage() {
  const [errors, setErrors] = useState<TrainingFormErrors>({});
  const [formValues, setFormValues] =
    useState<TrainingFormValues>(initialValues);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TrainingResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function updateField<TField extends keyof TrainingFormValues>(
    field: TField,
    value: TrainingFormValues[TField],
  ) {
    setFormValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit() {
    const nextErrors = validateForm(formValues);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSubmitError("Please complete the required fields before generating.");
      setResult(null);
      return;
    }

    setErrors({});
    setSubmitError(null);
    setIsLoading(true);
    setResult(null);

    await waitForMockResult();

    setResult(createMockTrainingResult(toTrainingFormData(formValues)));
    setIsLoading(false);
  }

  return (
    <main className="flex flex-1 bg-stone-50 px-6 py-10 sm:py-14 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-800">
            Generator
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-stone-950 sm:text-5xl">
            Build a training plan brief
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
            Fill in the form below to preview the frontend-only generation
            flow. Results are mocked for now; no Azure Function, AI API,
            clipboard, or Markdown download is connected yet.
          </p>
        </section>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="space-y-4">
            {submitError ? <ErrorMessage message={submitError} /> : null}
            <TrainingForm
              errors={errors}
              isLoading={isLoading}
              onChange={updateField}
              onSubmit={() => void handleSubmit()}
              values={formValues}
            />
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <LoadingState message="Creating a mock training plan..." />
            ) : null}
            {result ? (
              <TrainingResults result={result} />
            ) : (
              <section className="rounded-[2rem] border border-dashed border-stone-300 bg-white/70 p-6 text-sm leading-6 text-stone-600">
                Complete the form and generate a plan to see mock training
                results here.
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
