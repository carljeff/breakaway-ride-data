# Breakaway ride-data relay

Privacy-filtered cycling data synchronized from Breakaway for ChatGPT analysis. Raw GPS coordinates, route traces, home/start/end locations, credentials, and tokens are excluded.

- `data/latest.json`: latest ride
- `data/recent.json`: recent rides with intervals when reliably available
- `data/recent-analysis.json`: Phase 1 read-only coaching analysis and data-quality indicators
- `data/history/`: privacy-filtered yearly history
- `data/training-plan.json`: planning source of truth

See [Phase 1 proactive coaching](docs/phase-1-proactive-coaching.md) for analysis scope and safety guardrails.

## Race-specific analysis

See [race analysis architecture, API and validation](docs/race-analysis.md). `lib/race-analysis.ts` is the dependency-free pure analyzer; `data/race-results.json` stores sourced result/boundary evidence separately from production logic. The live Site integration is reviewable in `integrations/site-race-analysis.patch`. Existing public latest/recent recording metrics remain unchanged. Owner-only detailed analysis is available through Breakaway; raw streams are not published here.

Run the public race suite with Node 22.13+: `node --experimental-strip-types --test tests/race-analysis.test.ts`.
