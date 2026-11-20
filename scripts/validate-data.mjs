// Run with: node scripts/validate-data.mjs
import {readFileSync} from 'node:fs';
const history=JSON.parse(readFileSync('data/history.json','utf8'));
const geo=JSON.parse(readFileSync('data/places.json','utf8'));
const errors=[],ids=new Set(),placeIds=new Set();
for(const p of geo.places){
 if(placeIds.has(p.id))errors.push('Duplicate place: '+p.id);
 placeIds.add(p.id);
 if(!Number.isFinite(p.lat)||!Number.isFinite(p.lon)||Math.abs(p.lat)>90||Math.abs(p.lon)>180)errors.push('Invalid coordinates: '+p.id);
}
for(const e of history.events){
 if(ids.has(e.id))errors.push('Duplicate event: '+e.id);
 ids.add(e.id);
 if(!Number.isInteger(e.year))errors.push('Invalid astronomical year: '+e.id);
 if(!['cn','world'].includes(e.civilization))errors.push('Unknown civilization: '+e.id);
 if(!e.sourceUrl?.startsWith('https://'))errors.push('Missing HTTPS source: '+e.id);
 for(const id of e.placeIds||[])if(!placeIds.has(id))errors.push('Unknown place '+id+' in '+e.id);
}
for(const p of history.periods){
 if(!Number.isInteger(p.startYear)||!Number.isInteger(p.endYear)||p.endYear<=p.startYear)errors.push('Invalid period: '+p.id);
}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1}
else console.log('Validated '+history.events.length+' events, '+history.periods.length+' periods and '+geo.places.length+' places.');
