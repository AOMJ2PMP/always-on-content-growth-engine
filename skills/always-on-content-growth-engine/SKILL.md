---
name: always-on-content-growth-engine
description: Run the complete evidence-to-content workflow for high-performing social posts. Use when the user asks to find proven content ideas, turn an external post into Tencent Cloud content, create a multi-platform candidate package, generate a LinkedIn carousel, or write reviewed opportunities into Notion.
---

# Always-on Content Growth Engine

Route one or more source posts through an evidence-backed, human-reviewed content workflow.

## Required sequence

1. Use `social-content-intelligence` to collect source evidence and compare the post with a same-platform, same-account baseline.
2. Reject weak, personality-driven, breaking-news-only, or non-replicable signals before drafting.
3. Use `tencent-cloud-content-angle` to identify a customer-useful learning angle and a natural Tencent Cloud product or scenario bridge.
4. Use `multiplatform-content-package` to draft public English copy and short image text.
5. Use `tencent-cloud-illustration` when visual material or final images are requested.
6. Use `social-carousel-composer` when the requested asset is a carousel.
7. Use `content-review-handoff` to prepare or write the candidate into Notion and read it back.

## Shared contract

Read `../../references/content-candidate.schema.json` before creating the first package. Preserve evidence throughout the workflow; downstream skills may enrich fields but must not replace observed metrics with invented values.

## Completion gate

A candidate is complete only when it contains:

- Source URL, post ID, platform, account, published time, observed metrics, and access path.
- A documented peer baseline and relative-performance interpretation.
- Reusable hook, audience, structure, CTA, and visual pattern.
- Tencent Cloud angle, product fit, customer learning, and claim risks.
- Platform copy or an explicit reason it was not drafted.
- Visual plan when an asset was requested.
- Brand, front-office, product, CTA, risk, and VI review states.
- Notion page URL and readback evidence when a database write was requested.

## Operating boundaries

- Internal fields, notes, logs, and review rationale are Chinese.
- Public social copy is English unless the user explicitly requests another language.
- Never auto-publish. Stop at a draft, asset package, or review queue unless the user separately authorizes publishing.
- A large account's raw engagement is not sufficient evidence. Prefer relative lift against recent peer posts.
- Keep secrets, retries, raw payloads, and high-frequency orchestration outside Notion.
