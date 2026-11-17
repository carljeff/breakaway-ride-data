const assert=require('node:assert/strict');
const {rideCalories,combineDay}=require('./calorie-bridge.js');
const ride={id:'ride_6117c722a6803454a38e',date:'2026-11-17',startTime:'2026-11-17T13:14:20Z',durationSeconds:3054,power:{averageWatts:193}};
assert.deepEqual(rideCalories(ride),{kcal:589,source:'power_estimate'});
const base={date:'2026-11-17',rides:[ride],pebbleDailyCalories:73};
const noIntervals=combineDay(base);
assert.equal(noIntervals.combinedKcal,null);
assert.equal(noIntervals.provisionalUpperBoundKcal,662);
const withIntervals=combineDay({...base,pebbleIntervals:[
  {start:'2026-11-17T12:00:00Z',end:'2026-11-17T13:00:00Z',kcal:40},
  {start:'2026-11-17T13:14:20Z',end:'2026-11-17T14:05:14Z',kcal:33}
]});
assert.equal(withIntervals.combinedKcal,629);
assert.equal(combineDay({...base,rides:[ride,ride]}).cyclingKcal,589);
assert.equal(rideCalories({...ride,calories:550}).kcal,550);
console.log('Calorie bridge prototype tests passed');
