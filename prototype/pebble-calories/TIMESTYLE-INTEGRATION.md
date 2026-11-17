# TimeStyle integration status

Source inspected: freakified/TimeStylePebble version 8.1.0.
- `package.json` already targets `gabbro`, includes `health` capability.
- `src/c/sidebar_widgets.c` uses `cached_health_sum_today(HealthMetricActiveKCalories)` in `ActiveCalories_getContent`.
- A separate UUID is needed to install a test version without replacing the original.
- The proof-of-concept in `timestyle-calorie-overlay.c` calculates Pebble active calories today, subtracts estimated Pebble activity in each workout time window, then adds Breakaway calories. The SDK says partial-day sums are **weighted daily totals**, so overlap subtraction is approximate, not a guarantee of accuracy.

## Required before compiling
1. Fork or otherwise obtain the **complete** TimeStyle repository, including binary font/image resources.
2. Add message keys and a PebbleKit JS fetch to request a published `today.json` feed, including proper local date and caching.
3. Integrate the C calculation with `ActiveCalories_getContent`, store workout windows, reject stale or out-of-day data, and invalidate the sidebar when messages arrive.
4. Preserve TimeStyle settings and screenshot layout. Test side-by-side with original TimeStyle using a new UUID.
5. Build with latest Pebble SDK for `gabbro`, produce .pbw and test iOS background updates.

## Blockers in this environment
Pebble SDK/CLI are not installed and this runtime cannot download GitHub source/assets directly, so an actual installable PBW has **not** been built or tested. This file is source scaffolding only. Do not present it as an installable watchface.
