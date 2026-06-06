import Link from "next/link";

const tools = [
  {
    title: "Tennis Rating Converter",
    description:
      "Compare WTN, UTR, LK and NTRP ratings with estimated level ranges.",
    href: "/rating-converter",
    status: "Available",
    tag: "Ratings",
  },
  {
    title: "Racket Finder",
    description:
      "Get racket recommendations based on your level, style, swing feel and comfort needs.",
    href: "/racket-finder",
    status: "Available",
    tag: "Equipment",
  },
  {
    title: "String Finder",
    description:
      "Find string types that fit your game, from comfort multis to spin-friendly polys.",
    href: "/string-finder",
    status: "Available",
    tag: "Strings",
  },
  {
    title: "String Tension Calculator",
    description:
      "Estimate a suitable string tension based on power, control, comfort and spin.",
    href: "#",
    status: "Coming soon",
    tag: "Tension",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-6xl px-6 py-8">
        <header className="flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight">
            Tennis<span className="text-emerald-400">Level</span>Hub
          </Link>

          <nav className="hidden gap-6 text-sm text-slate-300 md:flex">
            <Link href="/rating-converter" className="hover:text-emerald-400">
              Rating Converter
            </Link>
            <Link href="/racket-finder" className="hover:text-emerald-400">
              Racket Finder
            </Link>
          </nav>
        </header>

        <div className="grid min-h-[80vh] items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
              Tennis tools for real players
            </p>

            <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
              Understand your level. Find better gear.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Tennis Level Hub helps club players, juniors and competitive
              amateurs compare rating systems, understand their level and find
              equipment that fits their game.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/rating-converter"
                className="rounded-full bg-emerald-400 px-6 py-3 text-center font-semibold text-slate-950 transition hover:bg-emerald-300"
              >
                Convert your rating
              </Link>

              <Link
                href="/racket-finder"
                className="rounded-full border border-white/15 px-6 py-3 text-center font-semibold text-white transition hover:border-emerald-400 hover:text-emerald-400"
              >
                Find a racket
              </Link>
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Independent project. All rating conversions and recommendations are
              estimates only.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Quick tools
            </p>

            <div className="mt-5 space-y-3">
              <MiniStat label="Rating systems" value="WTN · UTR · LK · NTRP" />
              <MiniStat label="Racket database" value="30 popular rackets" />
              <MiniStat label="Finder logic" value="Level · Style · Comfort" />
            </div>
          </div>
        </div>

        <section className="pb-16">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Tools
            </p>
            <h2 className="mt-3 text-3xl font-bold">Choose a tennis tool</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {tools.map((tool) => {
              const isAvailable = tool.status === "Available";

              const card = (
                <div
                  className={`h-full rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl transition ${
                    isAvailable
                      ? "hover:-translate-y-1 hover:border-emerald-400/70 hover:bg-white/10"
                      : "opacity-60"
                  }`}
                >
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-300">
                      {tool.tag}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        isAvailable
                          ? "bg-emerald-400/10 text-emerald-300"
                          : "bg-slate-700 text-slate-300"
                      }`}
                    >
                      {tool.status}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold">{tool.title}</h3>
                  <p className="mt-3 text-slate-300">{tool.description}</p>

                  <p className="mt-6 text-sm font-semibold text-emerald-400">
                    {isAvailable ? "Open tool →" : "Coming soon"}
                  </p>
                </div>
              );

              return isAvailable ? (
                <Link key={tool.title} href={tool.href}>
                  {card}
                </Link>
              ) : (
                <div key={tool.title}>{card}</div>
              );
            })}
          </div>
        </section>

        <section className="border-t border-white/10 py-10">
          <div className="grid gap-6 md:grid-cols-3">
            <InfoBlock
              title="Built for club players"
              text="Not just pros. The tools are made for players who compete in clubs, school teams, interclub and local tournaments."
            />
            <InfoBlock
              title="Practical estimates"
              text="Rating systems are different, so exact conversion is impossible. This site gives useful ranges instead of fake precision."
            />
            <InfoBlock
              title="More tools coming"
              text="The plan is to add string recommendations, tension guidance, serve speed estimates and training tools."
            />
          </div>
        </section>
      </section>
    </main>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-900 p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}

function InfoBlock({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
    </div>
  );
}