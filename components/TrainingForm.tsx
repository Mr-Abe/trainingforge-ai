export function TrainingForm() {
  return (
    <form className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-950">Training inputs</h2>
      <p className="mt-2 text-sm text-slate-600">
        Static placeholder fields for the upcoming generator workflow.
      </p>

      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Topic</span>
          <input
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            placeholder="Example: Sales onboarding"
            type="text"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Audience</span>
          <input
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            placeholder="Example: New account executives"
            type="text"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Goals</span>
          <textarea
            className="mt-2 min-h-32 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            placeholder="List the outcomes this training should drive."
          />
        </label>
      </div>

      <button
        className="mt-6 rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
        type="button"
      >
        Generate placeholder
      </button>
    </form>
  );
}
