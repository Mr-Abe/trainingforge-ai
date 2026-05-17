const formats = ["Workshop", "Self-paced", "Presentation", "Hands-on lab"];

export function TrainingForm() {
  return (
    <form className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-950">
            Training brief
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
            Placeholder form for the future generator request. These inputs are
            not submitted yet.
          </p>
        </div>
        <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-800">
          UI only
        </span>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-sm font-semibold text-stone-800">Topic</span>
          <input
            className="mt-2 w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            name="topic"
            placeholder="Example: Volunteer onboarding"
            type="text"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-stone-800">
            Audience
          </span>
          <input
            className="mt-2 w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            name="audience"
            placeholder="Example: New coordinators"
            type="text"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-stone-800">
            Duration
          </span>
          <input
            className="mt-2 w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            min={15}
            name="durationMinutes"
            placeholder="60"
            type="number"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-stone-800">Format</span>
          <select
            className="mt-2 w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-950 outline-none transition focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            name="deliveryFormat"
          >
            {formats.map((format) => (
              <option key={format}>{format}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-stone-800">
            Experience level
          </span>
          <select
            className="mt-2 w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-950 outline-none transition focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            name="experienceLevel"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
            <option>Mixed</option>
          </select>
        </label>

        <label className="block sm:col-span-2">
          <span className="text-sm font-semibold text-stone-800">
            Training goal
          </span>
          <textarea
            className="mt-2 min-h-32 w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            name="trainingGoal"
            placeholder="Describe what participants should be able to do after the training."
          />
        </label>
      </div>

      <button
        className="mt-8 rounded-full bg-stone-950 px-6 py-3 text-sm font-bold text-white opacity-60"
        disabled
        type="button"
      >
        Generate plan coming soon
      </button>
    </form>
  );
}
