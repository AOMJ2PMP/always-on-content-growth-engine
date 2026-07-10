import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function round(value, digits = 2) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function liftScore(target, baseline) {
  if (!Number.isFinite(target) || target < 0 || !Number.isFinite(baseline) || baseline <= 0) {
    return { lift: null, score: 0 };
  }

  const lift = target / baseline;
  return {
    lift: round(lift),
    score: round(clamp(50 + 25 * Math.log2(Math.max(lift, 0.01)))),
  };
}

export function scoreCandidate(candidate) {
  const metrics = candidate.source?.metrics ?? {};
  const baseline = candidate.source?.peerBaseline ?? {};
  const engagement = liftScore(metrics.engagement, baseline.medianEngagement);
  const deep = liftScore(metrics.deepEngagement, baseline.medianDeepEngagement);
  const scoring = candidate.scoring ?? {};
  const assetDependency = candidate.intelligence?.assetDependency ?? {};
  const assetReady = ["available", "producible-in-workflow"].includes(assetDependency.assetReady);
  const assetBlocker = assetDependency.contentSelfContained !== true || !assetReady;

  const components = {
    relativeEngagementScore: engagement.score,
    deepEngagementProxyScore: deep.score,
    freshness: Number(scoring.freshness ?? 0),
    replicability: Number(scoring.replicability ?? 0),
    tencentCloudFit: Number(scoring.tencentCloudFit ?? candidate.tencentCloudAngle?.fitScore ?? 0),
    brandSafety: Number(scoring.brandSafety ?? 0),
  };

  const signalScore = round(
    components.relativeEngagementScore * 0.35 +
      components.deepEngagementProxyScore * 0.15 +
      components.freshness * 0.1 +
      components.replicability * 0.15 +
      components.tencentCloudFit * 0.15 +
      components.brandSafety * 0.1,
  );

  const blockers = Array.isArray(scoring.blockers) ? [...scoring.blockers] : [];
  if (assetBlocker && !blockers.includes("Missing a reusable owned asset or self-contained social payload.")) {
    blockers.push("Missing a reusable owned asset or self-contained social payload.");
  }
  const confidence = baseline.confidence ?? "low";
  const passesCreateGate =
    signalScore >= 75 &&
    components.relativeEngagementScore >= 70 &&
    components.replicability >= 75 &&
    components.tencentCloudFit >= 70 &&
    confidence !== "low" &&
    blockers.length === 0;

  const recommendation = assetBlocker ? "Skip" : passesCreateGate ? "Create" : signalScore >= 60 ? "Watch" : "Skip";
  const decisionReasons = [
    engagement.lift === null
      ? "Missing a usable engagement baseline."
      : `Weighted engagement is ${engagement.lift}x the same-account median.`,
    deep.lift === null
      ? "Missing a usable deep-engagement baseline."
      : `Deep-engagement proxy is ${deep.lift}x the same-account median.`,
    `Baseline confidence is ${confidence}.`,
    assetBlocker
      ? `Asset gate failed: contentSelfContained=${assetDependency.contentSelfContained ?? "unknown"}, assetReady=${assetDependency.assetReady ?? "unknown"}.`
      : `Asset gate passed: ${assetDependency.requiredAsset ?? "none"} is ${assetDependency.assetReady}.`,
  ];

  return {
    ...candidate,
    source: {
      ...candidate.source,
      peerBaseline: {
        ...baseline,
        engagementLift: engagement.lift,
        deepEngagementLift: deep.lift,
      },
    },
    scoring: {
      ...scoring,
      ...components,
      signalScore,
      recommendation,
      decisionReasons,
      blockers,
    },
  };
}

async function main() {
  const inputPath = process.argv[2];
  const outputFlagIndex = process.argv.indexOf("--output");
  const outputPath = outputFlagIndex >= 0 ? process.argv[outputFlagIndex + 1] : null;

  if (!inputPath) {
    throw new Error("Usage: node scripts/score-candidate.mjs <candidate.json> [--output scored.json]");
  }

  const candidate = JSON.parse(await readFile(path.resolve(inputPath), "utf8"));
  const result = scoreCandidate(candidate);
  const json = `${JSON.stringify(result, null, 2)}\n`;

  if (outputPath) {
    await writeFile(path.resolve(outputPath), json, "utf8");
  } else {
    process.stdout.write(json);
  }
}

if (process.argv[1] && import.meta.url === new URL(`file://${path.resolve(process.argv[1])}`).href) {
  await main();
}
