import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingState } from "@/components/LoadingState";
import { TrainingForm } from "@/components/TrainingForm";
import { TrainingResults } from "@/components/TrainingResults";

export default function GeneratorPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-12">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
          Generator
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          Training plan builder
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Placeholder flow for collecting training goals and previewing AI
          generated content.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <TrainingForm />
        <div className="space-y-6">
          <LoadingState />
          <ErrorMessage />
          <TrainingResults />
        </div>
      </div>
    </main>
  );
}
