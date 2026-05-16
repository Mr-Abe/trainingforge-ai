export function TrainingResults() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-950">Results preview</h2>
      <p className="mt-2 text-sm text-slate-600">
        Generated markdown output will render here after the API is connected.
      </p>
      <div className="mt-5 rounded-2xl bg-slate-100 p-4 text-sm text-slate-700">
        No training plan generated yet.
      </div>
    </section>
  );
}
