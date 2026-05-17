import Link from "next/link";

const audiences = [
  "Trainers building repeatable workshops",
  "Small businesses documenting internal know-how",
  "Nonprofits turning programs into teachable sessions",
  "Technical teams creating onboarding and enablement materials",
];

export function LandingHero() {
  return (
    <main className="flex flex-1 overflow-hidden bg-[#f7f2e8] px-6 py-12 sm:py-16 lg:px-8">
      <section className="relative mx-auto grid w-full max-w-7xl gap-10 rounded-[2rem] border border-stone-200 bg-[#fffaf0] p-6 shadow-2xl shadow-stone-300/40 sm:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:p-14">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-lime-300/40 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-cyan-300/30 blur-3xl" />

        <div className="relative">
          <p className="text-sm font-bold uppercase tracking-[0.32em] text-emerald-800">
            TrainingForge AI
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight text-stone-950 sm:text-6xl lg:text-7xl">
            Turn rough ideas into structured training plans.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700 sm:text-xl">
            TrainingForge AI helps teams draft objectives, agendas,
            facilitator notes, and knowledge checks from a simple training
            brief.
          </p>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
            Built for trainers, small businesses, nonprofits, and technical
            teams that need practical learning materials without starting from a
            blank page.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/generator"
              className="rounded-full bg-stone-950 px-6 py-3 text-center text-sm font-bold text-white shadow-lg shadow-stone-900/20 transition hover:-translate-y-0.5 hover:bg-stone-800"
            >
              Start a training plan
            </Link>
            <span className="text-sm font-medium text-stone-500">
              Phase 1 UI shell: no API calls yet
            </span>
          </div>
        </div>

        <div className="relative rounded-[2rem] bg-stone-950 p-4 text-white shadow-2xl shadow-stone-950/20 sm:p-6">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-lime-200">
              Who it supports
            </p>
            <ul className="mt-6 space-y-4">
              {audiences.map((audience) => (
                <li
                  className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm leading-6 text-stone-100"
                  key={audience}
                >
                  {audience}
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-2xl bg-lime-200 p-4 text-stone-950">
              <p className="text-sm font-bold">Output target</p>
              <p className="mt-1 text-sm">
                A clear training outline ready for review, editing, and future
                export.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
