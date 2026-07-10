import assert from "node:assert/strict";
import { scoreCandidate } from "./score-candidate.mjs";

const strong = scoreCandidate({
  intelligence: {
    assetDependency: { contentSelfContained: true, assetReady: "producible-in-workflow", requiredAsset: "simple-social-visual" },
  },
  source: {
    metrics: { engagement: 400, deepEngagement: 120 },
    peerBaseline: { medianEngagement: 100, medianDeepEngagement: 30, confidence: "high" },
  },
  scoring: { freshness: 85, replicability: 90, tencentCloudFit: 85, brandSafety: 90, blockers: [] },
});

assert.equal(strong.scoring.relativeEngagementScore, 100);
assert.equal(strong.scoring.deepEngagementProxyScore, 100);
assert.equal(strong.scoring.recommendation, "Create");

const weakBaseline = scoreCandidate({
  intelligence: {
    assetDependency: { contentSelfContained: true, assetReady: "producible-in-workflow", requiredAsset: "simple-social-visual" },
  },
  source: {
    metrics: { engagement: 400, deepEngagement: 120 },
    peerBaseline: { medianEngagement: 100, medianDeepEngagement: 30, confidence: "low" },
  },
  scoring: { freshness: 85, replicability: 90, tencentCloudFit: 85, brandSafety: 90, blockers: [] },
});

assert.equal(weakBaseline.scoring.recommendation, "Watch");

const blocked = scoreCandidate({
  intelligence: {
    assetDependency: { contentSelfContained: true, assetReady: "producible-in-workflow", requiredAsset: "simple-social-visual" },
  },
  source: {
    metrics: { engagement: 400, deepEngagement: 120 },
    peerBaseline: { medianEngagement: 100, medianDeepEngagement: 30, confidence: "high" },
  },
  scoring: {
    freshness: 85,
    replicability: 90,
    tencentCloudFit: 85,
    brandSafety: 90,
    blockers: ["Unverified security claim"],
  },
});

assert.equal(blocked.scoring.recommendation, "Watch");

const missingOwnedAsset = scoreCandidate({
  intelligence: {
    assetDependency: { contentSelfContained: false, assetReady: "missing", requiredAsset: "whitepaper-or-guide" },
  },
  source: {
    metrics: { engagement: 400, deepEngagement: 120 },
    peerBaseline: { medianEngagement: 100, medianDeepEngagement: 30, confidence: "high" },
  },
  scoring: { freshness: 85, replicability: 90, tencentCloudFit: 85, brandSafety: 90, blockers: [] },
});

assert.equal(missingOwnedAsset.scoring.recommendation, "Skip");
assert.match(missingOwnedAsset.scoring.blockers[0], /Missing a reusable owned asset/);
process.stdout.write("Scoring tests passed.\n");
