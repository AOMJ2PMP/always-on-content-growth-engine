---
name: social-content-intelligence
description: Find and verify high-performing social posts with TikHub, compare each candidate with a same-account baseline, extract reusable content patterns, and produce evidence-backed opportunity records. Use for content discovery, competitor post analysis, performance validation, or content-opportunity scoring.
---

# Social Content Intelligence

Use TikHub evidence to decide whether a social post is a reusable content signal.

## Setup gate

Before any TikHub call:

```bash
if [ -z "${TIKHUB_API_KEY:-}" ]; then
  echo "TIKHUB_API_KEY is not set"
fi
```

If unset, stop before making paid calls. Never print or store the key.

## Access order

1. Prefer the TikHub hosted MCP tool for the target platform.
2. Use one bounded call at a time for account timelines; avoid parallel fan-out across many accounts.
3. If the MCP tool is unavailable, hangs, or returns an infrastructure error, use TikHub endpoint discovery and the REST API.
4. Record `mcp`, `rest_fallback`, or `manual` in `source.evidence.accessPath`.

For X, use:

- `fetch_user_post_tweet` for one recent account page.
- `fetch_tweet_detail` only for shortlisted posts.
- `fetch_search_timeline` when the account is unknown.

For LinkedIn, discover and use:

- `/api/v1/linkedin/web_v2/get_company_posts` with `universal_name`, `start`, and `count`.
- `/api/v1/linkedin/web_v2/get_post_detail_by_slug` when a post slug is available.
- `/api/v1/linkedin/web/get_post_detail` when a numeric post ID is available.

## Cost limits

- Default discovery budget: one page for up to three explicitly relevant accounts.
- Shortlist before fetching details.
- Do not paginate without a concrete need and an explicit cap.
- Do not repeat a hung or failed paid call with the same arguments more than once.

## Baseline method

Use recent original posts from the same account and same platform. Exclude:

- The target post.
- Replies and pure reposts.
- Obvious pinned evergreen outliers when they are outside the comparison window.
- Posts with missing metric payloads.

Prefer 10-30 peer posts. If fewer than 8 valid peers are available, mark baseline confidence `low` and do not label the candidate proven solely from relative lift.

Calculate:

- `engagement = likes + 2 * reposts_or_shares + 1.5 * replies_or_comments`
- `deepEngagement = bookmarks + reposts_or_shares + replies_or_comments` when bookmarks exist.
- For LinkedIn without bookmark data, use `shares + comments` as the deep-engagement proxy.
- Compare the target with peer medians, not peer means.

Run `node ../../scripts/score-candidate.mjs <candidate.json>` after populating observed metrics and peer medians.

## Pattern extraction

Extract only what is supported by the source:

- Hook type and first-screen promise.
- Intended audience and business pain.
- Content structure and reading effort.
- Visual format and whether the visual carries evidence or only decoration.
- CTA type and destination.
- Why it earned saves, shares, replies, or watch time.
- What cannot be copied: brand language, proprietary claims, celebrity effects, news timing, or exact composition.

## Asset-dependency gate

Performance is not enough when the social post is only a wrapper for an asset the team does not own.

For every candidate, populate `intelligence.assetDependency`:

- `contentSelfContained`: whether the post text, images, or native video deliver the useful idea without clicking out.
- `requiredAsset`: `none`, `simple-social-visual`, `product-demo`, `whitepaper-or-guide`, `original-research`, or `customer-evidence`.
- `assetReady`: `available`, `producible-in-workflow`, `missing`, or `unknown`.
- `productionPlan`: the concrete asset the team would make.
- `evidenceUrls`: external assets that carry the source post's real value.

Hard rules:

- A post that depends on a whitepaper, report, checklist PDF, original research, or customer proof is not `Create` when the equivalent Tencent Cloud asset is missing.
- Do not invent the missing framework from a headline and call it repurposing.
- A native product demo can qualify when its teaching point is visible in the post and the replacement asset is a lightweight carousel, screenshot walkthrough, or short demo that the current workflow can produce.
- Prefer self-contained posts whose useful payload survives after the external link is removed.

## Entry gate

Recommend `Create` only when:

- Relative engagement score is at least 70.
- Replicability is at least 75.
- Tencent Cloud fit is at least 70.
- No claim, legal, or brand blocker exists.
- Baseline confidence is medium or high.
- `contentSelfContained` is true and `assetReady` is `available` or `producible-in-workflow`.

Otherwise return `Watch` or `Skip` with a specific reason.
