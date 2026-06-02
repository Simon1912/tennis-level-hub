"use client";

import { useState } from "react";

type RatingSystem = "WTN" | "UTR" | "LK" | "NTRP";

type LevelBand = {
  label: string;
  wtn: string;
  utr: string;
  lk: string;
  ntrp: string;
  description: string;
};

const levelBands: LevelBand[] = [
  {
    label: "Beginner",
    wtn: "40–35",
    utr: "1–2",
    lk: "25–22",
    ntrp: "1.0–2.0",
    description: "New or casual player learning basic technique and rally consistency.",
  },
  {
    label: "Recreational",
    wtn: "34–30",
    utr: "2–4",
    lk: "21–18",
    ntrp: "2.5–3.0",
    description: "Can rally and serve, but consistency and match tactics are still developing.",
  },
  {
    label: "Club Player",
    wtn: "29–25",
    utr: "4–6",
    lk: "17–14",
    ntrp: "3.0–3.5",
    description: "Solid club level. Can compete in local matches and has clear strengths.",
  },
  {
    label: "Competitive Club Player",
    wtn: "24–20",
    utr: "6–8",
    lk: "13–10",
    ntrp: "4.0–4.5",
    description: "Strong club/interclub player with reliable weapons and better point construction.",
  },
  {
    label: "Advanced Competitive",
    wtn: "19–15",
    utr: "8–10",
    lk: "9–7",
    ntrp: "4.5–5.0",
    description: "High level competitive player. Strong technique, athleticism and match experience.",
  },
  {
    label: "High Performance",
    wtn: "14–10",
    utr: "10–12",
    lk: "6–4",
    ntrp: "5.0–5.5",
    description: "Very strong player, often competing at regional, national or college level.",
  },
  {
    label: "Elite",
    wtn: "9–1",
    utr: "12–16.5",
    lk: "3–1",
    ntrp: "6.0+",
    description: "Elite, national, college or professional-level tennis.",
  },
];

function getBand(system: RatingSystem, value: number): LevelBand | null {
  if (Number.isNaN(value)) return null;

  if (system === "WTN") {
    if (value >= 35 && value <= 40) return levelBands[0];
    if (value >= 30 && value < 35) return levelBands[1];
    if (value >= 25 && value < 30) return levelBands[2];
    if (value >= 20 && value < 25) return levelBands[3];
    if (value >= 15 && value < 20) return levelBands[4];
    if (value >= 10 && value < 15) return levelBands[5];
    if (value >= 1 && value < 10) return levelBands[6];
  }

  if (system === "UTR") {
    if (value >= 1 && value <= 2) return levelBands[0];
    if (value > 2 && value <= 4) return levelBands[1];
    if (value > 4 && value <= 6) return levelBands[2];
    if (value > 6 && value <= 8) return levelBands[3];
    if (value > 8 && value <= 10) return levelBands[4];
    if (value > 10 && value <= 12) return levelBands[5];
    if (value > 12 && value <= 16.5) return levelBands[6];
  }

  if (system === "LK") {
    if (value >= 22 && value <= 25) return levelBands[0];
    if (value >= 18 && value < 22) return levelBands[1];
    if (value >= 14 && value < 18) return levelBands[2];
    if (value >= 10 && value < 14) return levelBands[3];
    if (value >= 7 && value < 10) return levelBands[4];
    if (value >= 4 && value < 7) return levelBands[5];
    if (value >= 1 && value < 4) return levelBands[6];
  }

  if (system === "NTRP") {
    if (value >= 1 && value <= 2) return levelBands[0];
    if (value > 2 && value <= 3) return levelBands[1];
    if (value > 3 && value <= 3.5) return levelBands[2];
    if (value > 3.5 && value <= 4.5) return levelBands[3];
    if (value > 4.5 && value <= 5) return levelBands[4];
    if (value > 5 && value <= 5.5) return levelBands[5];
    if (value > 5.5) return levelBands[6];
  }

  return null;
}

export default function Home() {
  const [system, setSystem] = useState<RatingSystem>("WTN");
  const [rating, setRating] = useState("");
  const value = Number(rating);
  const result = rating ? getBand(system, value) : null;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-16">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
            Tennis Level Hub
          </p>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Tennis Rating Converter
          </h1>
          <p className="mt-5 max-w-2xl text-slate-300">
            Convert WTN, UTR, LK and NTRP into an estimated tennis level.
            This is not official — it is a practical comparison tool for players.
          </p>
        </div>

        <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Rating system
              </label>
              <select
                value={system}
                onChange={(e) => setSystem(e.target.value as RatingSystem)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400"
              >
                <option value="WTN">WTN</option>
                <option value="UTR">UTR</option>
                <option value="LK">LK</option>
                <option value="NTRP">NTRP</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Your rating
              </label>
              <input
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                placeholder="Example: 27"
                type="number"
                step="0.1"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-900 p-5">
            {!rating && (
              <p className="text-slate-400">
                Enter a tennis rating to see the estimated equivalents.
              </p>
            )}

            {rating && !result && (
              <p className="text-red-300">
                This rating is outside the expected range. Try another value.
              </p>
            )}

            {result && (
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">
                  Estimated level
                </p>
                <h2 className="mt-2 text-3xl font-bold">{result.label}</h2>
                <p className="mt-3 text-slate-300">{result.description}</p>

                <div className="mt-6 grid gap-3 sm:grid-cols-4">
                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-sm text-slate-400">WTN</p>
                    <p className="text-xl font-semibold">{result.wtn}</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-sm text-slate-400">UTR</p>
                    <p className="text-xl font-semibold">{result.utr}</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-sm text-slate-400">LK</p>
                    <p className="text-xl font-semibold">{result.lk}</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-sm text-slate-400">NTRP</p>
                    <p className="text-xl font-semibold">{result.ntrp}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Disclaimer: These conversions are estimates only. WTN, UTR, LK and
            NTRP use different rating methods, so exact conversion is not possible.
          </p>
        </div>
      </section>
    </main>
  );
}