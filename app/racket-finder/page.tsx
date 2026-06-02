"use client";

import Link from "next/link";
import { useState } from "react";
import { rackets, type Racket, type WeightClass } from "../data/rackets";

type PlayStyle = "allround" | "power" | "spin" | "control" | "attacking";
type Level = "beginner" | "club" | "advanced";

type Priority =
  | "power"
  | "control"
  | "spin"
  | "comfort"
  | "maneuverability"
  | "forgiveness"
  | "stability";

type SwingFeel = "balanced" | "easy-to-swing" | "stable" | "free-power";
type ForgivenessNeed = "low" | "medium" | "high";
type WeightPreference = "no-preference" | WeightClass;

const priorityLabels: Record<Priority, string> = {
  power: "More free power",
  control: "More control",
  spin: "More spin",
  comfort: "More comfort",
  maneuverability: "Easier to swing",
  forgiveness: "Bigger sweet spot",
  stability: "More stability",
};

const levelLabels: Record<Level, string> = {
  beginner: "Beginner / improving player",
  club: "Club / interclub player",
  advanced: "Advanced competitive player",
};

const playStyleLabels: Record<PlayStyle, string> = {
  allround: "All-round player",
  power: "Power baseline player",
  spin: "Heavy topspin player",
  control: "Control / placement player",
  attacking: "Attacking player",
};

const swingFeelLabels: Record<SwingFeel, string> = {
  balanced: "Balanced feel",
  "easy-to-swing": "Easy to swing fast",
  stable: "Stable through contact",
  "free-power": "More free power",
};

const weightLabels: Record<WeightPreference, string> = {
  "no-preference": "No preference",
  light: "Lighter racket",
  medium: "Standard 295–305g racket",
  heavy: "Heavier, more stable racket",
};

const forgivenessLabels: Record<ForgivenessNeed, string> = {
  low: "Not very important",
  medium: "Somewhat important",
  high: "Very important",
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getPriorityScore(racket: Racket, priority: Priority) {
  return racket[priority];
}

function scoreRacket(
  racket: Racket,
  level: Level,
  playStyle: PlayStyle,
  primary: Priority,
  secondary: Priority,
  swingFeel: SwingFeel,
  weightPreference: WeightPreference,
  forgivenessNeed: ForgivenessNeed,
  armPain: boolean
) {
  let score = 0;

  // 1. Level fit
  if (racket.bestFor.includes(level)) {
    score += 18;
  } else {
    score += 5;
  }

  if (level === "beginner") {
    score += racket.forgiveness * 2.5;
    score += racket.comfort * 2;
    score += racket.maneuverability * 1.5;

    if (racket.weightClass === "heavy") score -= 10;
    if (racket.headSize < 100) score -= 5;
    if (racket.forgiveness < 7) score -= 8;
  }

  if (level === "club") {
    score += racket.power * 1.2;
    score += racket.control * 1.2;
    score += racket.spin * 1.2;
    score += racket.forgiveness * 1.4;
  }

  if (level === "advanced") {
    score += racket.control * 2;
    score += racket.stability * 1.8;
    score += racket.spin * 1.2;

    if (racket.weightClass === "light") score -= 5;
    if (racket.control < 7) score -= 5;
  }

  // 2. Playing style
  if (playStyle === "power") {
    score += racket.power * 3;
    score += racket.stability * 1.2;
    score += racket.forgiveness;
  }

  if (playStyle === "spin") {
    score += racket.spin * 3;
    score += racket.maneuverability * 1.5;
    score += racket.power;
  }

  if (playStyle === "control") {
    score += racket.control * 3;
    score += racket.comfort;
    score += racket.stability;
  }

  if (playStyle === "attacking") {
    score += racket.control * 2;
    score += racket.power * 1.8;
    score += racket.stability * 1.5;
  }

  if (playStyle === "allround") {
    score +=
      racket.power +
      racket.control +
      racket.spin +
      racket.comfort +
      racket.maneuverability +
      racket.forgiveness +
      racket.stability;
  }

  // 3. Main priorities
  score += getPriorityScore(racket, primary) * 3;

  if (secondary !== primary) {
    score += getPriorityScore(racket, secondary) * 1.8;
  }

  // 4. Swing feel
  if (swingFeel === "easy-to-swing") {
    score += racket.maneuverability * 2.5;
    if (racket.weightClass === "heavy") score -= 6;
  }

  if (swingFeel === "stable") {
    score += racket.stability * 2.5;
    if (racket.weightClass === "heavy") score += 4;
  }

  if (swingFeel === "free-power") {
    score += racket.power * 2.5;
    score += racket.forgiveness;
  }

  if (swingFeel === "balanced") {
    score +=
      racket.power * 0.8 +
      racket.control * 0.8 +
      racket.comfort * 0.8 +
      racket.forgiveness * 0.8;
  }

  // 5. Weight preference
  if (
    weightPreference !== "no-preference" &&
    racket.weightClass === weightPreference
  ) {
    score += 10;
  }

  if (
    weightPreference !== "no-preference" &&
    racket.weightClass !== weightPreference
  ) {
    score -= 3;
  }

  // 6. Forgiveness need
  if (forgivenessNeed === "high") {
    score += racket.forgiveness * 2.5;
    if (racket.headSize >= 100) score += 4;
    if (racket.forgiveness < 7) score -= 8;
  }

  if (forgivenessNeed === "medium") {
    score += racket.forgiveness * 1.2;
  }

  if (forgivenessNeed === "low") {
    score += racket.control;
    if (racket.headSize < 100) score += 2;
  }

  // 7. Arm comfort
  if (armPain) {
    score += racket.comfort * 3;

    if (racket.stiffness === "soft") score += 8;
    if (racket.stiffness === "medium") score += 3;
    if (racket.stiffness === "stiff") score -= 10;
  }

  return score;
}

function confidenceFromScore(score: number, topScore: number, index: number) {
  const relative = score / topScore;
  const base = relative * 92;

  const positionPenalty = index * 4;

  return Math.round(clamp(base - positionPenalty, 55, 96));
}

function getReason(
  racket: Racket,
  level: Level,
  playStyle: PlayStyle,
  primary: Priority,
  armPain: boolean
) {
  const mainStrengths = [
    { label: "power", value: racket.power },
    { label: "control", value: racket.control },
    { label: "spin", value: racket.spin },
    { label: "comfort", value: racket.comfort },
    { label: "forgiveness", value: racket.forgiveness },
    { label: "stability", value: racket.stability },
    { label: "maneuverability", value: racket.maneuverability },
  ]
    .sort((a, b) => b.value - a.value)
    .slice(0, 2)
    .map((item) => item.label);

  if (armPain && racket.stiffness === "soft") {
    return `This is a strong match because it is arm-friendly, comfortable and still offers good ${mainStrengths.join(
      " and "
    )}.`;
  }

  if (playStyle === "spin") {
    return `This racket fits spin-focused players because it scores strongly in spin and racket speed.`;
  }

  if (playStyle === "power") {
    return `This racket fits players who want easier depth, pace and a more explosive response.`;
  }

  if (playStyle === "control") {
    return `This racket fits players who want better precision, feel and shot placement.`;
  }

  if (playStyle === "attacking") {
    return `This racket fits attacking players because it combines control, stability and enough power.`;
  }

  if (primary === "forgiveness") {
    return `This is a strong match because it gives you a more forgiving response and a usable sweet spot.`;
  }

  if (racket.bestFor.includes(level)) {
    return `This racket is a good fit for your level and offers strong ${mainStrengths.join(
      " and "
    )}.`;
  }

  return racket.shortDescription;
}

export default function RacketFinderPage() {
  const [level, setLevel] = useState<Level>("club");
  const [playStyle, setPlayStyle] = useState<PlayStyle>("allround");
  const [primary, setPrimary] = useState<Priority>("forgiveness");
  const [secondary, setSecondary] = useState<Priority>("maneuverability");
  const [swingFeel, setSwingFeel] = useState<SwingFeel>("balanced");
  const [weightPreference, setWeightPreference] =
    useState<WeightPreference>("no-preference");
  const [forgivenessNeed, setForgivenessNeed] =
    useState<ForgivenessNeed>("medium");
  const [armPain, setArmPain] = useState(false);

  const scoredRackets = [...rackets]
    .map((racket) => ({
      ...racket,
      matchScore: scoreRacket(
        racket,
        level,
        playStyle,
        primary,
        secondary,
        swingFeel,
        weightPreference,
        forgivenessNeed,
        armPain
      ),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);

  const topScore = scoredRackets[0]?.matchScore || 1;

  const recommendations = scoredRackets.slice(0, 3).map((racket, index) => ({
    ...racket,
    confidence: confidenceFromScore(racket.matchScore, topScore, index),
  }));

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-6xl px-6 py-12">
        <Link href="/" className="text-sm font-semibold text-emerald-400">
          ← Back to tools
        </Link>

        <div className="mt-10 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
            Tennis Level Hub
          </p>

          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Tennis Racket Finder
          </h1>

          <p className="mt-5 text-lg text-slate-300">
            Answer a few questions and get racket recommendations based on your
            level, playing style, swing preference and comfort needs.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
            <h2 className="text-2xl font-bold">Your player profile</h2>

            <div className="mt-6 space-y-5">
              <SelectField
                label="What is your playing level?"
                value={level}
                onChange={(value) => setLevel(value as Level)}
                options={levelLabels}
              />

              <SelectField
                label="How would you describe your playing style?"
                value={playStyle}
                onChange={(value) => setPlayStyle(value as PlayStyle)}
                options={playStyleLabels}
              />

              <SelectField
                label="What do you want most from your racket?"
                value={primary}
                onChange={(value) => setPrimary(value as Priority)}
                options={priorityLabels}
              />

              <SelectField
                label="What is your second priority?"
                value={secondary}
                onChange={(value) => setSecondary(value as Priority)}
                options={priorityLabels}
              />

              <SelectField
                label="What kind of swing feel do you prefer?"
                value={swingFeel}
                onChange={(value) => setSwingFeel(value as SwingFeel)}
                options={swingFeelLabels}
              />

              <SelectField
                label="Do you have a weight preference?"
                value={weightPreference}
                onChange={(value) =>
                  setWeightPreference(value as WeightPreference)
                }
                options={weightLabels}
              />

              <SelectField
                label="How important is forgiveness?"
                value={forgivenessNeed}
                onChange={(value) =>
                  setForgivenessNeed(value as ForgivenessNeed)
                }
                options={forgivenessLabels}
              />

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-slate-900 p-4">
                <input
                  type="checkbox"
                  checked={armPain}
                  onChange={(event) => setArmPain(event.target.checked)}
                  className="h-5 w-5"
                />
                <span>I want an arm-friendly racket / I have arm discomfort</span>
              </label>
            </div>

            <p className="mt-6 text-xs text-slate-500">
              Disclaimer: This tool gives estimated recommendations only. Demoing
              rackets before buying is still the best option.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
            <h2 className="text-2xl font-bold">Best matches</h2>

            <div className="mt-6 space-y-5">
              {recommendations.map((racket, index) => (
                <div
                  key={racket.name}
                  className="rounded-2xl border border-white/10 bg-slate-900 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">
                        #{index + 1} Recommendation
                      </p>
                      <h3 className="mt-2 text-2xl font-bold">
                        {racket.brand} {racket.name}
                      </h3>
                    </div>

                    <div className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-300">
                      {racket.confidence}% match
                    </div>
                  </div>

                  <p className="mt-3 text-slate-300">
                    {getReason(racket, level, playStyle, primary, armPain)}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {racket.styleTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
                    <Stat label="Power" value={racket.power} />
                    <Stat label="Control" value={racket.control} />
                    <Stat label="Spin" value={racket.spin} />
                    <Stat label="Comfort" value={racket.comfort} />
                    <Stat label="Forgiveness" value={racket.forgiveness} />
                    <Stat label="Stability" value={racket.stability} />
                  </div>

                  <div className="mt-5 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
                    <Info label="Weight" value={`${racket.weightGrams}g`} />
                    <Info label="Head size" value={`${racket.headSize} sq in`} />
                    <Info label="Stiffness" value={racket.stiffness} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Record<string, string>;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400"
      >
        {Object.entries(options).map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-white/5 p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400">{label}</p>
        <p className="font-semibold">{value}/10</p>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-emerald-400"
          style={{ width: `${value * 10}%` }}
        />
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/5 p-3">
      <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 font-semibold text-white capitalize">{value}</p>
    </div>
  );
}