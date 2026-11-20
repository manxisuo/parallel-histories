// Run with: node scripts/validate-data.mjs
import {readFileSync} from 'node:fs';
const history=JSON.parse(readFileSync('data/history.json','utf8'));
const geo=JSON.parse(readFileSync('data/places.json','utf8'));
const routes=JSON.parse(readFileSync('data/routes.json','utf8'));
const cities=JSON.parse(readFileSync('data/cities.json','utf8'));
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
const cityIds=new Set();
for(const city of cities.cities){
 if(cityIds.has(city.id))errors.push('Duplicate city scene: '+city.id);
 cityIds.add(city.id);
 if(!placeIds.has(city.id))errors.push('Unknown scene place: '+city.id);
 if(!['tang','oasis','round','harbor'].includes(city.scene))errors.push('Unknown scene style: '+city.id);
 for(const field of ['title','description','fact','uncertainty','tag','era'])if(!city[field])errors.push('Missing '+field+' for '+city.id);
 if(!Array.isArray(city.sources)||!city.sources.length||city.sources.some(url=>!url.startsWith('https://')))errors.push('Invalid scene sources: '+city.id);
}
const networkIds=new Set();
for(const n of routes.networks){
 if(networkIds.has(n.id))errors.push('Duplicate network: '+n.id);
 networkIds.add(n.id);
 if(!Number.isInteger(n.startYear)||!Number.isInteger(n.endYear)||n.startYear>n.endYear||n.focusYear<n.startYear||n.focusYear>n.endYear)errors.push('Invalid network years: '+n.id);
 if(!Array.isArray(n.sourceUrls)||!n.sourceUrls.length||n.sourceUrls.some(url=>!url.startsWith('https://')))errors.push('Invalid network sources: '+n.id);
 const nodes=new Set();
 for(const node of n.nodes){if(!placeIds.has(node.placeId))errors.push('Unknown route place: '+node.placeId);nodes.add(node.placeId)}
 for(const link of n.links)if(!nodes.has(link.from)||!nodes.has(link.to))errors.push('Invalid network link: '+n.id);
 if(!Array.isArray(n.chapters)||n.chapters.length<2)errors.push('Missing chapters: '+n.id);
 for(const chapter of n.chapters||[])if(!nodes.has(chapter.placeId)||!chapter.title||!chapter.body||!chapter.yearNote)errors.push('Invalid chapter in '+n.id);
}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1}
else console.log('Validated '+history.events.length+' events, '+history.periods.length+' periods and '+geo.places.length+' places and '+routes.networks.length+' networks and '+cities.cities.length+' illustrated cities.');
