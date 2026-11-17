/* Experimental Pebble calorie bridge. No production wiring or watchface changes.
   Input: privacy-filtered Breakaway rides and Pebble activity calorie intervals.
   Returns a daily total, source labels, and freshness. */
function rideCalories(ride) {
  if (Number.isFinite(ride.calories) && ride.calories >= 0) return {kcal:ride.calories, source:"recorded"};
  const watts=ride.power?.averageWatts, seconds=ride.durationSeconds;
  if (!(watts>0 && seconds>0)) return null;
  // Approximation: mechanical kJ ~ metabolic kcal for cycling (~24% efficiency).
  return {kcal:Math.round(watts*seconds/1000),source:"power_estimate"};
}
function combineDay({rides,pebbleIntervals=[],pebbleDailyCalories=null,date,now=new Date().toISOString()}) {
  const seen=new Set(), workouts=[];
  for(const ride of rides||[]) {
    if(ride.date!==date || seen.has(ride.id)) continue;
    seen.add(ride.id);
    const estimate=rideCalories(ride);
    if(!estimate) continue;
    const start=Date.parse(ride.startTime),end=start+ride.durationSeconds*1000;
    if(!Number.isFinite(start)) continue;
    workouts.push({id:ride.id,start,end,...estimate});
  }
  // Overlapping workouts could represent duplicate recordings; do not silently add them.
  workouts.sort((a,b)=>a.start-b.start);
  const overlaps=workouts.some((w,i)=>i>0 && w.start<workouts[i-1].end);
  const cyclingKcal=workouts.reduce((n,w)=>n+w.kcal,0);
  let pebbleNonRide=null,overlapKnown=false;
  if(pebbleIntervals.length) {
    overlapKnown=true;
    pebbleNonRide=0;
    for(const p of pebbleIntervals) {
      const start=Date.parse(p.start),end=Date.parse(p.end);
      if(!(end>start) || !(p.kcal>=0)) continue;
      const overlappingMs=workouts.reduce((n,w)=>n+Math.max(0,Math.min(end,w.end)-Math.max(start,w.start)),0);
      const fraction=Math.max(0,1-Math.min(1,overlappingMs/(end-start)));
      pebbleNonRide+=p.kcal*fraction;
    }
    pebbleNonRide=Math.round(pebbleNonRide);
  }
  // Without time-bucketed Pebble activity, adding the daily total risks double-counting.
  return {date,cyclingKcal,pebbleNonRideKcal:pebbleNonRide,
    combinedKcal:overlapKnown&&!overlaps?cyclingKcal+pebbleNonRide:null,
    provisionalUpperBoundKcal:pebbleDailyCalories==null?null:cyclingKcal+pebbleDailyCalories,
    warnings:[...(!overlapKnown?["Pebble time intervals unavailable: combined total withheld"]:[]),
      ...(overlaps?["Overlapping ride records: combined total withheld"]:[])],
    rides:workouts.map(({id,kcal,source})=>({id,kcal,source})),generatedAt:now};
}
if(typeof module!=="undefined") module.exports={rideCalories,combineDay};
