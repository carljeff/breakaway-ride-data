# Breakaway ride-data relay

Privacy-filtered cycling data synchronized from Breakaway for ChatGPT analysis. Raw GPS coordinates, route traces, home/start/end locations, credentials, and tokens are excluded.

- `data/latest.json`: latest ride
- `data/recent.json`: recent rides with intervals when reliably available
- `data/recent-analysis.json`: Phase 1 read-only coaching analysis and data-quality indicators
- `data/history/`: privacy-filtered yearly history
- `data/training-plan.json`: planning source of truth

See [Phase 1 proactive coaching](docs/phase-1-proactive-coaching.md) for analysis scope and safety guardrails.
