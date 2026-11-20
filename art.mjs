// Original illustrations: geographic context, concrete objects and large labels.
const rect=(x,y,w,h,fill,more='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${more}/>`;
const path=(d,fill,more='')=>`<path d="${d}" fill="${fill}" ${more}/>`;
const circle=(x,y,r,fill,more='')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${more}/>`;
const line=(d,color='#c7d3db',width=2,more='')=>path(d,'none',`stroke="${color}" stroke-width="${width}" ${more}`);
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const text=(x,y,s,size=26,color='#fff',more='')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${color}" font-family="Arial,sans-serif" font-weight="700" ${more}>${esc(s)}</text>`;
const label=(s,fill='#14283b')=>rect(0,190,600,50,fill)+text(300,225,s,29,'#fff','text-anchor="middle"');
const svg=(id,body,caption)=>`<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(caption)}" viewBox="0 0 600 240" preserveAspectRatio="xMidYMid meet"><defs><linearGradient id="${id}-air" x2="0" y2="1"><stop stop-color="#749bb2"/><stop offset="1" stop-color="#d9d6c3"/></linearGradient><linearGradient id="${id}-sea" x2="0" y2="1"><stop stop-color="#49899c"/><stop offset="1" stop-color="#1a4d69"/></linearGradient></defs>${body}</svg>`;
const city=(base,color,seed=0)=>Array.from({length:19},(_,i)=>{const x=i*35-12,h=22+(i*47+seed)%79;return rect(x,base-h,27,h,color)+Array.from({length:3},(_,j)=>rect(x+5,base-h+10+j*17,5,5,'#a5bec3','opacity=".6"')).join('');}).join('');
function kyiv(){
  const beams=Array.from({length:6},(_,i)=>line(`M${125+i*79} 0Q${60+i*78} 58 ${65+i*76} 146`,'#eda465',2.2)).join('');
  const bridge=path('M0 150Q130 97 262 150Q399 93 600 147V163H0Z','#44576b')+line('M0 155H600','#c1c9c5',3)+[48,157,280,410,543].map(x=>rect(x,158,10,31,'#435c70')).join('');
  const dome=rect(252,82,65,57,'#c6b786')+path('M247 82Q285 30 322 82Z','#c4a951')+line('M284 38V20M278 26H290','#e5ce89',2);
  return svg('kyiv',rect(0,0,600,240,'#15283e')+city(152,'#273c53',19)+beams+dome+rect(0,162,600,28,'#2d667a')+bridge+circle(147,145,15,'#f2b763')+circle(147,145,7,'#fff4be')+text(22,39,'KYIV',31)+text(22,67,'RUSSIAN ATTACK',19,'#f2c890')+label('8 DEAD ACROSS UKRAINE'),'Russian missile attack on Kyiv; eight deaths reported nationwide');
}
function cyclone(){
  const coast=path('M0 0H245L237 27L218 42L218 62L192 84L193 108L165 136L163 160L144 190H0Z','#cfcca9')+path('M0 150L127 111L170 141L144 190H0Z','#96b39b');
  const spiral=[0,60,120,180,240,300].map(a=>`<g transform="translate(333 94) rotate(${a})">${line('M-12-8C-11-43 24-65 57-47C27-52 6-26 4-4','#edf5ee',7,'stroke-linecap="round"')}</g>`).join('');
  const rain=Array.from({length:17},(_,i)=>line(`M${280+(i*37)%285} ${18+(i*43)%153}l-8 17`,'#9ec8d3',1.1)).join('');
  return svg('akvan',rect(0,0,600,240,'url(#akvan-sea)')+rain+coast+spiral+circle(333,94,8,'#34758b')+circle(202,86,6,'#b82d43','stroke="#fff" stroke-width="2"')+line('M320 94L211 86','#f8c45f',3)+path('M215 79L204 85L215 93Z','#f8c45f')+text(24,35,'ODISHA',24,'#203e4a')+text(24,67,'Gopalpur',22,'#203e4a')+text(443,41,'AKVAN',27)+text(414,173,'BAY OF BENGAL',17,'#d4e6e8')+label('LANDFALL · 300,000+ EVACUATED'),'Cyclone Akvan crosses India near Gopalpur');
}
function cop(){
  const globe=circle(108,93,68,'#4598a0')+path('M56 62L89 40L107 53L127 48L142 74L119 87L125 109L101 135L87 103L66 99Z','#9ebf7c')+line('M40 93H176M108 25C76 63 76 123 108 161M108 25C140 63 140 123 108 161','#c1ded7',1.3);
  const paper=rect(222,24,343,145,'#f3f2e5')+text(243,58,'COP31',34,'#203b45')+text(243,93,'FOSSIL FUELS',26,'#526265')+line('M241 82L530 97','#b82d43',4)+line('M244 114H527M244 128H479','#afb7a6',3)+rect(377,133,166,32,'#b82d43')+text(460,157,'NO DEAL',25,'#fff','text-anchor="middle"');
  return svg('cop',rect(0,0,600,240,'#1c494b')+globe+paper+text(37,180,'ANTALYA',18,'#d0dfca')+label('OVERTIME · TALKS CONTINUE'),'COP31 continues beyond its scheduled finish without a final deal');
}
function markets(){
  let board=rect(0,0,600,240,'#182c3c');
  for(let y=45;y<173;y+=35)board+=line(`M22 ${y}H576`,'#38505d',1);
  board+=line('M28 49L79 63L125 54L168 91L210 88L247 126L291 112L335 146L381 139L438 169','#ef7c79',6);
  board+=path('M426 158L451 174L440 145Z','#ef7c79');
  board+=text(467,56,'TAIEX',20,'#cad9df')+text(465,94,'−6.2%',31,'#f79891')+text(465,130,'20 NOV',18,'#cad9df');
  return svg('markets',board+label('AI SHARES SELL OFF'),'Friday Asian stock markets fall, Taiex down 6.2 percent');
}
function reset(){
  let flags=rect(0,0,300,190,'#285088')+rect(300,0,300,190,'#163c6c');
  for(let i=0;i<12;i++){const a=i*Math.PI/6;flags+=circle(148+56*Math.cos(a),89+56*Math.sin(a),5,'#f1cf66');}
  flags+=line('M300 0L600 190M600 0L300 190','#fff2df',24)+line('M300 0L600 190M600 0L300 190','#b5424e',9)+rect(424,0,49,190,'#fff2df')+rect(300,70,300,44,'#fff2df')+rect(437,0,23,190,'#b5424e')+rect(300,82,300,20,'#b5424e');
  const document=path('M195 45H355L396 88V179H195Z','#f2eddc','stroke="#203b4f" stroke-width="2"')+path('M355 45V88H396Z','#c6d4d2')+line('M215 109H374M215 126H359M215 143H340','#6e8f94',3)+text(215,83,'AGREED',24,'#28554f');
  return svg('reset',flags+document+label('FOOD · YOUTH · CARBON'),'UK and EU agree a reset package on food, youth mobility and carbon markets');
}
function hunger(){
  const sacks=[50,141,232,323].map((x,i)=>path(`M${x} 164Q${x-16} 104 ${x+5} 54L${x+60} 51Q${x+83} 108 ${x+69} 164Z`,i%2?'#c9b57e':'#dfcf99','stroke="#8b825e" stroke-width="2"')+line(`M${x+5} 65L${x+60} 63`,'#7c7958',2)+text(x+34,123,'WFP',21,'#49655f','text-anchor="middle"')).join('');
  const ear=line('M480 160V49','#eac56c',3)+[0,1,2,3,4].map(i=>path(`M480 ${70+i*16}Q452 ${68+i*16} 462 ${52+i*16}Q479 ${52+i*16} 480 ${70+i*16}M480 ${78+i*16}Q507 ${72+i*16} 500 ${58+i*16}Q482 ${60+i*16} 480 ${78+i*16}`,'#eac56c')).join('');
  return svg('hunger',rect(0,0,600,240,'#244d52')+rect(0,160,600,30,'#67877c')+sacks+ear+label('91 MILLION · 2027 AID TARGET'),'WFP launches its 2027 plan to assist 91 million people');
}
function cricket(){
  const stands=[0,1,2,3,4,5].map(i=>line(`M0 ${44+i*11}Q300 ${-31+i*11} 600 ${44+i*11}`,'#879e9d',4)).join('');
  const player=circle(274,51,13,'#c09b76')+path('M261 45Q272 27 289 43V49Z','#172d39')+path('M253 70L282 67L303 111L271 125L244 99Z','#f7f3df')+path('M271 121L292 115L315 160H299L275 135L260 169H243Z','#f0eedb')+path('M278 75L306 90L330 70L338 77L310 105L285 91Z','#c09b76')+path('M329 64L340 57L364 104L354 112Z','#d6b77c');
  return svg('cricket',rect(0,0,600,240,'#b9d4d6')+stands+path('M0 105Q300 61 600 105V190H0Z','#548c70')+path('M213 190L248 112H321L359 190Z','#cfbf96')+player+rect(399,32,173,125,'#163e38')+text(485,67,'PHILLIPS',23,'#dfe5c9','text-anchor="middle"')+text(485,124,'118',57,'#fff3ca','text-anchor="middle"')+label('NEW ZEALAND 368 · DAY 2'),'Glenn Phillips scores 118 in New Zealand’s first innings against India');
}
function qatar(){
  const towers=city(175,'#557c85',31)+path('M70 174L88 52L116 23L137 174Z','#b0c3ba')+line('M90 59L120 165','#e1dec5',2);
  const qflag=rect(345,26,106,68,'#f4eddf')+path('M372 26H451V94H372L383 87L372 80L383 73L372 66L383 59L372 52L383 45L372 38L383 31Z','#8c3045');
  const germany=rect(466,26,108,68,'#d5a950')+rect(466,26,108,23,'#1d2931')+rect(466,49,108,23,'#a94247');
  return svg('qatar',rect(0,0,600,240,'url(#qatar-air)')+towers+qflag+germany+rect(306,111,267,57,'#f2ecdc')+text(438,152,'€15bn PLEDGED',31,'#234e58','text-anchor="middle"')+label('DOHA + BERLIN · STRATEGIC TIES'),'Qatar pledges 15 billion euros of investment in Germany');
}
function diamonds(){
  const facets=path('M108 38H270L314 96L188 176L64 96Z','#bddde0','stroke="#eff5e9" stroke-width="2"')+path('M108 38L140 96H64Z','#8cc2cb')+path('M140 96L188 176L235 96Z','#e7f2e8')+path('M140 96L188 38L235 96Z','#d7eddf')+path('M235 96L270 38L314 96Z','#729fab')+line('M64 96H314M188 38L140 96L188 176L235 96Z','#567f8e',2);
  return svg('diamond',rect(0,0,600,240,'#214851')+facets+text(347,43,'ANGOLA',23,'#d5e6db')+text(347,117,'10%',56,'#f5d390')+text(347,151,'PLANNED STAKE',20,'#d5e6db')+label('$180m · DE BEERS'),'Angola’s planned 180 million dollar purchase of 10 percent of De Beers');
}
function inflation(){
  const skyline=city(175,'#7c939d',7)+path('M75 175L94 50L114 175Z','#b34a4c')+line('M95 24V175M72 151H119M81 106H110','#e9dbbd',2);
  const board=rect(275,24,299,143,'#f3efdf')+text(294,59,'CORE CPI',23,'#38535e')+text(422,124,'2.2%',66,'#9d3649','text-anchor="middle"')+text(422,153,'OCTOBER · YEAR ON YEAR',16,'#38535e','text-anchor="middle"');
  return svg('cpi',rect(0,0,600,240,'url(#cpi-air)')+skyline+circle(218,50,32,'#c25858','opacity=".7"')+board+label('JAPAN · DATA RELEASED TODAY'),'Japan releases October core CPI at 2.2 percent year on year');
}
function mercury(){
  const stars=Array.from({length:31},(_,i)=>circle((i*73+19)%600,(i*47+13)%185,i%3===0?1.7:1,'#b2c2cf')).join('');
  const planet=circle(465,92,80,'#b9b5a4')+path('M465 12A80 80 0 0 1 465 172Q514 101 465 12Z','#898f87')+[[437,51,17],[476,111,21],[424,120,12],[488,54,10],[455,90,8]].map(([x,y,r])=>circle(x,y,r,'#8c958f','opacity=".65"')+circle(x-2,y-2,r*.7,'#afb2a1','opacity=".6"')).join('');
  const craft=`<g transform="translate(202 91) rotate(-12)">${rect(-120,-16,78,34,'#3f83ac','stroke="#9ec0ce" stroke-width="2"')}${rect(43,-16,78,34,'#3f83ac','stroke="#9ec0ce" stroke-width="2"')}${[-101,-82,-63,62,81,100].map(x=>line(`M${x} -15V18`,'#abd2dc',1)).join('')}${rect(-34,-30,67,61,'#d9bd75')}${path('M-34-30L-10-43L48-36L33-30Z','#eee0ac')}${circle(0,0,15,'#dce2da')}${circle(0,0,8,'#536c78')}${line('M0 31V54L31 65','#b8c5c8',2)}</g>`;
  return svg('mercury',rect(0,0,600,240,'#172c43')+stars+line('M46 165Q254 197 383 113','#879ba6',1.3,'stroke-dasharray="5 5"')+planet+craft+text(29,34,'BEPICOLOMBO',26)+label('21 NOV · ORBIT INSERTION PLANNED'),'Friday preview of BepiColombo’s planned Saturday Mercury orbit insertion');
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
  content+=continents.map(points=>path(points.map(([lon,lat],i)=>{const p=xy(lon,lat);return `${i?'L':'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;}).join('')+'Z','#c8c8a7','stroke="#edf0d5" stroke-width=".8"')).join('');
  for(const s of stories.filter(s=>s.lon!==null)){
    const p=xy(s.lon,s.lat),feature=s.id<=11;
    if(!feature) content+=circle(p.x,p.y,3,colors[s.region],'stroke="#f7f4de" stroke-width=".5"');
  }
  // Offshore numeric labels use leaders to exact event anchors; the Qatar pin marks the investing country.
  const offsets={1:[-28,-24],2:[-21,18],3:[-26,0],4:[15,15],5:[-48,-39],7:[9,20],8:[-14,25],9:[-15,17],10:[28,-13]};
  for(const s of stories.slice(0,11).filter(s=>s.lon!==null)){
    const p=xy(s.lon,s.lat),o=offsets[s.id]||[0,0],x=p.x+o[0],y=p.y+o[1];
    content+=line(`M${p.x} ${p.y}L${x} ${y}`,'#e7e5d6',1)+circle(p.x,p.y,2.5,'#fff')+circle(x,y,10,colors[s.region],'stroke="#fff" stroke-width="1.7"')+text(x,y+4,String(s.id),13,'#fff','text-anchor="middle"');
  }
  content+=text(28,321,'6 = GLOBAL AID   11 = MERCURY',15,'#d9e2df');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 620 338" role="img" aria-label="World map keyed to the eleven illustrated features">${content}</svg>`;
}
