import Link from "next/link";

const tools = [
  {
    title: "Tennis Rating Converter",
    description: "Convert WTN, UTR, LK and NTRP into an estimated tennis level.",
    href: "/rating-converter",
    status: "Available",
  },
  {
    title: "Racket Finder",
    description: "Find a tennis racket based on your level, style and preferences.",
    href: "/racket-finder",
    status: "Available",
  },
  {
    title: "String Finder",
    description: "Discover which tennis string type could fit your game best.",
    href: "#",
    status: "Coming soon",
  },
  {
    title: "String Tension Calculator",
    description: "Estimate a suitable string tension based on power, control and comfort.",
    href: "#",
    status: "Coming soon",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
        <div className="mb-12 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
            Tennis Level Hub
          </p>

          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Smart tennis tools for club players.
          </h1>

          <p className="mt-5 text-lg text-slate-300">
            Compare tennis ratings, find equipment and understand your level with
            simple tools built for real players.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {tools.map((tool) => {
            const isAvailable = tool.status === "Available";

            const card = (
              <div
                className={`h-full rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl transition ${
                  isAvailable
                    ? "hover:-translate-y-1 hover:border-emerald-400/70 hover:bg-white/10"
                    : "opacity-70"
                }`}
              >
                <div className="mb-5 flex items-center justify-between gap-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      isAvailable
                        ? "bg-emerald-400/10 text-emerald-300"
                        : "bg-slate-700 text-slate-300"
                    }`}
                  >
                    {tool.status}
                  </span>

                  <span className="text-2xl">🎾</span>
                </div>

                <h2 className="text-2xl font-bold">{tool.title}</h2>

                <p className="mt-3 text-slate-300">{tool.description}</p>

                <p className="mt-6 text-sm font-semibold text-emerald-400">
                  {isAvailable ? "Open tool →" : "Not available yet"}
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

        <p className="mt-10 max-w-3xl text-sm text-slate-500">
          Tennis Level Hub is an independent project. Rating conversions and
          equipment suggestions are estimates only and are not official rankings.
        </p>
      </section>
    </main>
  );
}