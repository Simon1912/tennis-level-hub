"use client";

import Link from "next/link";
import { useState } from "react";
import { strings, type StringProduct, type PriceTier } from "../data/strings";

type Level = "beginner" | "club" | "advanced";
type HitStyle = "flat" | "allround" | "topspin";
type StringBreaker = "rarely" | "sometimes" | "often";
type FeelPreference = "soft" | "balanced" | "crisp" | "firm";
type SetupPreference = "no-preference" | "full-bed" | "hybrid-open";
type BudgetPreference = "no-preference" | PriceTier;

type Priority =
  | "power"
  | "control"
  | "spin"
  | "comfort"
  | "durability"
  | "tensionMaintenance"
  | "feel"
  | "value";

const levelLabels: Record<Level, string> = {
  beginner: "Beginner / improving player",
  club: "Club / interclub player",
  advanced: "Advanced competitive player",
};

const hitStyleLabels: Record<HitStyle, string> = {
  flat: "Mostly flat shots",
  allround: "All-round game",
  topspin: "Heavy topspin",
};

const priorityLabels: Record<Priority, string> = {
  power: "More power",
  control: "More control",
  spin: "More spin",
  comfort: "More comfort",
  durability: "More durability",
  tensionMaintenance: "Better tension maintenance",
  feel: "Better feel",
  value: "Better value",
};

const breakerLabels: Record<StringBreaker, string> = {
  rarely: "Rarely",
  sometimes: "Sometimes",
  often: "Often",
};

const feelLabels: Record<FeelPreference, string> = {
  soft: "Soft and comfortable",
  balanced: "Balanced",
  crisp: "Crisp response",
  firm: "Firm and controlled",
};

const setupLabels: Record<SetupPreference, string> = {
  "no-preference": "No preference",
  "full-bed": "Full bed",
  "hybrid-open": "Open to hybrid",
};

const budgetLabels: Record<BudgetPreference, string> = {
  "no-preference": "No preference",
  budget: "Budget",
  mid: "Mid-range",
  premium: "Premium",
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function scoreString(
  string: StringProduct,
  level: Level,
  hitStyle: HitStyle,
  primary: Priority,
  secondary: Priority,
  stringBreaker: StringBreaker,
  feelPreference: FeelPreference,
  setupPreference: SetupPreference,
  budgetPreference: BudgetPreference,
  armPain: boolean
) {
  let score = 0;

  // 1. Level fit
  if (string.bestFor.includes(level)) {
    score += 18;
  } else {
    score += 5;
  }

  if (level === "beginner") {
    score += string.comfort * 2.5;
    score += string.armSafety * 2.5;
    score += string.value * 1.5;

    if (string.type === "polyester" && string.stiffness !== "soft") score -= 12;
    if (string.stiffness === "very-firm") score -= 10;
  }

  if (level === "club") {
    score += string.comfort * 1.2;
    score += string.control * 1.2;
    score += string.power * 1.2;
    score += string.value * 1.2;
  }

  if (level === "advanced") {
    score += string.control * 2;
    score += string.spin * 1.5;
    score += string.durability * 1.5;
    score += string.tensionMaintenance * 1.2;
  }

  // 2. Hitting style
  if (hitStyle === "flat") {
    score += string.control * 2.3;
    score += string.power * 1.5;
    score += string.feel * 1.5;

    if (string.shape === "round") score += 3;
  }

  if (hitStyle === "topspin") {
    score += string.spin * 3;
    score += string.snapback * 2;
    score += string.control;

    if (string.shape === "shaped" || string.shape === "textured") score += 5;
  }

  if (hitStyle === "allround") {
    score +=
      string.power +
      string.control +
      string.spin +
      string.comfort +
      string.feel +
      string.value;
  }

  // 3. Priorities
  score += string[primary] * 3;

  if (secondary !== primary) {
    score += string[secondary] * 1.8;
  }

  // 4. String breaking
  if (stringBreaker === "often") {
    score += string.durability * 3;
    score += string.tensionMaintenance * 1.5;

    if (string.goodForStringBreakers) score += 8;
    if (string.type === "polyester") score += 5;
    if (string.type === "multifilament" || string.type === "natural-gut") {
      score -= 8;
    }
  }

  if (stringBreaker === "sometimes") {
    score += string.durability * 1.6;
    score += string.value;
  }

  if (stringBreaker === "rarely") {
    score += string.comfort * 1.5;
    score += string.feel * 1.2;
  }

  // 5. Feel preference
  if (feelPreference === "soft") {
    score += string.comfort * 2.5;
    score += string.armSafety * 2;

    if (string.stiffness === "soft") score += 6;
    if (string.stiffness === "very-firm") score -= 8;
  }

  if (feelPreference === "crisp") {
    score += string.control * 2;
    score += string.feel * 1.5;

    if (string.stiffness === "medium" || string.stiffness === "firm") {
      score += 4;
    }
  }

  if (feelPreference === "firm") {
    score += string.control * 2.3;
    score += string.durability * 1.5;

    if (string.stiffness === "firm" || string.stiffness === "very-firm") {
      score += 5;
    }
  }

  if (feelPreference === "balanced") {
    score += string.power + string.control + string.comfort + string.feel;
  }

  // 6. Setup preference
  if (setupPreference === "full-bed") {
    if (string.goodAsFullBed) score += 8;
    if (string.type === "hybrid") score -= 8;
  }

  if (setupPreference === "hybrid-open") {
    if (string.goodAsHybridMain || string.goodAsHybridCross) score += 8;
    if (string.type === "hybrid") score += 8;
  }

  // 7. Budget
  if (
    budgetPreference !== "no-preference" &&
    string.priceTier === budgetPreference
  ) {
    score += 10;
  }

  if (budgetPreference === "budget") {
    score += string.value * 2;
    if (string.priceTier === "premium") score -= 8;
  }

  // 8. Arm comfort
  if (armPain) {
    score += string.comfort * 3;
    score += string.armSafety * 3;

    if (string.goodForArmPain) score += 10;
    if (string.stiffness === "soft") score += 6;
    if (string.stiffness === "firm") score -= 6;
    if (string.stiffness === "very-firm") score -= 12;
  }

  return score;
}

function confidenceFromScore(score: number, topScore: number, index: number) {
  const relative = score / topScore;
  const base = relative * 94;
  const positionPenalty = index * 4;

  return Math.round(clamp(base - positionPenalty, 55, 97));
}

function getReason(
  string: StringProduct,
  level: Level,
  hitStyle: HitStyle,
  primary: Priority,
  stringBreaker: StringBreaker,
  armPain: boolean
) {
  if (armPain && string.goodForArmPain) {
    return `This is a strong match because it offers high comfort, better arm safety and a softer response.`;
  }

  if (stringBreaker === "often" && string.goodForStringBreakers) {
    return `This is a strong match because it gives you better durability and control if you break strings often.`;
  }

  if (hitStyle === "topspin" && string.spin >= 8.5) {
    return `This string fits topspin players because it offers strong spin potential and good snapback.`;
  }

  if (primary === "comfort") {
    return `This string fits your profile because it prioritizes comfort, feel and easier playability.`;
  }

  if (primary === "control") {
    return `This string fits your profile because it gives a controlled and predictable response.`;
  }

  if (primary === "value") {
    return `This string is a strong value option for your level and playing needs.`;
  }

  if (string.bestFor.includes(level)) {
    return `This string is a good fit for your level and gives a useful balance of ${primary} and overall playability.`;
  }

  return string.shortDescription;
}

export default function StringFinderPage() {
  const [level, setLevel] = useState<Level>("club");
  const [hitStyle, setHitStyle] = useState<HitStyle>("allround");
  const [primary, setPrimary] = useState<Priority>("comfort");
  const [secondary, setSecondary] = useState<Priority>("control");
  const [stringBreaker, setStringBreaker] =
    useState<StringBreaker>("sometimes");
  const [feelPreference, setFeelPreference] =
    useState<FeelPreference>("balanced");
  const [setupPreference, setSetupPreference] =
    useState<SetupPreference>("no-preference");
  const [budgetPreference, setBudgetPreference] =
    useState<BudgetPreference>("no-preference");
  const [armPain, setArmPain] = useState(false);

  const scoredStrings = [...strings]
    .map((string) => ({
      ...string,
      matchScore: scoreString(
        string,
        level,
        hitStyle,
        primary,
        secondary,
        stringBreaker,
        feelPreference,
        setupPreference,
        budgetPreference,
        armPain
      ),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);

  const topScore = scoredStrings[0]?.matchScore || 1;

  const recommendations = scoredStrings.slice(0, 3).map((string, index) => ({
    ...string,
    confidence: confidenceFromScore(string.matchScore, topScore, index),
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
            Tennis String Finder
          </h1>

          <p className="mt-5 text-lg text-slate-300">
            Answer a few questions and get string recommendations based on your
            level, playing style, comfort needs and durability preferences.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
            <h2 className="text-2xl font-bold">Your string profile</h2>

            <div className="mt-6 space-y-5">
              <SelectField
                label="What is your playing level?"
                value={level}
                onChange={(value) => setLevel(value as Level)}
                options={levelLabels}
              />

              <SelectField
                label="How do you usually hit the ball?"
                value={hitStyle}
                onChange={(value) => setHitStyle(value as HitStyle)}
                options={hitStyleLabels}
              />

              <SelectField
                label="What do you want most from your strings?"
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
                label="How often do you break strings?"
                value={stringBreaker}
                onChange={(value) => setStringBreaker(value as StringBreaker)}
                options={breakerLabels}
              />

              <SelectField
                label="What string feel do you prefer?"
                value={feelPreference}
                onChange={(value) =>
                  setFeelPreference(value as FeelPreference)
                }
                options={feelLabels}
              />

              <SelectField
                label="What setup do you prefer?"
                value={setupPreference}
                onChange={(value) =>
                  setSetupPreference(value as SetupPreference)
                }
                options={setupLabels}
              />

              <SelectField
                label="What is your budget preference?"
                value={budgetPreference}
                onChange={(value) =>
                  setBudgetPreference(value as BudgetPreference)
                }
                options={budgetLabels}
              />

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-slate-900 p-4">
                <input
                  type="checkbox"
                  checked={armPain}
                  onChange={(event) => setArmPain(event.target.checked)}
                  className="h-5 w-5"
                />
                <span>I have arm discomfort / I want arm-friendly strings</span>
              </label>
            </div>

            <p className="mt-6 text-xs text-slate-500">
              Disclaimer: This tool gives estimated string suggestions only.
              Strings feel different depending on racket, tension, gauge and
              technique.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
            <h2 className="text-2xl font-bold">Best matches</h2>

            <div className="mt-6 space-y-5">
              {recommendations.map((string, index) => (
                <div
                  key={`${string.brand}-${string.name}`}
                  className="rounded-2xl border border-white/10 bg-slate-900 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">
                        #{index + 1} Recommendation
                      </p>

                      <h3 className="mt-2 text-2xl font-bold">
                        {string.brand} {string.name}
                      </h3>
                    </div>

                    <div className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-300">
                      {string.confidence}% match
                    </div>
                  </div>

                  <p className="mt-3 text-slate-300">
                    {getReason(
                      string,
                      level,
                      hitStyle,
                      primary,
                      stringBreaker,
                      armPain
                    )}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {string.styleTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
                    <Stat label="Power" value={string.power} />
                    <Stat label="Control" value={string.control} />
                    <Stat label="Spin" value={string.spin} />
                    <Stat label="Comfort" value={string.comfort} />
                    <Stat label="Durability" value={string.durability} />
                    <Stat label="Tension" value={string.tensionMaintenance} />
                  </div>

                  <div className="mt-5 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
                    <Info label="Type" value={string.type} />
                    <Info label="Feel" value={string.stiffness} />
                    <Info label="Price" value={string.priceTier} />
                    <Info label="Gauges" value={string.commonGauges.join(", ")} />
                    <Info
                      label="Recommended tension"
                      value={string.recommendedTensionLbs}
                    />
                    <Info
                      label="Setup"
                      value={string.goodAsFullBed ? "Full bed possible" : "Hybrid only"}
                    />
                  </div>

                  {string.avoidIf.length > 0 && (
                    <div className="mt-5 rounded-xl bg-red-400/10 p-4">
                      <p className="text-sm font-semibold text-red-300">
                        Avoid if:
                      </p>
                      <p className="mt-1 text-sm text-red-100">
                        {string.avoidIf.join(", ")}
                      </p>
                    </div>
                  )}
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