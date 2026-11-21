// Original illustrations: geographic context, concrete objects and large labels.
const rect=(x,y,w,h,fill,more='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${more}/>`;
const path=(d,fill,more='')=>`<path d="${d}" fill="${fill}" ${more}/>`;
const circle=(x,y,r,fill,more='')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${more}/>`;
const line=(d,color='#c7d3db',width=2,more='')=>path(d,'none',`stroke="${color}" stroke-width="${width}" ${more}`);
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const text=(x,y,s,size=26,color='#fff',more='')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${color}" font-family="Arial,sans-serif" font-weight="700" ${more}>${esc(s)}</text>`;
const label=(s,fill='#14283b')=>rect(0,142,600,42,fill)+text(300,173,s,32,'#fff','text-anchor="middle"');
const svg=(id,body,caption,height=184)=>`<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(caption)}" viewBox="0 0 600 ${height}" preserveAspectRatio="xMidYMid meet"><defs><linearGradient id="${id}-air" x2="0" y2="1"><stop stop-color="#749bb2"/><stop offset="1" stop-color="#d9d6c3"/></linearGradient><linearGradient id="${id}-sea" x2="0" y2="1"><stop stop-color="#49899c"/><stop offset="1" stop-color="#1a4d69"/></linearGradient></defs>${body}</svg>`;
const stripLabel=s=>rect(0,130,600,34,'#14283b')+text(300,156,s,32,'#fff','text-anchor="middle"');
const city=(base,color,seed=0)=>Array.from({length:19},(_,i)=>{const x=i*35-12,h=22+(i*47+seed)%79;return rect(x,base-h,27,h,color)+Array.from({length:3},(_,j)=>rect(x+5,base-h+10+j*17,5,5,'#a5bec3','opacity=".6"')).join('');}).join('');
function kyiv(){
  const beams=Array.from({length:6},(_,i)=>line(`M${154+i*79} 0Q${88+i*78} 46 ${93+i*76} 112`,'#eda465',2.2)).join('');
  const bridge=path('M0 113Q130 70 262 113Q399 66 600 110V124H0Z','#44576b')+line('M0 117H600','#c1c9c5',3)+[48,157,280,410,543].map(x=>rect(x,120,10,22,'#435c70')).join('');
  const dome=rect(283,58,65,44,'#c6b786')+path('M278 58Q316 13 353 58Z','#c4a951')+line('M315 21V7M309 13H321','#e5ce89',2);
  return svg('kyiv',rect(0,0,600,184,'#15283e')+city(113,'#273c53',19)+beams+dome+rect(0,124,600,18,'#2d667a')+bridge+circle(161,109,13,'#f2b763')+circle(161,109,6,'#fff4be')+rect(14,9,138,45,'#b82d43')+text(25,44,'KYIV',39)+text(23,79,'RUSSIAN ATTACK',22,'#f2c890')+label('8 DEAD ACROSS UKRAINE'),'Russian missile attack on Kyiv; eight deaths reported nationwide');
}
function cyclone(){
  const coast=path('M0 0H245L237 19L218 31L218 47L192 63L193 81L165 102L144 142H0Z','#cfcca9')+path('M0 113L127 83L170 106L144 142H0Z','#96b39b');
  const spiral=[0,60,120,180,240,300].map(a=>`<g transform="translate(337 74) rotate(${a}) scale(.85)">${line('M-12-8C-11-43 24-65 57-47C27-52 6-26 4-4','#edf5ee',7,'stroke-linecap="round"')}</g>`).join('');
  const rain=Array.from({length:17},(_,i)=>line(`M${280+(i*37)%285} ${10+(i*43)%114}l-8 13`,'#9ec8d3',1.1)).join('');
  return svg('akvan',rect(0,0,600,184,'url(#akvan-sea)')+rain+coast+spiral+circle(337,74,7,'#34758b')+circle(202,64,6,'#b82d43','stroke="#fff" stroke-width="2"')+line('M325 74L211 64','#f8c45f',3)+path('M215 57L204 63L215 71Z','#f8c45f')+text(21,36,'ODISHA',32,'#203e4a')+text(21,69,'Gopalpur',25,'#203e4a')+text(431,41,'AKVAN',37)+text(402,126,'BAY OF BENGAL',20,'#e6f0ed')+label('LANDFALL · 300,000+ EVACUATED'),'Cyclone Akvan crosses India near Gopalpur');
}
function cop(){
  const globe=circle(93,66,55,'#4598a0')+path('M50 41L77 23L92 34L109 30L121 51L102 62L107 80L87 101L75 75L58 72Z','#9ebf7c')+line('M38 66H148M93 11C67 42 67 91 93 121M93 11C119 42 119 91 93 121','#c1ded7',1.3);
  const paper=rect(185,10,398,123,'#f3f2e5')+text(207,48,'COP31',40,'#203b45')+text(207,80,'FOSSIL FUELS',25,'#526265')+line('M204 69L548 84','#b82d43',4)+line('M207 99H358M207 115H325','#afb7a6',3)+rect(383,92,185,34,'#b82d43')+text(475,118,'NO DEAL',28,'#fff','text-anchor="middle"');
  return svg('cop',rect(0,0,600,184,'#1c494b')+globe+paper+text(37,137,'ANTALYA',20,'#e2ecd7')+label('OVERTIME · TALKS CONTINUE'),'COP31 continues beyond its scheduled finish without a final deal');
}
function markets(){
  let board=rect(0,0,600,164,'#182c3c');
  for(const [i,name,value]of [[0,'NIKKEI','−5.1%'],[1,'KOSPI','−5.2%'],[2,'TAIEX','−6.2%']]){
    const x=18+i*198;board+=text(x+88,40,name,24,'#e9f0ee','text-anchor="middle"')+text(x+88,103,value,48,'#ffaaa0','text-anchor="middle"');
  }
  return svg('markets',board+stripLabel('ASIAN STOCKS FALL'),'Friday’s reported Asian stock-index losses, not a fabricated intraday price series',164);
}
function reset(){
  let flags=rect(0,0,300,164,'#285088')+rect(300,0,300,164,'#163c6c');
  for(let i=0;i<12;i++){const a=i*Math.PI/6;flags+=circle(103+43*Math.cos(a),65+43*Math.sin(a),4.2,'#f1cf66');}
  flags+=line('M360 0L600 130M600 0L360 130','#fff2df',22)+line('M360 0L600 130M600 0L360 130','#b5424e',8)+rect(464,0,43,130,'#fff2df')+rect(360,47,240,38,'#fff2df')+rect(475,0,21,130,'#b5424e')+rect(360,57,240,18,'#b5424e');
  const document=path('M204 10H333L369 46V121H204Z','#f2eddc','stroke="#203b4f" stroke-width="2"')+path('M333 10V46H369Z','#c6d4d2')+line('M218 69H352M218 84H352M218 99H327','#6e8f94',2.5)+text(218,46,'AGREED',25,'#28554f');
  return svg('reset',flags+document+stripLabel('UK–EU DEAL AGREED'),'UK and EU agree a reset package on food, youth mobility and carbon markets',164);
}
function hunger(){
  const sacks=[35,112,189].map((x,i)=>path(`M${x} 124Q${x-11} 78 ${x+4} 34L${x+48} 32Q${x+67} 80 ${x+56} 124Z`,i%2?'#c9b57e':'#dfcf99','stroke="#8b825e" stroke-width="2"')+line(`M${x+4} 43L${x+48} 41`,'#7c7958',2)+text(x+28,88,'WFP',20,'#49655f','text-anchor="middle"')).join('');
  return svg('hunger',rect(0,0,600,164,'#244d52')+rect(0,117,600,13,'#67877c')+sacks+text(424,70,'91m',69,'#f2d898','text-anchor="middle"')+text(423,107,'PEOPLE · 2027 PLAN',23,'#f1ead3','text-anchor="middle"')+stripLabel('$12.15bn AID SOUGHT'),'WFP launches its 2027 plan to assist 91 million people',164);
}
function cricket(){
  const stands=[0,1,2,3,4,5].map(i=>line(`M0 ${44+i*11}Q300 ${-31+i*11} 600 ${44+i*11}`,'#879e9d',4)).join('');
  const player=circle(274,51,13,'#c09b76')+path('M261 45Q272 27 289 43V49Z','#172d39')+path('M253 70L282 67L303 111L271 125L244 99Z','#f7f3df')+path('M271 121L292 115L315 160H299L275 135L260 169H243Z','#f0eedb')+path('M278 75L306 90L330 70L338 77L310 105L285 91Z','#c09b76')+path('M329 64L340 57L364 104L354 112Z','#d6b77c');
  return svg('cricket',rect(0,0,600,164,'#b9d4d6')+stands+path('M0 89Q300 45 600 89V130H0Z','#548c70')+path('M188 130L226 79H310L345 130Z','#cfbf96')+`<g transform="translate(18 -17) scale(.85)">${player}</g>`+rect(388,10,186,112,'#163e38')+text(481,31,'PHILLIPS',20,'#dfe5c9','text-anchor="middle"')+text(481,104,'118',62,'#fff3ca','text-anchor="middle"')+stripLabel('NEW ZEALAND · TEST DAY 2'),'Glenn Phillips scores 118 in New Zealand’s first innings against India',164);
}
function qatar(){
  const towers=city(130,'#557c85',31)+path('M46 129L61 43L83 17L102 129Z','#b0c3ba')+line('M63 47L88 126','#e1dec5',2);
  const qflag=rect(331,9,106,38,'#f4eddf')+path('M357 9H437V47H357L367 41L357 35L367 29L357 23L367 17Z','#8c3045');
  const germany=rect(455,9,108,38,'#d5a950')+rect(455,9,108,13,'#1d2931')+rect(455,22,108,13,'#a94247');
  return svg('qatar',rect(0,0,600,164,'url(#qatar-air)')+towers+qflag+germany+rect(287,57,294,65,'#f2ecdc')+text(435,102,'€15bn',52,'#234e58','text-anchor="middle"')+stripLabel('QATAR · INVESTMENT PLEDGE'),'Qatar pledges 15 billion euros of investment in Germany',164);
}
function diamonds(){
  const facets=path('M108 38H270L314 96L188 176L64 96Z','#bddde0','stroke="#eff5e9" stroke-width="2"')+path('M108 38L140 96H64Z','#8cc2cb')+path('M140 96L188 176L235 96Z','#e7f2e8')+path('M140 96L188 38L235 96Z','#d7eddf')+path('M235 96L270 38L314 96Z','#729fab')+line('M64 96H314M188 38L140 96L188 176L235 96Z','#567f8e',2);
  return svg('diamond',rect(0,0,600,164,'#214851')+`<g transform="translate(7 -12) scale(.78)">${facets}</g>`+text(412,23,'ANGOLA',18,'#d5e6db','text-anchor="middle"')+text(412,91,'10%',60,'#f5d390','text-anchor="middle"')+text(412,124,'PLANNED STAKE',17,'#d5e6db','text-anchor="middle"')+stripLabel('$180m · DE BEERS PLAN'),'Angola’s planned 180 million dollar purchase of 10 percent of De Beers',164);
}
function inflation(){
  const skyline=city(130,'#7c939d',7)+path('M65 130L82 43L100 130Z','#b34a4c')+line('M83 19V130M65 109H101M72 81H94','#e9dbbd',2);
  const board=rect(271,9,312,118,'#f3efdf')+text(427,24,'CORE CPI · OCTOBER',18,'#38535e','text-anchor="middle"')+text(427,91,'2.2%',60,'#9d3649','text-anchor="middle"')+text(427,123,'YEAR ON YEAR',14,'#38535e','text-anchor="middle"');
  return svg('cpi',rect(0,0,600,164,'url(#cpi-air)')+skyline+circle(207,37,28,'#c25858','opacity=".7"')+board+stripLabel('JAPAN · OCTOBER CORE CPI'),'Japan releases October core CPI at 2.2 percent year on year',164);
}
function mercury(){
  const stars=Array.from({length:31},(_,i)=>circle((i*73+19)%600,(i*47+13)%185,i%3===0?1.7:1,'#b2c2cf')).join('');
  const planet=circle(465,92,80,'#b9b5a4')+path('M465 12A80 80 0 0 1 465 172Q514 101 465 12Z','#898f87')+[[437,51,17],[476,111,21],[424,120,12],[488,54,10],[455,90,8]].map(([x,y,r])=>circle(x,y,r,'#8c958f','opacity=".65"')+circle(x-2,y-2,r*.7,'#afb2a1','opacity=".6"')).join('');
  const craft=`<g transform="translate(202 91) rotate(-12)">${rect(-120,-16,78,34,'#3f83ac','stroke="#9ec0ce" stroke-width="2"')}${rect(43,-16,78,34,'#3f83ac','stroke="#9ec0ce" stroke-width="2"')}${[-101,-82,-63,62,81,100].map(x=>line(`M${x} -15V18`,'#abd2dc',1)).join('')}${rect(-34,-30,67,61,'#d9bd75')}${path('M-34-30L-10-43L48-36L33-30Z','#eee0ac')}${circle(0,0,15,'#dce2da')}${circle(0,0,8,'#536c78')}${line('M0 31V54L31 65','#b8c5c8',2)}</g>`;
  return svg('mercury',rect(0,0,600,164,'#172c43')+`<g transform="translate(0 -3) scale(1 .72)">${stars}</g>`+line('M46 112Q254 145 383 79','#879ba6',1.3,'stroke-dasharray="5 5"')+`<g transform="translate(134 -3) scale(.72)">${planet}</g><g transform="translate(15 -4) scale(.8)">${craft}</g>`+text(29,28,'BEPICOLOMBO',24)+stripLabel('21 NOV · ORBIT PLANNED'),'Friday preview of BepiColombo’s planned Saturday Mercury orbit insertion',164);
}
export const scenes=[kyiv,cyclone,cop,markets,reset,hunger,cricket,qatar,diamonds,inflation,mercury];

export function worldMap(stories,colors){
  // Coarse authored coastlines in longitude/latitude share the pins' projection.
  const continents=[
    [[-168,70],[-140,70],[-125,61],[-117,71],[-95,74],[-78,64],[-60,54],[-53,48],[-67,45],[-75,35],[-81,25],[-83,29],[-96,28],[-98,20],[-88,17],[-83,10],[-77,8],[-81,8],[-92,15],[-105,20],[-112,29],[-117,33],[-124,42],[-130,54],[-143,59],[-160,57],[-168,60]],
    [[-81,9],[-72,12],[-60,7],[-51,4],[-35,-6],[-40,-20],[-48,-29],[-54,-35],[-64,-55],[-72,-51],[-76,-30],[-81,-5]],
    [[-53,59],[-43,61],[-20,76],[-28,83],[-52,81],[-65,70]],
    [[-10,36],[-9,43],[-1,46],[-5,49],[6,54],[10,58],[5,62],[13,69],[28,71],[32,66],[24,59],[30,53],[40,47],[43,41],[35,36],[28,36],[24,40],[20,39],[18,42],[15,39],[12,45],[7,44],[3,42]],
    [[-17,15],[-17,22],[-10,31],[-6,36],[10,37],[24,32],[34,31],[42,13],[51,12],[43,-12],[34,-24],[19,-35],[12,-18],[8,4],[-5,5]],
    [[30,71],[60,72],[90,77],[117,73],[140,70],[170,63],[179,54],[154,50],[142,46],[135,35],[122,31],[119,22],[109,19],[109,10],[103,1],[98,8],[92,22],[89,22],[80,8],[73,20],[67,25],[58,25],[51,12],[43,12],[36,30],[44,39],[40,47],[30,53]],
    [[130,31],[135,35],[141,41],[145,45],[143,36],[136,33]],
    [[95,5],[105,-5],[119,-8],[130,-8],[140,-4],[151,-7],[148,-10],[134,-6],[121,-10],[105,-7]],
    [[113,-22],[114,-33],[130,-32],[138,-36],[145,-39],[153,-29],[150,-17],[142,-11],[136,-13],[130,-12],[124,-17]],
    [[166,-34],[175,-38],[178,-38],[174,-42],[168,-47],[165,-45],[171,-40]],
    [[48,-13],[50,-18],[47,-26],[44,-24]],
  ];
  const bounds={x:23,y:15,w:570,h:278};
  const xy=(lon,lat)=>({x:bounds.x+(Number(lon)+180)/360*bounds.w,y:bounds.y+(85-Number(lat))/170*bounds.h});
  let content=rect(0,0,620,338,'#152a3e');
  for(const lat of [-60,-30,0,30,60]){const p=xy(0,lat);content+=line(`M22 ${p.y}H594`,'#3a4b5d',.6);}
  content+=continents.map(points=>path(points.map(([lon,lat],i)=>{const p=xy(lon,lat);return `${i?'L':'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;}).join('')+'Z','#e2dfba','stroke="#f4f4db" stroke-width="1"')).join('');
  for(const s of stories.filter(s=>s.lon!==null)){
    const p=xy(s.lon,s.lat),feature=s.id<=11;
    if(!feature) content+=circle(p.x,p.y,4,colors[s.region],'stroke="#f7f4de" stroke-width=".6"');
  }
  // Offshore numeric labels use leaders to exact event anchors; the Qatar pin marks the investing country.
  const offsets={1:[-28,-24],2:[-21,18],3:[-26,0],4:[15,15],5:[-48,-39],7:[9,20],8:[-14,25],9:[-15,17],10:[28,-13]};
  for(const s of stories.slice(0,11).filter(s=>s.lon!==null)){
    const p=xy(s.lon,s.lat),o=offsets[s.id]||[0,0],x=p.x+o[0],y=p.y+o[1];
    content+=line(`M${p.x} ${p.y}L${x} ${y}`,'#e7e5d6',1)+circle(p.x,p.y,2.5,'#fff')+circle(x,y,18,colors[s.region],'stroke="#fff" stroke-width="1.7"')+text(x,y+9,String(s.id),26,'#fff','text-anchor="middle"');
  }
  content+=text(28,321,'6 = GLOBAL AID   11 = MERCURY',15,'#d9e2df');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 620 338" role="img" aria-label="World map keyed to the eleven illustrated features">${content}</svg>`;
}
