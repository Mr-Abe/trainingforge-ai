import { TrainingForm } from "@/components/TrainingForm";

export default function GeneratorPage() {
  return (
    <main className="flex flex-1 bg-stone-50 px-6 py-10 sm:py-14 lg:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <section>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-800">
            Generator
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-stone-950 sm:text-5xl">
            Build a training plan brief
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
            Fill in the placeholder brief below. Phase 1 only sets up the UI
            shell; AI generation, API calls, and Markdown download will be added
            later.
          </p>
        </section>

        <TrainingForm />
      </div>
    </main>
  );
}
