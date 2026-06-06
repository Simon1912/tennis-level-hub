"use client";

import Link from "next/link";
import { useState } from "react";
import {
  armPainRule,
  clampTensionToSetup,
  getSetupProfile,
  goalRules,
  headSizeRules,
  levelRules,
  problemRules,
  racketPowerRules,
  stringBreakerRule,
  stringSetupProfiles,
  styleRules,
  type CurrentProblem,
  type HeadSize,
  type MainGoal,
  type PlayerLevel,
  type PlayingStyle,
  type RacketPowerLevel,
  type StringSetup,
  type TensionRule,
} from "../data/stringTension";

type CalculationResult =
  | {
      isHybrid: false;
      recommended: number;
      min: number;
      max: number;
      adjustment: number;
      confidence: number;
      rules: TensionRule[];
      warnings: string[];
    }
  | {
      isHybrid: true;
      mainLabel: string;
      crossLabel: string;
      main: number;
      mainMin: number;
      mainMax: number;
      cross: number;
      crossMin: number;
      crossMax: number;
      adjustment: number;
      confidence: number;
      rules: TensionRule[];
      warnings: string[];
    };

const setupLabels: Record<StringSetup, string> = {
  polyester: "Polyester",
  "soft-polyester": "Soft polyester",
  multifilament: "Multifilament",
  "synthetic-gut": "Synthetic gut",
  "natural-gut": "Natural gut",
  "hybrid-poly-main": "Hybrid: Poly main / soft cross",
  "hybrid-multi-main": "Hybrid: Multi or gut main / poly cross",
};

const levelLabels: Record<PlayerLevel, string> = {
  beginner: "Beginner / improving player",
  club: "Club / interclub player",
  advanced: "Advanced competitive player",
};

const styleLabels: Record<PlayingStyle, string> = {
  flat: "Mostly flat hitter",
  allround: "All-round player",
  topspin: "Heavy topspin player",
  "serve-volley": "Serve and volley / touch player",
};

const goalLabels: Record<MainGoal, string> = {
  "more-power": "More power",
  "more-control": "More control",
  "more-spin": "More spin",
  "more-comfort": "More comfort",
  balanced: "Balanced setup",
};

const racketPowerLabels: Record<RacketPowerLevel, string> = {
  "low-power": "Low-powered control racket",
  "medium-power": "Medium-powered racket",
  "high-power": "Powerful racket",
};

const headSizeLabels: Record<HeadSize, string> = {
  small: "Small head: 95–98 sq in",
  standard: "Standard head: 99–100 sq in",
  oversize: "Oversize: 102+ sq in",
};

const problemLabels: Record<CurrentProblem, string> = {
  "balls-fly-long": "Balls fly long",
  "balls-land-short": "Balls land short",
  "not-enough-spin": "Not enough spin",
  "feels-too-harsh": "Setup feels too harsh",
  "strings-break-fast": "Strings break too fast",
  "no-clear-problem": "No clear problem",
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function round(value: number) {
  return Math.round(value);
}

function getRecommendedAverage(result: CalculationResult) {
  if (result.isHybrid) {
    return (result.main + result.cross) / 2;
  }

  return result.recommended;
}

function formatPercent(value: number) {
  if (value > 0) return `+${value}%`;
  if (value < 0) return `${value}%`;
  return "0%";
}

function getExpectedChanges(currentTension: number, result: CalculationResult) {
  const recommendedAverage = getRecommendedAverage(result);
  const difference = recommendedAverage - currentTension;

  return [
    {
      label: "Power",
      value: Math.round(clamp(-difference * 2.5, -25, 25)),
      explanation: "Lower tension usually gives easier depth and pace.",
    },
    {
      label: "Spin potential",
      value: Math.round(clamp(-difference * 1.7, -18, 18)),
      explanation: "Lower tension can help string movement and snapback.",
    },
    {
      label: "Comfort",
      value: Math.round(clamp(-difference * 2.2, -25, 25)),
      explanation: "Lower tension usually reduces impact shock.",
    },
    {
      label: "Control",
      value: Math.round(clamp(difference * 1.3, -18, 18)),
      explanation:
        "Higher tension usually gives a firmer, more controlled response.",
    },
  ];
}

function getConfidence(
  goal: MainGoal,
  problem: CurrentProblem,
  armPain: boolean,
  stringBreaker: boolean
) {
  let confidence = 78;

  if (goal !== "balanced") confidence += 5;
  if (problem !== "no-clear-problem") confidence += 6;
  if (armPain) confidence += 4;
  if (stringBreaker) confidence += 3;

  return clamp(confidence, 72, 94);
}

function buildWarnings(
  setup: StringSetup,
  level: PlayerLevel,
  armPain: boolean,
  stringBreaker: boolean
) {
  const warnings: string[] = [];

  if (armPain && setup === "polyester") {
    warnings.push(
      "Full polyester can feel harsh if you have arm discomfort. Consider soft polyester, multifilament, natural gut or a hybrid."
    );
  }

  if (level === "beginner" && setup === "polyester") {
    warnings.push(
      "Beginners usually get more comfort and easy power from multifilament or synthetic gut than firm polyester."
    );
  }

  if (
    stringBreaker &&
    (setup === "multifilament" ||
      setup === "natural-gut" ||
      setup === "synthetic-gut")
  ) {
    warnings.push(
      "If you break strings often, tension alone will not solve it. Consider a thicker gauge, polyester or a hybrid setup."
    );
  }

  if (setup === "natural-gut") {
    warnings.push(
      "Natural gut is premium and comfortable, but it is expensive and can be less practical in wet conditions."
    );
  }

  return warnings;
}

function calculateTension(
  setup: StringSetup,
  level: PlayerLevel,
  style: PlayingStyle,
  goal: MainGoal,
  racketPower: RacketPowerLevel,
  headSize: HeadSize,
  problem: CurrentProblem,
  armPain: boolean,
  stringBreaker: boolean
): CalculationResult {
  const profile = getSetupProfile(setup);

  if (!profile) {
    throw new Error("Invalid string setup.");
  }

  const rules: TensionRule[] = [
    levelRules[level],
    styleRules[style],
    goalRules[goal],
    racketPowerRules[racketPower],
    headSizeRules[headSize],
    problemRules[problem],
  ];

  if (armPain) rules.push(armPainRule);
  if (stringBreaker) rules.push(stringBreakerRule);

  const adjustment = rules.reduce((sum, rule) => sum + rule.adjustmentLbs, 0);
  const rawBase = profile.defaultLbs + adjustment;

  const confidence = getConfidence(goal, problem, armPain, stringBreaker);
  const warnings = buildWarnings(setup, level, armPain, stringBreaker);

  if (setup === "hybrid-poly-main") {
    const main = round(clamp(rawBase - 2, 40, 55));
    const cross = round(clamp(rawBase + 2, 48, 60));

    return {
      isHybrid: true,
      mainLabel: "Poly mains",
      crossLabel: "Multi/Gut crosses",
      main,
      mainMin: round(clamp(main - 2, 40, 55)),
      mainMax: round(clamp(main + 2, 40, 55)),
      cross,
      crossMin: round(clamp(cross - 2, 48, 60)),
      crossMax: round(clamp(cross + 2, 48, 60)),
      adjustment,
      confidence,
      rules,
      warnings,
    };
  }

  if (setup === "hybrid-multi-main") {
    const main = round(clamp(rawBase + 2, 48, 62));
    const cross = round(clamp(rawBase - 3, 40, 55));

    return {
      isHybrid: true,
      mainLabel: "Multi/Gut mains",
      crossLabel: "Poly crosses",
      main,
      mainMin: round(clamp(main - 2, 48, 62)),
      mainMax: round(clamp(main + 2, 48, 62)),
      cross,
      crossMin: round(clamp(cross - 2, 40, 55)),
      crossMax: round(clamp(cross + 2, 40, 55)),
      adjustment,
      confidence,
      rules,
      warnings,
    };
  }

  const recommended = round(clampTensionToSetup(rawBase, setup));

  return {
    isHybrid: false,
    recommended,
    min: round(clampTensionToSetup(recommended - 2, setup)),
    max: round(clampTensionToSetup(recommended + 2, setup)),
    adjustment,
    confidence,
    rules,
    warnings,
  };
}

export default function StringTensionPage() {
  const [setup, setSetup] = useState<StringSetup>("polyester");
  const [currentTension, setCurrentTension] = useState("");
  const [level, setLevel] = useState<PlayerLevel>("club");
  const [style, setStyle] = useState<PlayingStyle>("allround");
  const [goal, setGoal] = useState<MainGoal>("balanced");
  const [racketPower, setRacketPower] =
    useState<RacketPowerLevel>("medium-power");
  const [headSize, setHeadSize] = useState<HeadSize>("standard");
  const [problem, setProblem] =
    useState<CurrentProblem>("no-clear-problem");
  const [armPain, setArmPain] = useState(false);
  const [stringBreaker, setStringBreaker] = useState(false);

  const profile = getSetupProfile(setup) ?? stringSetupProfiles[0];

  const result = calculateTension(
    setup,
    level,
    style,
    goal,
    racketPower,
    headSize,
    problem,
    armPain,
    stringBreaker
  );

  const currentTensionNumber = Number(currentTension);

  const hasCurrentTension =
    currentTension.trim() !== "" && !Number.isNaN(currentTensionNumber);

  const expectedChanges = hasCurrentTension
    ? getExpectedChanges(currentTensionNumber, result)
    : [];

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
            String Tension Calculator
          </h1>

          <p className="mt-5 text-lg text-slate-300">
            Estimate a suitable string tension based on your string setup,
            racket, level, playing style and comfort needs.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
            <h2 className="text-2xl font-bold">Your setup</h2>

            <div className="mt-6 space-y-5">
              <SelectField
                label="What string setup are you using?"
                value={setup}
                onChange={(value) => setSetup(value as StringSetup)}
                options={setupLabels}
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  What tension are you currently using? Optional
                </label>

                <input
                  value={currentTension}
                  onChange={(event) => setCurrentTension(event.target.value)}
                  type="number"
                  step="0.5"
                  placeholder="Example: 54"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400"
                />

                <p className="mt-2 text-xs text-slate-500">
                  If you use a hybrid setup, enter your average or main tension.
                </p>
              </div>

              <SelectField
                label="What is your playing level?"
                value={level}
                onChange={(value) => setLevel(value as PlayerLevel)}
                options={levelLabels}
              />

              <SelectField
                label="How do you usually play?"
                value={style}
                onChange={(value) => setStyle(value as PlayingStyle)}
                options={styleLabels}
              />

              <SelectField
                label="What is your main goal?"
                value={goal}
                onChange={(value) => setGoal(value as MainGoal)}
                options={goalLabels}
              />

              <SelectField
                label="How powerful is your racket?"
                value={racketPower}
                onChange={(value) =>
                  setRacketPower(value as RacketPowerLevel)
                }
                options={racketPowerLabels}
              />

              <SelectField
                label="What is your racket head size?"
                value={headSize}
                onChange={(value) => setHeadSize(value as HeadSize)}
                options={headSizeLabels}
              />

              <SelectField
                label="What problem are you trying to fix?"
                value={problem}
                onChange={(value) => setProblem(value as CurrentProblem)}
                options={problemLabels}
              />

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-slate-900 p-4">
                <input
                  type="checkbox"
                  checked={armPain}
                  onChange={(event) => setArmPain(event.target.checked)}
                  className="h-5 w-5"
                />
                <span>I have arm discomfort / I want more comfort</span>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-slate-900 p-4">
                <input
                  type="checkbox"
                  checked={stringBreaker}
                  onChange={(event) => setStringBreaker(event.target.checked)}
                  className="h-5 w-5"
                />
                <span>I break strings often</span>
              </label>
            </div>

            <p className="mt-6 text-xs text-slate-500">
              Disclaimer: This calculator gives estimated tension guidance only.
              String tension depends on racket, string gauge, technique and
              personal preference.
            </p>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">
                    Recommended tension
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">{profile.label}</h2>
                </div>

                <div className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-300">
                  {result.confidence}% confidence
                </div>
              </div>

              <p className="mt-4 text-slate-300">{profile.description}</p>

              {profile.warning && (
                <div className="mt-4 rounded-xl bg-yellow-400/10 p-4 text-sm text-yellow-100">
                  {profile.warning}
                </div>
              )}

              {result.isHybrid ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <TensionCard
                    label={result.mainLabel}
                    value={`${result.main} lbs`}
                    range={`${result.mainMin}–${result.mainMax} lbs`}
                  />

                  <TensionCard
                    label={result.crossLabel}
                    value={`${result.cross} lbs`}
                    range={`${result.crossMin}–${result.crossMax} lbs`}
                  />
                </div>
              ) : (
                <div className="mt-6">
                  <TensionCard
                    label="Recommended tension"
                    value={`${result.recommended} lbs`}
                    range={`${result.min}–${result.max} lbs`}
                  />
                </div>
              )}

              {result.isHybrid && (
                <p className="mt-4 text-sm text-slate-400">
                  Hybrid setups use different tensions because polyester is
                  firmer and is usually strung lower than multifilament or
                  natural gut.
                </p>
              )}

              {hasCurrentTension && (
                <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900 p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">
                    Compared to your current setup
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <Info
                      label="Current tension"
                      value={`${currentTensionNumber} lbs`}
                    />

                    <Info
                      label="Recommended average"
                      value={`${Math.round(getRecommendedAverage(result))} lbs`}
                    />
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {expectedChanges.map((change) => (
                      <div
                        key={change.label}
                        className="rounded-xl bg-white/5 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold">{change.label}</p>

                          <p
                            className={`font-bold ${
                              change.value > 0
                                ? "text-emerald-300"
                                : change.value < 0
                                ? "text-red-300"
                                : "text-slate-300"
                            }`}
                          >
                            {formatPercent(change.value)}
                          </p>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          {change.explanation}
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className="mt-4 text-xs text-slate-500">
                    These percentages are rough estimates, not exact
                    measurements. Real changes depend on racket, string, gauge
                    and technique.
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
              <h2 className="text-2xl font-bold">Why this recommendation?</h2>

              <div className="mt-5 space-y-3">
                {result.rules.map((rule) => (
                  <div
                    key={rule.id}
                    className="rounded-2xl border border-white/10 bg-slate-900 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-semibold">{rule.label}</p>
                      <p
                        className={`font-semibold ${
                          rule.adjustmentLbs > 0
                            ? "text-red-300"
                            : rule.adjustmentLbs < 0
                            ? "text-emerald-300"
                            : "text-slate-400"
                        }`}
                      >
                        {rule.adjustmentLbs > 0 ? "+" : ""}
                        {rule.adjustmentLbs} lbs
                      </p>
                    </div>

                    <p className="mt-2 text-sm text-slate-400">
                      {rule.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {result.warnings.length > 0 && (
              <div className="rounded-3xl border border-red-400/20 bg-red-400/10 p-6">
                <h2 className="text-xl font-bold text-red-200">
                  Important notes
                </h2>

                <ul className="mt-4 space-y-2 text-sm text-red-100">
                  {result.warnings.map((warning) => (
                    <li key={warning}>• {warning}</li>
                  ))}
                </ul>
              </div>
            )}
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

function TensionCard({
  label,
  value,
  range,
}: {
  label: string;
  value: string;
  range: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-900 p-5">
      <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-4xl font-bold text-emerald-300">{value}</p>

      <p className="mt-2 text-sm text-slate-400">
        Suggested range: {range}
      </p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/5 p-3">
      <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 font-semibold text-white">{value}</p>
    </div>
  );
}