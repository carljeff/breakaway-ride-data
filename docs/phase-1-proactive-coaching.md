# Proactive coaching · Phase 1

Phase 1 is read-only. Breakaway analyzes recent rides for power, heart-rate response, scheduled-ride presence, assessable workout compliance, and 30-second, 2-minute, and 10-minute power trends.

## Data quality

Every result includes coverage indicators and per-ride source/confidence metadata. Missing interval boundaries are never fabricated. Workout targets are reconstructed from the current training plan only when its prescription is parseable; if boundaries do not match the prescription, compliance is `not_assessable`. The plan is mutable, so same-day ride matching is not presented as proof of the original prescription.

## Safety guardrails

- `analysisMode` is `read_only`.
- `autoPlanChangesEnabled`, automatic workout adjustments, and automatic plan writes are false.
- Future minor adjustments must be bounded, logged with before/after values and a reason, and reversible.
- Major phase, block, FTP/baseline, weekly-volume, or key-session changes require Jeff's explicit approval before any write.

## Validation

The analyzer is tested against a privacy-filtered fixture of the actual 20-ride snapshot covering October 5–30, 2026, plus sparse/missing-data cases. Tests verify input immutability and ensure insufficient data is labeled rather than inferred.
