import type { TrainingResult } from "@/lib/types";

type TrainingResultsProps = {
  result?: TrainingResult;
};

export function TrainingResults({ result }: TrainingResultsProps) {
  return (
    <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-stone-950">Results preview</h2>
      <p className="mt-2 text-sm leading-6 text-stone-600">
        Generated learning objectives, agenda items, facilitator notes, and
        knowledge checks will appear here after the API is connected.
      </p>

      <div className="mt-5 rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-5 text-sm text-stone-600">
        {result ? result.title : "No training plan generated yet."}
      </div>
    </section>
  );
}
