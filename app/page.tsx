import Link from "next/link";

const tools = [
  {
    title: "Rating Converter",
    description: "Compare WTN, UTR, LK and NTRP with practical estimated level ranges.",
    href: "/rating-converter",
    label: "Level",
    number: "01",
    status: "Live",
  },
  {
    title: "Racket Finder",
    description: "Find rackets based on your level, style, swing feel and comfort needs.",
    href: "/racket-finder",
    label: "Rackets",
    number: "02",
    status: "Live",
  },
  {
    title: "String Finder",
    description: "Discover strings that fit your game, comfort needs and durability profile.",
    href: "/string-finder",
    label: "Strings",
    number: "03",
    status: "Live",
  },
  {
    title: "String Tension",
    description: "Estimate tension and compare it against your current setup.",
    href: "/string-tension",
    label: "Tension",
    number: "04",
    status: "Live",
  },
];

const workflow = [
  {
    title: "Understand your level",
    text: "Start with rating systems and get a clearer idea of where your game fits.",
  },
  {
    title: "Match your equipment",
    text: "Use your level, style and comfort needs to find better racket options.",
  },
  {
    title: "Tune your setup",
    text: "Choose strings and tension based on what you want to improve on court.",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slowFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes softPulse {
          0%, 100% {
            opacity: 0.18;
          }
          50% {
            opacity: 0.3;
          }
        }

        .fade-up {
          animation: fadeUp 0.7s ease-out both;
        }

        .delay-1 {
          animation-delay: 0.08s;
        }

        .delay-2 {
          animation-delay: 0.16s;
        }

        .delay-3 {
          animation-delay: 0.24s;
        }

        .float-soft {
          animation: slowFloat 6s ease-in-out infinite;
        }

        .pulse-soft {
          animation: softPulse 4s ease-in-out infinite;
        }
      `}</style>

      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="pulse-soft absolute left-1/2 top-[-220px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-emerald-400/20 blur-[130px]" />
        <div className="pulse-soft absolute bottom-[-260px] right-[-160px] h-[520px] w-[520px] rounded-full bg-cyan-400/10 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_35%)]" />
      </div>

      <section className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-7">
        {/* Header */}
        <header className="fade-up flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.9)] transition group-hover:scale-125" />
            <span className="text-sm font-semibold tracking-tight text-white">
              Tennis<span className="text-emerald-400">Level</span>Hub
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm text-slate-400 md:flex">
            <Link href="/rating-converter" className="transition hover:text-white">
              Ratings
            </Link>
            <Link href="/racket-finder" className="transition hover:text-white">
              Rackets
            </Link>
            <Link href="/string-finder" className="transition hover:text-white">
              Strings
            </Link>
            <Link href="/string-tension" className="transition hover:text-white">
              Tension
            </Link>
          </nav>

          <Link
            href="/rating-converter"
            className="hidden rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-emerald-400/50 hover:bg-white/[0.08] md:block"
          >
            Open tools
          </Link>
        </header>

        {/* Hero */}
        <section className="flex flex-1 flex-col justify-center py-20">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="fade-up delay-1 mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300 backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Built for club players, juniors and competitive amateurs
              </div>

              <h1 className="fade-up delay-2 max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">
                Smarter tennis tools.
                <span className="block text-slate-500">
                  Better decisions.
                </span>
              </h1>

              <p className="fade-up delay-3 mt-6 max-w-2xl text-lg leading-8 text-slate-400">
                Compare ratings, find rackets, choose strings and estimate
                tension with clean, practical tools made for real players — not
                just professionals.
              </p>

              <div className="fade-up delay-3 mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/rating-converter"
                  className="rounded-full bg-emerald-400 px-6 py-3 text-center text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-emerald-300 hover:shadow-[0_0_30px_rgba(52,211,153,0.25)]"
                >
                  Start with your level
                </Link>

                <Link
                  href="/string-tension"
                  className="rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-center text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-emerald-400/60 hover:bg-white/[0.08]"
                >
                  Calculate string tension
                </Link>
              </div>

              <div className="fade-up delay-3 mt-8 flex flex-wrap gap-3 text-sm text-slate-500">
                <span className="rounded-full bg-white/[0.04] px-3 py-1">
                  Free to use
                </span>
                <span className="rounded-full bg-white/[0.04] px-3 py-1">
                  No login
                </span>
                <span className="rounded-full bg-white/[0.04] px-3 py-1">
                  Estimated results
                </span>
              </div>
            </div>

            {/* Product preview card */}
            <div className="fade-up delay-3 float-soft rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur">
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-emerald-400">
                      Example output
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold">
                      String Tension
                    </h2>
                  </div>

                  <div className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-300">
                    88% confidence
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/[0.04] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Poly mains
                    </p>
                    <p className="mt-2 text-3xl font-bold text-emerald-300">
                      46 lbs
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Range: 44–48 lbs
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/[0.04] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Soft crosses
                    </p>
                    <p className="mt-2 text-3xl font-bold text-emerald-300">
                      50 lbs
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Range: 48–52 lbs
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-white/[0.04] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Compared to current setup
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <Change label="Power" value="+15%" positive />
                    <Change label="Spin potential" value="+10%" positive />
                    <Change label="Comfort" value="+12%" positive />
                    <Change label="Control" value="-8%" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tools */}
          <section className="mt-24">
            <div className="fade-up mb-7 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
                  Tools
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight">
                  Choose what you want to improve
                </h2>
              </div>

              <p className="hidden max-w-sm text-sm leading-6 text-slate-500 md:block">
                Each tool is designed to give practical ranges and suggestions,
                not fake exact answers.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {tools.map((tool, index) => (
                <Link
                  key={tool.title}
                  href={tool.href}
                  className="group fade-up rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-emerald-400/50 hover:bg-white/[0.075]"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <div className="mb-9 flex items-center justify-between">
                    <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-400">
                      {tool.label}
                    </span>

                    <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                      {tool.status}
                    </span>
                  </div>

                  <p className="mb-2 text-sm text-slate-600">{tool.number}</p>

                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-semibold tracking-tight">
                      {tool.title}
                    </h3>

                    <span className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-emerald-400">
                      →
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {tool.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {/* Workflow */}
          <section className="mt-20 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
                  Simple workflow
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight">
                  From rating to racket setup.
                </h2>
                <p className="mt-4 text-sm leading-6 text-slate-400">
                  Tennis equipment decisions get easier when you understand your
                  level, your playing style and what your current setup is doing.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {workflow.map((item, index) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-slate-950/60 p-5"
                  >
                    <p className="text-sm font-semibold text-emerald-400">
                      Step {index + 1}
                    </p>
                    <h3 className="mt-3 font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-14 flex flex-col justify-between gap-4 border-t border-white/10 pt-7 text-sm text-slate-600 md:flex-row">
            <p>
              Tennis Level Hub is an independent project. Results are estimates
              only.
            </p>

            <div className="flex gap-5">
              <Link href="/rating-converter" className="transition hover:text-slate-300">
                Ratings
              </Link>
              <Link href="/racket-finder" className="transition hover:text-slate-300">
                Rackets
              </Link>
              <Link href="/string-finder" className="transition hover:text-slate-300">
                Strings
              </Link>
              <Link href="/string-tension" className="transition hover:text-slate-300">
                Tension
              </Link>
            </div>
          </footer>
        </section>
      </section>
    </main>
  );
}

function Change({
  label,
  value,
  positive = false,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-xl bg-slate-950/70 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p
        className={`mt-1 text-lg font-semibold ${
          positive ? "text-emerald-300" : "text-red-300"
        }`}
      >
        {value}
      </p>
    </div>
  );
}