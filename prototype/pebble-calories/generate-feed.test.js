const assert=require('node:assert/strict');
const {makeFeed}=require('./generate-feed');
const ride={id:'test',date:'2026-11-17',startTime:'2026-11-17T13:14:20Z',durationSeconds:3054,power:{averageWatts:193}};
const result=makeFeed([ride,ride], '2026-11-17');
assert.equal(result.cyclingCalories,589);
assert.equal(result.workouts.length,1);
assert.equal(result.workouts[0].end,'2026-11-17T14:05:14.000Z');
assert.deepEqual(makeFeed([ride],'2026-11-18').workouts,[]);
console.log('Feed generation tests passed');
