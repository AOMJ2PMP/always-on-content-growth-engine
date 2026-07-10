# Always-on Content Growth Engine Plugin

This plugin turns external social proof into reviewable Tencent Cloud content opportunities.

It is an independent open-source workflow project. It is not an official Tencent Cloud product and does not include Tencent Cloud logos, credentials, private workspace identifiers, or approval to publish brand claims.

## Workflow

`source -> evidence -> relative score -> Tencent Cloud angle -> platform copy -> visual material -> carousel -> Notion review`

The plugin never treats raw engagement as proof by itself and never auto-publishes. Public-facing copy is English; internal evidence, review notes, and operating fields are Chinese.

It also applies two hard gates:

- **Asset dependency:** a high-performing post is skipped when its useful payload lives in a missing whitepaper, report, research study, or customer proof.
- **Visual uniqueness:** brand style may repeat, but candidate prompts, visual signatures, and finished background files may not.

## Skills

- `always-on-content-growth-engine`: end-to-end router and completion contract.
- `social-content-intelligence`: TikHub-backed evidence capture and account-baseline scoring.
- `tencent-cloud-content-angle`: customer-first topic translation and claim controls.
- `multiplatform-content-package`: X, LinkedIn, Instagram, CTA, alt text, and image copy budgets.
- `tencent-cloud-illustration`: text-light VI-compatible visual material prompts.
- `social-carousel-composer`: concise 1080x1080 carousel composition and visual QA.
- `content-review-handoff`: review gates and Notion database write/readback.

## Requirements

- `TIKHUB_API_KEY` in the environment. Never store it in this plugin.
- Node.js and `npx` for the hosted TikHub MCP bridge.
- The Notion connector enabled in Codex for database handoff.
- An image generator for final raster backgrounds when image generation is requested.
- Playwright in the working project when raster carousel rendering is requested.

## Install From Source

```bash
git clone https://github.com/AOMJ2PMP/always-on-content-growth-engine.git
cd always-on-content-growth-engine
export TIKHUB_API_KEY="your_key"
npm run validate
npm test
```

The folder is a Codex plugin package: `.codex-plugin/plugin.json` exposes the skills and `.mcp.json` connects the bounded TikHub X and LinkedIn tool surfaces. Add it to a local Codex marketplace or copy it into an existing plugin-development workspace.

## Contracts

Every skill reads and enriches the same candidate package defined in `references/content-candidate.schema.json`. Database handoff follows `references/notion-opportunity-pool.md`.

## Validation

```bash
npm run validate
npm test
npm run check-visuals -- candidate-a.json candidate-b.json
```

Render a candidate with one or more text-free backgrounds:

```bash
npm run render-carousel -- examples/cases/azure-agent-launch-readiness.scored.json \
  --background /absolute/path/to/background.png \
  --output /absolute/path/to/output-directory
```

The TikHub MCP path is preferred. If a hosted MCP call hangs or is unavailable, use the documented bounded REST fallback and record the access path in the evidence block.

## Data And Brand Safety

- Example metrics and source URLs are public research fixtures and may become stale.
- TikHub calls are billed; keep account pulls and pagination bounded.
- Respect source-platform terms, copyright, privacy, and brand review requirements.
- Do not treat the visual guardrails as permission to reproduce official logos or make unapproved product claims.
- The workflow stops at review-ready drafts and never auto-publishes.

## License

MIT. See `LICENSE`.
