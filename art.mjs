// Original illustrations: geographic context, concrete objects and large labels.
const rect=(x,y,w,h,fill,more='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${more}/>`;
const path=(d,fill,more='')=>`<path d="${d}" fill="${fill}" ${more}/>`;
const circle=(x,y,r,fill,more='')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${more}/>`;
const line=(d,color='#c7d3db',width=2,more='')=>path(d,'none',`stroke="${color}" stroke-width="${width}" ${more}`);
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const text=(x,y,s,size=26,color='#272720',more='')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${color}" font-family="Arial,sans-serif" font-weight="700" ${more}>${esc(s)}</text>`;
const label=(s,fill='#14283b')=>rect(0,142,600,42,fill)+text(300,173,s,32,'#fff','text-anchor="middle"');
const lightPalette={'#182c3c':'#e6d5b8','#e9f0ee':'#393e35','#ffaaa0':'#a73436','#244d52':'#c6d4b6','#f2d898':'#514b26','#f1ead3':'#364c3d','#214851':'#e4ce9f','#d5e6db':'#3b5145','#f5d390':'#94552e','#14283b':'#ddcbb0'};
const svg=(id,body,caption,height=184)=>{
  if(id==='markets')body=body.replace(/#[0-9a-fA-F]{6}/g,c=>lightPalette[c]||c);
  return `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(caption)}" viewBox="0 0 600 ${height}" preserveAspectRatio="xMidYMid meet"><defs><linearGradient id="${id}-air" x2="0" y2="1"><stop stop-color="#c8d9ce"/><stop offset="1" stop-color="#e8dabd"/></linearGradient><linearGradient id="${id}-sea" x2="0" y2="1"><stop stop-color="#bddbd7"/><stop offset="1" stop-color="#75b0b1"/></linearGradient></defs>${body}</svg>`;
};
const stripLabel=s=>rect(0,130,600,34,'#e4d5bb')+text(300,156,s,32,'#343c30','text-anchor="middle"');
const city=(base,color,seed=0)=>Array.from({length:19},(_,i)=>{const x=i*35-12,h=22+(i*47+seed)%79;return rect(x,base-h,27,h,color)+Array.from({length:3},(_,j)=>rect(x+5,base-h+10+j*17,5,5,'#a5bec3','opacity=".6"')).join('');}).join('');
function kyiv(){
  const beams=[0,1,2,3].map(i=>line(`M${300+i*86} 0Q${235+i*80} 25 ${230+i*78} 72`,'#a44937',3.5)).join('');
  const buildings=city(86,'#b0b5a2',19);
  const dome=rect(315,44,48,39,'#b8a56c')+path('M310 44Q339 4 368 44Z','#c6a34d')+line('M339 15V3M334 9H344','#8c793e',1.5);
  const river=rect(0,86,600,40,'#91bab5')+line('M0 101H600','#d7e4ce',2);
  const bridge=path('M0 83Q130 55 260 83Q425 50 600 83V92H0Z','#737e6d','stroke="#45574b" stroke-width="2.5"')+line('M0 86H600','#eadfbd',2)+[45,160,280,415,554].map(x=>rect(x,91,8,22,'#7e8d7b')).join('');
  return svg('kyiv',rect(0,0,600,126,'#e8d8b9')+buildings+dome+beams+river+bridge+circle(232,78,8,'#b95a3f')+circle(232,78,4,'#f9dfa1')+rect(12,8,118,37,'#ad363c')+text(23,36,'KYIV',32,'#fff')+rect(10,48,220,31,'#263e39')+text(18,71,'RUSSIAN ATTACK',22,'#fff4d9')+rect(279,97,309,26,'#ad363c')+text(433,117,'8 DEAD ACROSS UKRAINE',22,'#fff','text-anchor="middle"'),'Russian missile attack on Kyiv; eight deaths reported nationwide',126);
}
function cyclone(){
  const coast=path('M0 0H263L252 40L219 70L226 103L198 132L201 162L169 193L150 228L123 270H0Z','#e8d7ae','stroke="#527c63" stroke-width="3.5"')+path('M0 184L102 158L171 200L123 270H0Z','#a9b967');
  const spiral=[0,60,120,180,240,300].map(a=>`<g transform="translate(371 149) rotate(${a}) scale(1.35)">${line('M-12-8C-11-43 24-65 57-47C27-52 6-26 4-4','#fff6df',9,'stroke-linecap="round"')}</g>`).join('');
  return svg('akvan',rect(0,0,600,326,'#63b6ba')+coast+spiral+circle(371,149,10,'#26787f')+circle(207,119,8,'#ad363c','stroke="#fff6df" stroke-width="4"')+line('M348 149L215 119','#ad363c',5)+path('M222 109L207 118L216 132Z','#ad363c')+text(22,47,'ODISHA',35)+text(22,84,'Gopalpur',26)+text(324,46,'AKVAN',42)+rect(277,218,316,45,'#1b4d55')+text(435,252,'BAY OF BENGAL',34,'#fff4d4','text-anchor="middle"')+rect(0,273,600,53,'#ded7ad')+text(300,309,'LANDFALL · 300K+ EVACUATED',31,'#254e4b','text-anchor="middle"'),'Cyclone Akvan crosses India near Gopalpur',326);
}
function cop(){
  const globe=circle(118,132,85,'#38a7d2','stroke="#124c45" stroke-width="4"')+path('M52 99L93 65L116 82L143 75L161 108L132 125L140 153L108 185L89 145L63 141Z','#dcda74','stroke="#276d53" stroke-width="3"')+line('M33 132H203M118 47C78 95 78 170 118 217M118 47C158 95 158 170 118 217','#d9f4dd',3);
  const paper=rect(246,36,333,213,'#fff0cb','stroke="#174c40" stroke-width="4"')+text(267,91,'COP31',49)+text(266,134,'FOSSIL FUELS',27,'#5a6451')+line('M262 123L550 141','#b82e3b',5)+line('M268 163H553M268 179H433','#b4b69c',3)+rect(332,196,227,43,'#b82e3b')+text(446,229,'NO DEAL',34,'#fff','text-anchor="middle"');
  return svg('cop',rect(0,0,600,326,'#12836c')+globe+paper+text(41,252,'ANTALYA',27,'#fff1c7')+rect(0,273,600,53,'#135346')+text(300,309,'OVERTIME · TALKS CONTINUE',31,'#fff2d0','text-anchor="middle"'),'COP31 continues beyond its scheduled finish without a final deal',326);
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
  const sacks=[35,112,189].map((x,i)=>path(`M${x} 124Q${x-11} 78 ${x+4} 34L${x+48} 32Q${x+67} 80 ${x+56} 124Z`,i%2?'#dfb454':'#f6d77c','stroke="#574b29" stroke-width="3"')+line(`M${x+4} 43L${x+48} 41`,'#7c6634',3)+text(x+28,88,'WFP',20,'#315542','text-anchor="middle"')).join('');
  return svg('hunger',rect(0,0,600,164,'#158264')+rect(0,117,600,13,'#0c654c')+sacks+text(424,70,'91m',69,'#fff0ac','text-anchor="middle"')+text(423,107,'PEOPLE · 2027 PLAN',23,'#fff8da','text-anchor="middle"')+stripLabel('$12.15bn AID SOUGHT'),'WFP launches its 2027 plan to assist 91 million people',164);
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
  const facets=path('M108 38H270L314 96L188 176L64 96Z','#bcefff','stroke="#123c75" stroke-width="4"')+path('M108 38L140 96H64Z','#50c5e7')+path('M140 96L188 176L235 96Z','#f5ffed')+path('M140 96L188 38L235 96Z','#b9f7e5')+path('M235 96L270 38L314 96Z','#309ad1')+line('M64 96H314M188 38L140 96L188 176L235 96Z','#20577c',3);
  return svg('diamond',rect(0,0,600,164,'#287eb4')+`<g transform="translate(7 -12) scale(.78)">${facets}</g>`+text(412,23,'ANGOLA',18,'#fff4d0','text-anchor="middle"')+text(412,91,'10%',60,'#ffe593','text-anchor="middle"')+text(412,124,'PLANNED STAKE',17,'#fff4d0','text-anchor="middle"')+stripLabel('$180m · DE BEERS PLAN'),'Angola’s planned 180 million dollar purchase of 10 percent of De Beers',164);
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
  return svg('mercury',rect(0,0,600,164,'#102344')+`<g transform="translate(0 -3) scale(1 .72)">${stars}</g>`+line('M46 112Q254 145 383 79','#b2d6df',2.4,'stroke-dasharray="5 5"')+`<g transform="translate(134 -3) scale(.72)">${planet}</g><g transform="translate(15 -4) scale(.8)">${craft}</g>`+text(29,28,'BEPICOLOMBO',24,'#fff')+stripLabel('21 NOV · ORBIT PLANNED'),'Friday preview of BepiColombo’s planned Saturday Mercury orbit insertion',164);
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
  let content=rect(0,0,620,338,'#CFE0E8');
  for(const lat of [-60,-30,0,30,60]){const p=xy(0,lat);content+=line(`M22 ${p.y}H594`,'#afc6d0',.8);}
  content+=continents.map(points=>path(points.map(([lon,lat],i)=>{const p=xy(lon,lat);return `${i?'L':'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;}).join('')+'Z','#D6C7B2','stroke="#a79a85" stroke-width="1.5"')).join('');
  for(const s of stories.filter(s=>s.lon!==null)){
    const p=xy(s.lon,s.lat),feature=s.id<=11;
    if(!feature) content+=circle(p.x,p.y,4.5,colors[s.region],'stroke="#fff9ec" stroke-width="1"');
  }
  // Offshore numeric labels use leaders to exact event anchors; the Qatar pin marks the investing country.
  const offsets={1:[-28,-27],2:[-16,18],3:[-26,0],4:[15,15],5:[-48,-39],7:[9,20],8:[-14,25],9:[-15,17],10:[28,-13]};
  for(const s of stories.slice(0,11).filter(s=>s.lon!==null)){
    const p=xy(s.lon,s.lat),o=offsets[s.id]||[0,0],x=p.x+o[0],y=p.y+o[1];
    content+=line(`M${p.x} ${p.y}L${x} ${y}`,'#6f6359',2)+circle(p.x,p.y,3,'#ad303c')+circle(x,y,22,'#ad303c','stroke="#fff9ed" stroke-width="2.5"')+text(x,y+10,String(s.id),30,'#fff','text-anchor="middle"');
  }
  content+=text(28,321,'6 = GLOBAL AID   11 = MERCURY',15,'#334b40');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 620 338" role="img" aria-label="World map keyed to the eleven illustrated features">${content}</svg>`;
}
