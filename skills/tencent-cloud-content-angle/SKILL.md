---
name: tencent-cloud-content-angle
description: Translate a proven external content pattern into a customer-useful Tencent Cloud topic, product bridge, CTA hypothesis, and claim-review plan. Use after social evidence is captured and before drafting public copy.
---

# Tencent Cloud Content Angle

Turn a proven pattern into a useful Tencent Cloud content opportunity without copying the source brand or forcing a product advertisement.

## Decision order

1. State the customer problem or skill the source helps with.
2. Preserve the reusable teaching mechanism: checklist, how-to, template, demonstration, customer proof, or point of view.
3. Identify the Tencent Cloud product or scenario where the method can be applied naturally.
4. Explain what a reader can learn even if they never buy the product.
5. Define the lowest-risk CTA: documentation, tutorial, product page, event, or no CTA.
6. Mark every product capability, performance statement, security statement, benchmark, and URL that needs confirmation.

## Output fields

Populate `tencentCloudAngle` with:

- `customerLearning`
- `topic`
- `products`
- `applicationSurface`
- `bridgeReason`
- `ctaHypothesis`
- `claimRisks`
- `fitScore`
- `status`: `ready`, `needs_confirmation`, or `not_recommended`

## Guardrails

- Do not claim Tencent Cloud is better than the source brand without approved evidence.
- Do not assume a product is a current overseas priority.
- Keep product naming and documentation URLs subject to product and CTA review.
- Prefer practical customer education over launch language when the source pattern is educational.
- Reject angles that rely on copying the competitor's proprietary feature, phrasing, mascot, color system, or exact visual composition.
