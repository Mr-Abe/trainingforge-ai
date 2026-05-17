"use client";

import { trainingResultToMarkdown } from "@/lib/markdown";
import type { TrainingResult } from "@/lib/types";
import { useState } from "react";

type TrainingResultsProps = {
  result: TrainingResult;
};

function createMarkdownFilename(title: string): string {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${slug || "training-plan"}.md`;
}

export function TrainingResults({ result }: TrainingResultsProps) {
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const markdown = trainingResultToMarkdown(result);

  async function handleCopy() {
    setActionMessage(null);

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard API is unavailable.");
      }

      await navigator.clipboard.writeText(markdown);
      setActionMessage("Copied Markdown to clipboard.");
    } catch {
      setActionMessage(
        "Copy failed. Your browser may require HTTPS or clipboard permission.",
      );
    }
  }

  function handleDownload() {
    const blob = new Blob([markdown], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = createMarkdownFilename(result.title);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setActionMessage("Markdown download created.");
  }

  return (
    <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-800">
            Mock result
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-stone-950">
            {result.title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            {result.summary}
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
          <button
            className="rounded-full bg-stone-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-stone-900/10 transition hover:-translate-y-0.5 hover:bg-stone-800"
            onClick={() => void handleCopy()}
            type="button"
          >
            Copy to Clipboard
          </button>
          <button
            className="rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-bold text-stone-950 transition hover:-translate-y-0.5 hover:border-stone-950"
            onClick={handleDownload}
            type="button"
          >
            Download Markdown
          </button>
        </div>
      </div>

      {actionMessage ? (
        <p className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">
          {actionMessage}
        </p>
      ) : null}

      <div className="mt-8 grid gap-6">
        <section className="rounded-3xl bg-stone-50 p-5">
          <h3 className="text-lg font-bold text-stone-950">
            Learning objectives
          </h3>
          <ul className="mt-4 space-y-3">
            {result.learningObjectives.map((objective) => (
              <li
                className="flex gap-3 text-sm leading-6 text-stone-700"
                key={objective.id}
              >
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-700" />
                <span>{objective.description}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl bg-stone-50 p-5">
          <h3 className="text-lg font-bold text-stone-950">Agenda</h3>
          <div className="mt-4 space-y-4">
            {result.agenda.map((item) => (
              <div
                className="rounded-2xl border border-stone-200 bg-white p-4"
                key={item.id}
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <h4 className="font-semibold text-stone-950">
                    {item.title}
                  </h4>
                  <span className="text-sm font-medium text-emerald-800">
                    {item.durationMinutes} min
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-stone-950 p-5 text-white">
          <h3 className="text-lg font-bold">{result.mainLesson.title}</h3>
          <div className="mt-4 space-y-3">
            {result.mainLesson.sections.map((section) => (
              <p className="text-sm leading-6 text-stone-200" key={section}>
                {section}
              </p>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-lime-100 p-5">
          <h3 className="text-lg font-bold text-stone-950">
            Scenario-based activity
          </h3>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            {result.scenarioActivity.setup}
          </p>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-stone-700">
            {result.scenarioActivity.instructions.map((instruction) => (
              <li key={instruction}>{instruction}</li>
            ))}
          </ol>
          <div className="mt-5 rounded-2xl bg-white/70 p-4">
            <h4 className="text-sm font-bold text-stone-950">
              Debrief questions
            </h4>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-700">
              {result.scenarioActivity.debriefQuestions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-3xl bg-stone-50 p-5">
          <h3 className="text-lg font-bold text-stone-950">
            Knowledge-check questions
          </h3>
          <div className="mt-4 space-y-4">
            {result.knowledgeCheck.map((question) => (
              <div
                className="rounded-2xl border border-stone-200 bg-white p-4"
                key={question.id}
              >
                <p className="font-semibold text-stone-950">
                  {question.question}
                </p>
                <ul className="mt-3 space-y-2 text-sm text-stone-600">
                  {question.options.map((option) => (
                    <li key={option}>{option}</li>
                  ))}
                </ul>
                <p className="mt-3 text-sm font-semibold text-emerald-800">
                  Correct answer: {question.correctAnswer}
                </p>
                {question.explanation ? (
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    {question.explanation}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-amber-50 p-5">
          <h3 className="text-lg font-bold text-stone-950">
            Facilitator notes
          </h3>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-700">
            {result.facilitatorNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}
