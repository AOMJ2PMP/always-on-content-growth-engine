# Contributing

Contributions are welcome for scoring quality, platform adapters, review contracts, visual QA, and safer content-production workflows.

## Before Opening A Pull Request

1. Keep secrets and private workspace identifiers out of fixtures and logs.
2. Preserve the human-review and no-auto-publish boundaries.
3. Add or update a focused test for scoring or deterministic scripts.
4. Run:

```bash
npm run validate
npm test
```

For visual changes, also compare at least two candidates:

```bash
npm run check-visuals -- candidate-a.json candidate-b.json
```

Use public or synthetic examples. Do not submit private customer data, internal claims, unpublished product information, or API credentials.
