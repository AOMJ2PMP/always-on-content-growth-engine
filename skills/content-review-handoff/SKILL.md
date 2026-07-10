---
name: content-review-handoff
description: Prepare evidence-backed content opportunities for human review, write approved candidates into the Notion Content Opportunity Pool, and verify persisted records. Use when the user asks to save, capture, hand off, or write opportunities into Notion.
---

# Content Review Handoff

Write candidate opportunities into the visible operator surface without hiding uncertainty or auto-publishing.

## Notion workflow

1. Search for `Content Opportunity Pool｜Always-on Signals` unless the user names another database.
2. Fetch the database and its `collection://` data source before writing.
3. Check for an existing row with the same `Source Post ID` or `Source URL`.
4. Map the candidate using `../../references/notion-opportunity-pool.md`.
5. Create the page with concise evidence, pattern analysis, Tencent Cloud angle, copy hypothesis, and review checklist.
6. Fetch the created page and verify the title, source URL, scores, status, review stage, and body content.

## Review gates

Every candidate must expose:

- 品牌确认
- 前台确认
- 产品确认
- CTA 确认
- 风险确认
- VI 确认

Unconfirmed gates remain unchecked. Set `Publish Approved` to false and never infer approval.

## Default database states

- Proven and useful candidate: `Status = Content opportunity`, `Recommendation = Create`.
- Still needs product confirmation: `Review Stage = Needs product review`.
- Needs editorial selection first: `Review Stage = Needs front-office review`.
- `Draft Ready` is true only when a platform draft is actually present.
- `Publish Approved` is always false unless the user explicitly approves publishing.

## Page body

Keep the page operational and scannable:

- `为什么值得跟进`
- `来源证据`
- `相对表现`
- `可复用模式`
- `腾讯云承接角度`
- `内容草案或资产计划`
- `不能照搬`
- `人工确认`

Do not paste raw API payloads into Notion. Keep access path, endpoint, metric timestamp, and baseline method as evidence instead.
