# Signal Scoring Rubric

The scoring script converts lift into a bounded score with:

`liftScore = clamp(0, 100, 50 + 25 * log2(lift))`

Interpretation:

- `1x` account median = 50
- `2x` = 75
- `4x` = 100
- Below `1x` falls below 50

Composite signal score:

- Relative engagement: 35%
- Deep-engagement proxy: 15%
- Freshness: 10%
- Replicability: 15%
- Tencent Cloud fit: 15%
- Brand safety: 10%

`Create` requires signal score >= 75, relative engagement >= 70, replicability >= 75, Tencent Cloud fit >= 70, medium/high baseline confidence, and no blockers.

The asset-dependency gate is a hard override. If the useful payload lives in a missing whitepaper, report, research study, customer proof, or other owned asset, the recommendation is `Skip` even when performance is excellent. Native demos and simple social visuals may pass when the replacement is producible inside the current workflow.

`Watch` is used for signal score >= 60 or when a strong post lacks sufficient baseline confidence. Everything else is `Skip`.

Scores support editorial judgment; they do not replace it. Save/share/comment proxies are platform-specific and must be labeled as proxies.
