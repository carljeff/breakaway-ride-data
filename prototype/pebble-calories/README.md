# Pebble + Breakaway calorie bridge (experimental)

This branch is a **read-only calculation prototype**. It does not modify the existing Breakaway dashboard, published data, TimeStyle watchface, or Pebble Core.

## Findings
- Breakaway's current privacy-filtered `data/latest.json` includes ride start, duration, average power, but **not calories**.
- Today's Nov 17 SST 3x10 ride: 193 W × 3054 seconds = 589 kJ, roughly 589 kcal at the usual cycling efficiency approximation. This is **not** the 550 kcal recorded in Zwift.
- Prefer actual recorded calories when available; fall back to a clearly labeled power-based estimate.
- Pebble's daily calorie total cannot safely be added to cycling calories without time-resolved activity data. If Pebble supplies intervals, subtract overlapping workout time proportionally; this remains approximate.
- Watchface refresh via iOS background PebbleKit JavaScript is **unverified**. Do not claim automatic sync until device testing.

## Test
`node prototype/pebble-calories/calorie-bridge.test.js`

## Next implementation gates
1. Verify whether Breakaway's upstream Strava payload contains recorded activity calories and whether the relay can expose them.
2. Verify whether Pebble TimeStyle or Pebble Health exposes time-bucketed active calories to watchface code. If not, prefer Apple Health's correct total, or show a labeled provisional value.
3. Prototype TimeStyle fork separately and confirm phone-to-watch messaging and background refresh on the user's iPhone.
4. Test a full day against Apple Health, including one Zwift workout, and record staleness/error cases.

No subscriptions, new hardware, or production changes are required for this calculation prototype.
