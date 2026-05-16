import Link from "next/link";

export function LandingHero() {
  return (
    <main className="flex flex-1 items-center bg-[radial-gradient(circle_at_top_left,#d1fae5,transparent_32%),linear-gradient(135deg,#f8fafc_0%,#ecfeff_48%,#f7fee7_100%)] px-6 py-16">
      <section className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-700">
            TrainingForge AI
          </p>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
            Draft practical training plans faster.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
            Initial project shell for an AI-assisted training content generator.
            The app structure is ready; generation logic comes next.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/generator"
              className="rounded-full bg-slate-950 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Open generator
            </Link>
            <a
              href="https://nextjs.org/docs"
              className="rounded-full border border-slate-300 bg-white/70 px-6 py-3 text-center text-sm font-semibold text-slate-900 transition hover:bg-white"
            >
              Next.js docs
            </a>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-xl shadow-emerald-900/10 backdrop-blur">
          <div className="rounded-3xl bg-slate-950 p-6 text-white">
            <p className="text-sm text-emerald-200">Project status</p>
            <dl className="mt-6 space-y-5">
              <div>
                <dt className="text-sm text-slate-400">Framework</dt>
                <dd className="text-2xl font-semibold">Next.js + TypeScript</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-400">Styling</dt>
                <dd className="text-2xl font-semibold">Tailwind CSS</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-400">API placeholder</dt>
                <dd className="text-2xl font-semibold">Azure Function</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </main>
  );
}
