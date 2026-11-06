# Read-only race finish analysis

## Architecture inspected

The public `carljeff/breakaway-ride-data` repository is a snapshot relay, not the live dashboard codebase. Its daily Eastern-time sync retrieves public latest/recent routes. The live Site stores canonical Strava activity summaries and original metadata in D1; the existing stream cache stores time/power only. Detailed owner-only analysis fetches time, watts, HR, cadence, distance, altitude, grade and (now) smooth velocity from the existing authorized Strava API. No new activity database or dependency was added.

`get_recent_rides` and `/api/chat/rides/analysis` originally analyze full recordings. Their existing power/duration fields remain recording-scoped. `get_recent_rides(limit:1)` includes the existing owner-private detailed response. `get_ride_intervals` now adds `raceAnalysis` without changing those original fields. Workout classification, training-plan writes, FTP history, weight and the public sync workflow are unchanged.

Strava exposes recording elapsed/moving time, lap indexes and workout classification, not an authenticated official Zwift race result in this pipeline. Recorded lap boundaries are not promoted to race finishes. No FIT download/parser, Zwift account/result connection, or validated route-finish source currently exists. The old terrain routine generated nested overlapping features; the separate race-only routine uses time-domain non-overlapping climb windows. Existing public terrain output is preserved for compatibility.

## Interfaces

- `get_race_analysis({rideId,detailed?:false,verifiedBoundary?})`: owner-only, compact by default. Detailed mode adds elapsed physiology/relative terrain. A manual boundary accepts start/finish elapsed seconds, source and verifiedAt. It is request-scoped and read-only, not a plan/profile update.
- `get_ride_intervals({rideId})`: same detailed API plus separate race analysis, official result, boundary confidence and metadata coverage. Dashboard Intervals view contains a minimal race card/timeline.
- `data/race-results.json`: extensible evidence registry. Official result data is not production detection logic. The Site reads the main-branch registry, with a bundled version for availability during rollout. It contains no GPS/traces/credentials. A result without aligned offsets cannot establish stream boundaries.

## Boundary and metric contract

Explicit official/aligned manual offsets take priority, followed by validated metadata and validated route-finish evidence. Official elapsed time alone is retained but cannot position the race. Inference uses sustained power reduction corroborated by HR or speed; it is always a low-confidence hypothesis, never a verified finish. A post-candidate phase is called unclassified post-candidate recording, not automatically continuous cooldown. An unknown start is not silently verified as zero.

`raceMetrics` is populated only for verified offsets. `candidateRaceMetrics` is separate. `officialResult` contains source-reported numbers, independently of both. Rolling power is bounded to the selected window and excludes missing-data windows; zeros remain zeros, gaps longer than five seconds are missing. Complete race-average/NP require 95% power coverage. Full activity metrics are unchanged. Detailed timeline is capped near 1000 samples and is owner-private/no-store; it is not added to public relay snapshots.

Climbs, above-FTP accelerations, sustained threshold efforts, summit windows and recovery spacing describe measured demands. Chasing/group/drafting/attack interpretations are hypotheses only. Repeatability compares non-identical efforts and is not a controlled fatigue test. Training stress is omitted because no existing authoritative race stress model is present.

## November 6 validation reference

Jeff supplied official Zwift results: 36:19, 18th, +70.65 seconds; 242 W average; 255 W for 20 min, 279 W for 5 min, 340 W for 15 sec. Original screenshot was not independently inspected. The recording is 50:29, 187 W average, 225 W weighted power. Existing five-second physiology shows a sustained easy transition around 35:45, about 34 seconds before official elapsed time, with pre-transition average near 242 W. This conflict must remain visible, not be patched by manufacturing an aligned finish. Exact second-level stream validation is performed after deployment and recorded in the PR.

## Live second-level validation (November 6)

The owner-authorized live action returned 3029 samples with 100% power/HR coverage, two recorded laps, no Strava workout type and no explicit finish metadata. Candidate multi-stream transition: elapsed 2140 seconds (35:40), versus official 2179 seconds (36:19). Candidate metrics: 242.8 W average, 247.1 W normalized, HR 167.6 average / 174 maximum, 92.5 rpm average cadence. Best powers: 5 sec 368.4; 15 sec 341.9; 30 sec 326.4; 1 min 314.1; 2 min 294.9; 5 min 277.8; 10 min 270.5; 20 min 255.4 W. These agree closely with user-supplied official powers but do not resolve the 39-second alignment difference.

Main detected climb: 450–1023 seconds, 271.1 W average, 274 W normalized, 170.2 bpm average HR, about 108 m net elevation rise and four qualifying accelerations. Another climb appears at 1380–1569 seconds. Acceleration criterion: at least 20 seconds above 110% FTP using five-second forward power smoothing. This is not a count of every attack or tactical move. Official 36:19 is displayed independently; verified raceMetrics remains null. The original screenshot is not claimed as inspected.

The private Site includes a downsampled, location-free real-stream regression fixture and test; this fixture is deliberately excluded from the public GitHub PR. Public tests use synthetic streams. Neither public latest/recent nor the GitHub sync workflow receives a detailed timeline.

## Safety and tests

All analysis returns `analysisMode: read_only`, `autoPlanChangesEnabled: false`; no automatic plan or FTP updates. Owner identity checks and private/no-store detail API remain enforced. Public race evidence contains only approved result/boundary metadata; no raw streams or precise location. Tests cover cooldown, combined warm-up, recording-stop finish, unknown boundaries, mid-race power drops, climbs/surges, missing sensors, ordinary rides, invalid evidence, immutability and privacy. Run `node --experimental-strip-types --test tests/race-analysis.test.ts tests/interval-analysis.test.ts tests/recent-ride-analysis.test.ts`.
