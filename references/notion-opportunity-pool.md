# Notion Mapping: Content Opportunity Pool

Target database: `Content Opportunity Pool｜Always-on Signals`

Fetch the database before every write and use its current `collection://` data source. Never hardcode a stale data source ID into a skill response.

## Candidate mapping

| Notion property | Candidate field |
| --- | --- |
| Opportunity | `tencentCloudAngle.topic` |
| Source Platform | `source.platform` |
| Source Account | `source.account` |
| Source URL | `source.url` |
| Cross-post URL | `source.crossPostUrl` |
| Source Post ID | `source.postId` |
| Source Published At | `source.publishedAt` |
| Detected At | `detectedAt` |
| Topic | `tencentCloudAngle.customerLearning` |
| Content Pattern | `intelligence.contentPattern` |
| Relative Engagement Score | `scoring.relativeEngagementScore` |
| Save/Share/Comment Proxy | `scoring.deepEngagementProxyScore` |
| Freshness | `scoring.freshness` |
| Format Lift | use `scoring.relativeEngagementScore` until a format-specific baseline exists |
| Replicability | `scoring.replicability` |
| Tencent Cloud Fit | `scoring.tencentCloudFit` |
| Signal Score | `scoring.signalScore` |
| Recommendation | `scoring.recommendation` |
| Tencent Cloud Products | `tencentCloudAngle.products` filtered to valid database options |
| Repurpose Platforms | platforms with non-empty drafts |
| Asset Plan | `visualPlan.assetPlan` filtered to valid database options |
| Draft Ready | true only if at least one public draft is present |
| Publish Approved | always false unless the user explicitly approves publishing |
| Status | `Content opportunity` for proven candidates |
| Priority | `P0` for >=85, `P1` for 75-84, `P2` for 60-74, otherwise `Backlog` |
| Review Stage | `Needs product review` when product or CTA claims remain unconfirmed; otherwise `Needs front-office review` |

## Body template

```markdown
## 为什么值得跟进

一句话判断。

## 来源证据

- 来源：账号、平台、URL
- 采集：TikHub access path、endpoint、采集时间
- 指标：观察到的互动指标

## 相对表现

- 同账号样本量与窗口
- engagement lift
- deep-engagement proxy lift
- baseline confidence

## 可复用模式

- Hook
- 受众与痛点
- 结构与视觉模板
- 为什么有效

## 腾讯云承接角度

- 客户能学到什么
- 产品或场景
- CTA 假设
- 待确认 claim

## 内容草案或资产计划

只放精简草案和输出清单。

## 不能照搬

列出品牌、产品、时效性和视觉限制。

## 人工确认

- [ ] 品牌确认
- [ ] 前台确认
- [ ] 产品确认
- [ ] CTA 确认
- [ ] 风险确认
- [ ] VI 确认
```
