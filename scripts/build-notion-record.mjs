import { readFile } from "node:fs/promises";
import path from "node:path";

function formatMetric(value) {
  return Number.isInteger(value) ? String(value) : Number(value).toFixed(2);
}

function checked(value) {
  return value ? "__YES__" : "__NO__";
}

function priority(score) {
  if (score >= 85) return "P0";
  if (score >= 75) return "P1";
  if (score >= 60) return "P2";
  return "Backlog";
}

function pendingReviewStage(candidate) {
  if (candidate.scoring?.recommendation === "Skip") return "Blocked";
  const needsProduct = candidate.review?.product?.status !== "approved" || candidate.review?.cta?.status !== "approved";
  return needsProduct ? "Needs product review" : "Needs front-office review";
}

function workflowStatus(candidate) {
  return candidate.scoring?.recommendation === "Skip" ? "Skipped" : "Content opportunity";
}

function body(candidate) {
  const { source, intelligence, scoring, tencentCloudAngle, contentPackage, visualPlan } = candidate;
  const baseline = source.peerBaseline;
  const metrics = source.metrics;
  const reasons = intelligence.whyItWorked.map((item) => `- ${item}`).join("\n");
  const cannotCopy = intelligence.cannotCopy.map((item) => `- ${item}`).join("\n");
  const risks = tencentCloudAngle.claimRisks.map((item) => `- ${item}`).join("\n");
  const asset = intelligence.assetDependency;
  const assetEvidence = (asset?.evidenceUrls ?? []).map((item) => `- ${item}`).join("\n") || "- 无外部重资产依赖";

  return `## 为什么值得跟进\n\n${scoring.recommendation}。${scoring.decisionReasons.join(" ")}\n\n## 来源证据\n\n- 来源：${source.account} / ${source.platform}\n- 原帖：${source.url}\n- TikHub：${source.evidence.accessPath} / \`${source.evidence.endpoint}\` / ${source.evidence.capturedAt}\n- 指标：${metrics.likes} likes / ${metrics.repostsOrShares} reposts or shares / ${metrics.repliesOrComments} replies or comments / ${metrics.bookmarks} bookmarks / ${metrics.views} views\n\n## 相对表现\n\n- 同账号样本：${baseline.sampleSize} 条，${baseline.window}\n- Weighted engagement：${formatMetric(metrics.engagement)}，账号中位数 ${formatMetric(baseline.medianEngagement)}，lift ${formatMetric(baseline.engagementLift)}x\n- Deep-engagement proxy：${formatMetric(metrics.deepEngagement)}，账号中位数 ${formatMetric(baseline.medianDeepEngagement)}，lift ${formatMetric(baseline.deepEngagementLift)}x\n- Baseline confidence：${baseline.confidence}\n\n## 资产依赖检查\n\n- 帖子本体完整：${asset?.contentSelfContained === true ? "是" : "否"}\n- 所需资产：${asset?.requiredAsset ?? "unknown"}\n- 资产状态：${asset?.assetReady ?? "unknown"}\n- 我们的生产方案：${asset?.productionPlan ?? "未定义"}\n\n来源资产：\n${assetEvidence}\n\n## 可复用模式\n\n- Hook：${intelligence.hook}\n- 受众：${intelligence.audience.join("、")}\n- 痛点：${intelligence.pain}\n- 视觉：${intelligence.visualPattern}\n\n${reasons}\n\n## 腾讯云承接角度\n\n- 客户能学到什么：${tencentCloudAngle.customerLearning}\n- 产品/场景：${tencentCloudAngle.products.join("、")} / ${tencentCloudAngle.applicationSurface}\n- 承接原因：${tencentCloudAngle.bridgeReason}\n- CTA 假设：${tencentCloudAngle.ctaHypothesis}\n\n待确认：\n${risks}\n\n## 内容草案或资产计划\n\n- LinkedIn：${contentPackage.linkedin.split("\n")[0]}\n- X：${contentPackage.x.split("\n")[0]}\n- 资产：${visualPlan.assetPlan.join("、")}\n- Carousel：${contentPackage.carousel.length} 页，每页一个观点\n- 独立视觉母题：${visualPlan.visualSignature?.metaphor ?? "未定义"}\n\n## 不能照搬\n\n${cannotCopy}\n\n## 人工确认\n\n- [ ] 品牌确认\n- [ ] 前台确认\n- [ ] 产品确认\n- [ ] CTA 确认\n- [ ] 风险确认\n- [ ] VI 确认`;
}

export function buildNotionRecord(candidate) {
  const scoring = candidate.scoring;
  const hasDraft = candidate.scoring.recommendation !== "Skip" && [candidate.contentPackage.x, candidate.contentPackage.linkedin, candidate.contentPackage.instagram].some(Boolean);
  const platforms = [
    candidate.contentPackage.x ? "X" : null,
    candidate.contentPackage.linkedin ? "LinkedIn" : null,
    candidate.contentPackage.instagram ? "Instagram" : null,
  ].filter(Boolean);

  return {
    properties: {
      Opportunity: candidate.tencentCloudAngle.topic,
      "Source Platform": candidate.source.platform,
      "Source Account": candidate.source.account,
      "Source URL": candidate.source.url,
      "Cross-post URL": candidate.source.crossPostUrl,
      "Source Post ID": candidate.source.postId,
      "date:Source Published At:start": candidate.source.publishedAt,
      "date:Source Published At:is_datetime": 1,
      "date:Detected At:start": candidate.detectedAt,
      "date:Detected At:is_datetime": 1,
      Topic: candidate.tencentCloudAngle.customerLearning,
      "Content Pattern": candidate.intelligence.contentPattern,
      "Relative Engagement Score": scoring.relativeEngagementScore,
      "Save/Share/Comment Proxy": scoring.deepEngagementProxyScore,
      Freshness: scoring.freshness,
      "Format Lift": scoring.relativeEngagementScore,
      Replicability: scoring.replicability,
      "Tencent Cloud Fit": scoring.tencentCloudFit,
      "Signal Score": scoring.signalScore,
      Recommendation: scoring.recommendation,
      "Tencent Cloud Products": JSON.stringify(candidate.tencentCloudAngle.products),
      "Repurpose Platforms": JSON.stringify(platforms),
      "Asset Plan": JSON.stringify(candidate.visualPlan.assetPlan),
      "Draft Ready": checked(hasDraft),
      "Publish Approved": checked(candidate.review.publishApproved),
      Status: workflowStatus(candidate),
      Priority: scoring.recommendation === "Skip" ? "Backlog" : priority(scoring.signalScore),
      "Review Stage": pendingReviewStage(candidate),
    },
    content: body(candidate),
  };
}

async function main() {
  const inputPath = process.argv[2];
  if (!inputPath) throw new Error("Usage: node scripts/build-notion-record.mjs <scored-candidate.json>");
  const candidate = JSON.parse(await readFile(path.resolve(inputPath), "utf8"));
  process.stdout.write(`${JSON.stringify(buildNotionRecord(candidate), null, 2)}\n`);
}

if (process.argv[1] && import.meta.url === new URL(`file://${path.resolve(process.argv[1])}`).href) {
  await main();
}
