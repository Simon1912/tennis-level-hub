export type StringSetup =
  | "polyester"
  | "soft-polyester"
  | "multifilament"
  | "synthetic-gut"
  | "natural-gut"
  | "hybrid-poly-main"
  | "hybrid-multi-main";

export type PlayerLevel = "beginner" | "club" | "advanced";

export type PlayingStyle = "flat" | "allround" | "topspin" | "serve-volley";

export type MainGoal =
  | "more-power"
  | "more-control"
  | "more-spin"
  | "more-comfort"
  | "balanced";

export type RacketPowerLevel = "low-power" | "medium-power" | "high-power";

export type HeadSize = "small" | "standard" | "oversize";

export type CurrentProblem =
  | "balls-fly-long"
  | "balls-land-short"
  | "not-enough-spin"
  | "feels-too-harsh"
  | "strings-break-fast"
  | "no-clear-problem";

export type TensionRule = {
  id: string;
  label: string;
  adjustmentLbs: number;
  explanation: string;
};

export type TensionSetupProfile = {
  setup: StringSetup;
  label: string;
  baseMinLbs: number;
  baseMaxLbs: number;
  defaultLbs: number;
  description: string;
  warning?: string;
};

export const stringSetupProfiles: TensionSetupProfile[] = [
  {
    setup: "polyester",
    label: "Polyester",
    baseMinLbs: 42,
    baseMaxLbs: 52,
    defaultLbs: 48,
    description:
      "Best for control, spin and durability. Usually strung lower than multifilament or synthetic gut because it is firmer.",
    warning:
      "Avoid very high tension if you have arm pain or are a beginner.",
  },
  {
    setup: "soft-polyester",
    label: "Soft Polyester",
    baseMinLbs: 44,
    baseMaxLbs: 53,
    defaultLbs: 49,
    description:
      "A more comfortable polyester setup for players who still want spin and control.",
  },
  {
    setup: "multifilament",
    label: "Multifilament",
    baseMinLbs: 50,
    baseMaxLbs: 58,
    defaultLbs: 54,
    description:
      "Best for comfort, power and arm safety. Usually strung higher than polyester.",
  },
  {
    setup: "synthetic-gut",
    label: "Synthetic Gut",
    baseMinLbs: 50,
    baseMaxLbs: 58,
    defaultLbs: 54,
    description:
      "Affordable all-round string with decent comfort and power.",
  },
  {
    setup: "natural-gut",
    label: "Natural Gut",
    baseMinLbs: 52,
    baseMaxLbs: 60,
    defaultLbs: 56,
    description:
      "Premium string with excellent comfort, power, feel and tension maintenance.",
  },
  {
    setup: "hybrid-poly-main",
    label: "Hybrid: Polyester Main / Soft Cross",
    baseMinLbs: 45,
    baseMaxLbs: 55,
    defaultLbs: 50,
    description:
      "Good for players who want poly control and spin but slightly better comfort.",
  },
  {
    setup: "hybrid-multi-main",
    label: "Hybrid: Multifilament or Gut Main / Poly Cross",
    baseMinLbs: 48,
    baseMaxLbs: 58,
    defaultLbs: 53,
    description:
      "Good for players who want comfort and power with some extra control from the poly cross.",
  },
];

export const levelRules: Record<PlayerLevel, TensionRule> = {
  beginner: {
    id: "level-beginner",
    label: "Beginner / improving player",
    adjustmentLbs: -2,
    explanation:
      "Lower tension gives easier depth, comfort and a more forgiving response.",
  },
  club: {
    id: "level-club",
    label: "Club / interclub player",
    adjustmentLbs: 0,
    explanation:
      "Club players usually fit well near the middle of the recommended range.",
  },
  advanced: {
    id: "level-advanced",
    label: "Advanced competitive player",
    adjustmentLbs: 1,
    explanation:
      "Advanced players often benefit from slightly more control and stability.",
  },
};

export const styleRules: Record<PlayingStyle, TensionRule> = {
  flat: {
    id: "style-flat",
    label: "Mostly flat hitter",
    adjustmentLbs: 1,
    explanation:
      "Flat hitters often need a little more control to keep the ball from flying long.",
  },
  allround: {
    id: "style-allround",
    label: "All-round player",
    adjustmentLbs: 0,
    explanation:
      "All-round players usually fit well near the middle of the recommended range.",
  },
  topspin: {
    id: "style-topspin",
    label: "Heavy topspin player",
    adjustmentLbs: -1,
    explanation:
      "A slightly lower tension can improve snapback and spin potential, especially with polyester.",
  },
  "serve-volley": {
    id: "style-serve-volley",
    label: "Serve and volley / touch player",
    adjustmentLbs: 1,
    explanation:
      "A little more tension can improve touch, volleys and directional control.",
  },
};

export const goalRules: Record<MainGoal, TensionRule> = {
  "more-power": {
    id: "goal-power",
    label: "More power",
    adjustmentLbs: -3,
    explanation:
      "Lower tension usually gives easier depth, more trampoline effect and better comfort.",
  },
  "more-control": {
    id: "goal-control",
    label: "More control",
    adjustmentLbs: 3,
    explanation:
      "Higher tension usually gives a firmer, more controlled and predictable response.",
  },
  "more-spin": {
    id: "goal-spin",
    label: "More spin",
    adjustmentLbs: -1,
    explanation:
      "Slightly lower tension can help strings move and snap back, especially with polyester.",
  },
  "more-comfort": {
    id: "goal-comfort",
    label: "More comfort",
    adjustmentLbs: -4,
    explanation:
      "Lower tension reduces impact shock and usually feels easier on the arm.",
  },
  balanced: {
    id: "goal-balanced",
    label: "Balanced setup",
    adjustmentLbs: 0,
    explanation:
      "A balanced setup stays close to the middle of the recommended range.",
  },
};

export const racketPowerRules: Record<RacketPowerLevel, TensionRule> = {
  "low-power": {
    id: "racket-low-power",
    label: "Low-powered control racket",
    adjustmentLbs: -2,
    explanation:
      "Lower tension helps add depth and power to control-oriented rackets.",
  },
  "medium-power": {
    id: "racket-medium-power",
    label: "Medium-powered racket",
    adjustmentLbs: 0,
    explanation:
      "A medium-powered racket usually works well near the normal tension range.",
  },
  "high-power": {
    id: "racket-high-power",
    label: "Powerful racket",
    adjustmentLbs: 2,
    explanation:
      "A powerful racket may need slightly higher tension to control depth.",
  },
};

export const headSizeRules: Record<HeadSize, TensionRule> = {
  small: {
    id: "head-small",
    label: "Small head size: 95–98 sq in",
    adjustmentLbs: -1,
    explanation:
      "Smaller head sizes are usually lower-powered, so slightly lower tension can help.",
  },
  standard: {
    id: "head-standard",
    label: "Standard head size: 99–100 sq in",
    adjustmentLbs: 0,
    explanation:
      "Standard head sizes usually work well with normal tension ranges.",
  },
  oversize: {
    id: "head-oversize",
    label: "Oversize: 102+ sq in",
    adjustmentLbs: 2,
    explanation:
      "Larger heads are usually more powerful, so slightly higher tension can improve control.",
  },
};

export const problemRules: Record<CurrentProblem, TensionRule> = {
  "balls-fly-long": {
    id: "problem-long",
    label: "Balls fly long",
    adjustmentLbs: 3,
    explanation:
      "If balls fly long, slightly higher tension can improve control and reduce launch.",
  },
  "balls-land-short": {
    id: "problem-short",
    label: "Balls land short",
    adjustmentLbs: -3,
    explanation:
      "If balls land short, lower tension can help create easier depth.",
  },
  "not-enough-spin": {
    id: "problem-spin",
    label: "Not enough spin",
    adjustmentLbs: -1,
    explanation:
      "A small tension drop can help string movement and snapback for more spin.",
  },
  "feels-too-harsh": {
    id: "problem-harsh",
    label: "Setup feels too harsh",
    adjustmentLbs: -4,
    explanation:
      "If the setup feels harsh, lower tension can improve comfort.",
  },
  "strings-break-fast": {
    id: "problem-breakage",
    label: "Strings break too fast",
    adjustmentLbs: 1,
    explanation:
      "Slightly higher tension may reduce excessive string movement, but string type and gauge matter more.",
  },
  "no-clear-problem": {
    id: "problem-none",
    label: "No clear problem",
    adjustmentLbs: 0,
    explanation:
      "If there is no clear problem, staying near the default range is usually safest.",
  },
};

export const armPainRule: TensionRule = {
  id: "arm-pain",
  label: "Arm discomfort",
  adjustmentLbs: -4,
  explanation:
    "Arm discomfort usually means you should lower tension and avoid very firm polyester setups.",
};

export const stringBreakerRule: TensionRule = {
  id: "string-breaker",
  label: "Frequent string breaker",
  adjustmentLbs: 1,
  explanation:
    "Frequent string breakers may benefit from slightly firmer control, but string type and gauge matter more than tension alone.",
};

export function getSetupProfile(setup: StringSetup) {
  return stringSetupProfiles.find((profile) => profile.setup === setup);
}

export function clampTensionToSetup(
  tension: number,
  setup: StringSetup
): number {
  const profile = getSetupProfile(setup);

  if (!profile) return tension;

  return Math.max(profile.baseMinLbs, Math.min(profile.baseMaxLbs, tension));
}