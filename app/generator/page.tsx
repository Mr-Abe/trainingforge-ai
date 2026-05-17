"use client";

import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingState } from "@/components/LoadingState";
import {
  TrainingForm,
  type TrainingFormErrors,
  type TrainingFormValues,
} from "@/components/TrainingForm";
import { TrainingResults } from "@/components/TrainingResults";
import { generateTraining } from "@/lib/api";
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

    try {
      const generatedResult = await generateTraining(
        toTrainingFormData(formValues),
      );
      setResult(generatedResult);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to generate training materials.",
      );
    } finally {
      setIsLoading(false);
    }
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
            Fill in the form below to generate structured training materials
            through the backend API. Copy and Markdown download stay available
            after a successful response.
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
              <LoadingState message="Generating training materials..." />
            ) : null}
            {result ? (
              <TrainingResults result={result} />
            ) : (
              <section className="rounded-[2rem] border border-dashed border-stone-300 bg-white/70 p-6 text-sm leading-6 text-stone-600">
                Complete the form and generate a plan to see training results
                here.
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
