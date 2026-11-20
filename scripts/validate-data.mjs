// Run with: node scripts/validate-data.mjs
import {readFileSync} from 'node:fs';
const history=JSON.parse(readFileSync('data/history.json','utf8'));
const geo=JSON.parse(readFileSync('data/places.json','utf8'));
const routes=JSON.parse(readFileSync('data/routes.json','utf8'));
const cities=JSON.parse(readFileSync('data/cities.json','utf8'));
const registry=JSON.parse(readFileSync('data/regions.json','utf8'));
const trackIds=new Set();
for(const track of registry.tracks){
 if(trackIds.has(track.id))throw Error('Duplicate geographic track '+track.id);
 trackIds.add(track.id);
 if(!track.label||!/^#[0-9a-fA-F]{6}$/.test(track.color)||typeof track.defaultVisible!=='boolean')throw Error('Invalid geographic track '+track.id);
}
if(!registry.tracks.some(t=>t.defaultVisible))throw Error('No default geographic tracks');
const errors=[],ids=new Set(),periodIds=new Set(),placeIds=new Set();
const isHttps=url=>{try{const u=new URL(url);return u.protocol==='https:'&&!!u.hostname}catch{return false}};
function checkSources(row,kind){
 if(!isHttps(row.sourceUrl))errors.push('Missing primary HTTPS source: '+kind+' '+row.id);
 if(!Array.isArray(row.sources)||!row.sources.length)errors.push('Missing sources list: '+kind+' '+row.id);
 else for(const s of row.sources){if(!isHttps(s.url)||!s.kind)errors.push('Invalid source: '+kind+' '+row.id)}
 if(Array.isArray(row.sources)&&!row.sources.some(s=>s.url===row.sourceUrl))errors.push('Primary source absent from sources: '+kind+' '+row.id)
}
for(const p of geo.places){
 if(placeIds.has(p.id))errors.push('Duplicate place: '+p.id);
 placeIds.add(p.id);
 if(!Number.isFinite(p.lat)||!Number.isFinite(p.lon)||Math.abs(p.lat)>90||Math.abs(p.lon)>180)errors.push('Invalid coordinates: '+p.id);
}
for(const e of history.events){
 if(ids.has(e.id))errors.push('Duplicate event: '+e.id);
 ids.add(e.id);
 if(!Number.isInteger(e.year)||e.year< -1600||e.year>1949)errors.push('Invalid astronomical year: '+e.id);
 if(!['cn','world'].includes(e.civilization))errors.push('Unknown civilization: '+e.id);
 if(!trackIds.has(e.trackId))errors.push('Unknown event track: '+e.id+' -> '+e.trackId);
 checkSources(e,'event');
 if(!e.title||!e.summary||!e.region||!e.category||!['year','approximate','traditional'].includes(e.precision))errors.push('Incomplete event metadata: '+e.id);
 for(const id of e.placeIds||[])if(!placeIds.has(id))errors.push('Unknown place '+id+' in '+e.id);
}
for(const p of history.periods){
 if(periodIds.has(p.id))errors.push('Duplicate period: '+p.id);
 periodIds.add(p.id);
 checkSources(p,'period');
 if(!p.name||!['year','approximate','traditional'].includes(p.precision))errors.push('Incomplete period metadata: '+p.id);
 if(!Number.isInteger(p.startYear)||!Number.isInteger(p.endYear)||p.endYear<=p.startYear)errors.push('Invalid period: '+p.id);
 if(!trackIds.has(p.trackId))errors.push('Unknown period track: '+p.id+' -> '+p.trackId);
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
else console.log('Validated '+registry.tracks.length+' regional tracks, '+history.events.length+' events, '+history.periods.length+' periods and '+geo.places.length+' places and '+routes.networks.length+' networks and '+cities.cities.length+' illustrated cities.');
