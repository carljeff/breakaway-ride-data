/* TimeStyle integration proof of concept, NOT compiled or linked.
 * For gabbro watchfaces with Pebble Health enabled.
 * Inputs are UTC workout windows and calorie totals from Breakaway.
 * No accurate combined total if intervals overlap or Pebble Health unavailable.
 * The HealthService API weights partial-day sums: overlap subtraction is an
 * approximation and must be validated against Apple Health.
 */
#include <pebble.h>
#include <stdbool.h>
#include <stdint.h>
#include <time.h>
typedef struct {
  time_t start_utc;
  time_t end_utc;
  int32_t kcal;
} BreakawayWorkout;
typedef struct {
  int32_t kcal;
  bool available;
  bool approximate;
} CombinedCalories;
static bool ranges_overlap(const BreakawayWorkout *a,const BreakawayWorkout *b) {
  return a->start_utc < b->end_utc && b->start_utc < a->end_utc;
}
CombinedCalories breakaway_combined_calories(const BreakawayWorkout *rides,
                                             size_t ride_count) {
  CombinedCalories result = {0,false,true};
#ifdef PBL_HEALTH
  time_t now=time(NULL);
  struct tm local=*localtime(&now);
  local.tm_hour=0;local.tm_min=0;local.tm_sec=0;
  time_t start=mktime(&local);
  HealthServiceAccessibilityMask mask=
    health_service_metric_accessible(HealthMetricActiveKCalories,start,now);
  if (!(mask & HealthServiceAccessibilityMaskAvailable)) return result;
  int32_t total=health_service_sum_today(HealthMetricActiveKCalories);
  for(size_t i=0;i<ride_count;i++) {
    const BreakawayWorkout *r=&rides[i];
    if(r->end_utc<=start || r->start_utc>=now || r->end_utc<=r->start_utc || r->kcal<0)
      continue;
    for(size_t j=0;j<i;j++) if(ranges_overlap(r,&rides[j])) return result;
    time_t a=r->start_utc>start?r->start_utc:start;
    time_t b=r->end_utc<now?r->end_utc:now;
    HealthServiceAccessibilityMask interval_mask=
      health_service_metric_accessible(HealthMetricActiveKCalories,a,b);
    if (!(interval_mask & HealthServiceAccessibilityMaskAvailable)) return result;
    int32_t pebble_overlap=health_service_sum(HealthMetricActiveKCalories,a,b);
    total-=pebble_overlap;
    total+=r->kcal;
  }
  result.kcal=total>0?total:0;
  result.available=true;
#endif
  return result;
}
