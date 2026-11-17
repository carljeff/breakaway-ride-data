/* Generates a public, privacy-safe calorie summary from Breakaway's published
   rides. This is a development script, not yet wired into GitHub Actions.
   Run: node prototype/pebble-calories/generate-feed.js [input.json] [output.json]
*/
const fs = require('node:fs');
const path = require('node:path');
const {rideCalories} = require('./calorie-bridge');
function makeFeed(rides, day) {
  const seen = new Set(), workouts = [];
  for (const ride of rides) {
    if (ride.date !== day || !ride.startTime || seen.has(ride.id)) continue;
    seen.add(ride.id);
    const calories = rideCalories(ride);
    if (!calories) continue;
    const start = Date.parse(ride.startTime);
    const end = start + ride.durationSeconds * 1000;
    if (!Number.isFinite(start) || !(end > start)) continue;
    workouts.push({id:ride.id, start:new Date(start).toISOString(),
      end:new Date(end).toISOString(), calories:calories.kcal,
      source:calories.source});
  }
  workouts.sort((a,b)=>a.start.localeCompare(b.start));
  return {schemaVersion:1,date:day,workouts,
    cyclingCalories:workouts.reduce((sum,w)=>sum+w.calories,0),
    accuracyNote:'power_estimate calories are approximations, not Apple Health active energy'};
}
if (require.main === module) {
  const input=process.argv[2]||'data/recent.json';
  const output=process.argv[3]||'prototype/pebble-calories/preview-feed.json';
  const parsed=JSON.parse(fs.readFileSync(input,'utf8'));
  const day=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Indiana/Indianapolis',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  const rides=parsed.rides||(parsed.ride?[parsed.ride]:[]);
  fs.mkdirSync(path.dirname(output),{recursive:true});
  fs.writeFileSync(output,JSON.stringify(makeFeed(rides,day),null,2)+'\n');
  console.log('Wrote '+output);
}
module.exports={makeFeed};
