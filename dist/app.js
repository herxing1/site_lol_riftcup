const config = window.RIFT_CONFIG;
const text = (selector, value) => document.querySelector(selector).textContent = value;
text('#description', config.description);
text('#practical', config.practical);
document.title = `${config.name} — ${config.organizer}`;
const target = new Date(config.startsAt);
const dateOptions = { timeZone: 'Europe/Paris' };
const fullDate = new Intl.DateTimeFormat('fr-FR', {...dateOptions, day:'numeric', month:'long',year:'numeric'}).format(target);
const time = new Intl.DateTimeFormat('fr-FR', {...dateOptions, hour:'2-digit',minute:'2-digit'}).format(target);
text('.event-date', `${fullDate} · ${time}`);

text('#closing-date', `${fullDate} · ${time} · Heure de Paris`);
function tick(){
 const remaining = Math.max(0, target.getTime() - Date.now());
 const seconds = Math.floor(remaining/1000);
 ['days','hours','minutes','seconds'].forEach((key,i)=>text(`#${key}`,String([Math.floor(seconds/86400),Math.floor(seconds/3600)%24,Math.floor(seconds/60)%60,seconds%60][i]).padStart(2,'0')));
 document.querySelector('#start-status').hidden=remaining>0;
}
tick(); setInterval(tick,1000);
const esc = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const images=['rift-landscape','ionia-temple','ionia-waterfalls','rift-landscape'];
const champions=['fiora','jayce','leona','senna'];
const teams=config.teams.length?config.teams:Array.from({length:4},()=>({name:'Équipe à annoncer',players:[]}));
text('#team-status',config.teams.length?`${config.teams.length} ÉQUIPES`:'ANNONCE À VENIR');
const posterUrl = value => {
 if(typeof value !== 'string' || !value.trim()) return '';
 try { const url = new URL(value, window.location.href); return ['http:','https:'].includes(url.protocol)?url.href:''; } catch { return ''; }
};
document.querySelector('#teams').innerHTML=teams.map((team,i)=>{
 const poster=posterUrl(team.poster);
 return `<article class="team-card">${poster?`<button class="team-poster" type="button" data-team="${i}" aria-label="Agrandir l’affiche de ${esc(team.name)}"><img src="${esc(poster)}" alt="Affiche de ${esc(team.name)}" loading="lazy"><span>Voir l’affiche</span></button>`:`<div class="team-art"><span class="team-number">${esc(team.tag || String(i+1).padStart(2,'0'))}</span><img src="assets/${images[i%images.length]}.jpg" alt="" loading="lazy"><span class="champion-mini" aria-hidden="true"><img src="assets/${champions[i%champions.length]}.png" alt="" loading="lazy"></span></div>`}<div class="team-body"><h3>${esc(team.name)}</h3><p>${config.teams.length?'LEAGUE OF LEGENDS · 5V5':'Composition à venir'}</p>${team.players?.length?`<details><summary>Voir les joueurs</summary><ul>${team.players.map(p=>`<li>${esc(p)}</li>`).join('')}</ul></details>`:''}</div></article>`;
}).join('');
const posterDialog = document.createElement('dialog');
posterDialog.className='poster-dialog';
posterDialog.setAttribute('aria-labelledby','poster-title');
posterDialog.innerHTML='<div class="poster-dialog-header"><h2 id="poster-title"></h2><button type="button" class="poster-close" autofocus>Fermer ✕</button></div><img class="poster-full" alt="">';
document.body.append(posterDialog);
posterDialog.querySelector('.poster-close').addEventListener('click',()=>posterDialog.close());
posterDialog.addEventListener('click',e=>{if(e.target===posterDialog)posterDialog.close();});
document.querySelectorAll('.team-poster').forEach(button=>{
 button.addEventListener('click',()=>{
  const team=teams[Number(button.dataset.team)];
  posterDialog.querySelector('#poster-title').textContent=team.name;
  const image=posterDialog.querySelector('.poster-full');
  image.src=posterUrl(team.poster); image.alt=`Affiche de ${team.name}`;
  posterDialog.showModal();
 });
 button.querySelector('img').addEventListener('error',()=>{
  button.disabled=true;
  button.querySelector('img').hidden=true;
  button.querySelector('span').textContent='Affiche indisponible';
 });
});

document.querySelectorAll('.registration-link').forEach(link=>{ if(config.registrationUrl) link.href=config.registrationUrl; });
const isExample = !config.rounds.length;
// Simulation indépendante des équipes réellement inscrites : 20 entrants, 19 matchs.
const team=(side,n)=>'Équipe '+side+String(n).padStart(2,'0');
const win=n=>'Vainqueur M'+n;
const demoRounds=[
 {name:'Barrages',matches:[
  {id:'M1',a:team('A',7),b:team('A',8),nextId:'M7'},
  {id:'M2',a:team('A',9),b:team('A',10),nextId:'M8'},
  {id:'M3',a:team('B',7),b:team('B',8),nextId:'M11'},
  {id:'M4',a:team('B',9),b:team('B',10),nextId:'M12'}]},
 {name:'Huitièmes',matches:['A','B'].flatMap((side,k)=>[
  {id:'M'+(5+k*4),a:team(side,1),b:team(side,2)},
  {id:'M'+(6+k*4),a:team(side,3),b:team(side,4)},
  {id:'M'+(7+k*4),a:team(side,5),b:win(1+k*2)},
  {id:'M'+(8+k*4),a:team(side,6),b:win(2+k*2)}])},
 {name:'Quarts',matches:Array.from({length:4},(_,i)=>({id:'M'+(13+i),a:win(5+i*2),b:win(6+i*2)}))},
 {name:'Demi-finales',matches:[{id:'M17',a:win(13),b:win(14)},{id:'M18',a:win(15),b:win(16)}]},
 {name:'Finale',matches:[{id:'M19',a:win(17),b:win(18)}]}
];
const rounds=isExample?demoRounds:config.rounds;
text('#bracket-intro',isExample?'Simulation à 20 équipes : 10 de chaque côté, une finale au centre. Les noms et les rencontres ci-dessous servent uniquement à tester le tableau.':'Un seul match à gagner pour avancer. Retrouvez le parcours et les résultats de chaque équipe.');
let matchNumber=0;
const numbered=rounds.map(round=>({...round,matches:round.matches.map(m=>({...m,number:++matchNumber}))}));


const board=document.querySelector('#bracket');
const terminal=numbered.length-1;
function arenaMatch(m,roundIndex,index,side){
 const final=roundIndex===terminal;
 const next=m.nextId?numbered.flatMap(r=>r.matches).find(n=>n.id===m.nextId):numbered[roundIndex+1]?.matches[Math.floor(index/2)];
 const done=(m.scoreA===1&&m.scoreB===0)||(m.scoreA===0&&m.scoreB===1);
 const participant=(name,score)=>'<div class="arena-team '+(done?(score===1?'won':'lost'):'')+'"><span>'+esc(name||'À déterminer')+'</span><b>'+esc(score??'—')+'</b></div>';
 if(final){
  const winner=done?(m.scoreA===1?m.a:m.b):'';
  return '<article id="match-'+m.number+'" tabindex="-1" class="arena-final arena-match"><p class="arena-kicker">MATCH '+String(m.number).padStart(2,'0')+' / '+(done?'TERMINÉ':'BO1')+'</p><h3>La finale</h3><div class="final-duel">'+participant(m.a,m.scoreA)+'<span class="duel-vs" aria-hidden="true">VS</span>'+participant(m.b,m.scoreB)+'</div><p class="final-reward">'+(winner?'<span>CHAMPION</span><strong>'+esc(winner)+'</strong>':'<span>UNE VICTOIRE POUR</span><strong>LA RIFT CUP</strong>')+'</p></article>';
 }
 return '<article id="match-'+m.number+'" tabindex="-1" class="arena-match arena-qualifier" data-next="'+(next?'match-'+next.number:'')+'" data-side="'+side+'"><header><span>Match '+String(m.number).padStart(2,'0')+'</span><small>'+(done?'TERMINÉ':'BO1 · À VENIR')+'</small></header><div class="arena-pair">'+participant(m.a,m.scoreA)+participant(m.b,m.scoreB)+'</div>'+(next?'<a class="arena-route" href="#match-'+next.number+'">'+esc(m.nextLabel||(roundIndex+1===terminal?'Accès à la finale':'Vainqueur au match '+next.number))+'</a>':'')+'</article>';
}
function lane(round,index,side){
 const split=Math.ceil(round.matches.length/2);
 const subset=side==='left'?round.matches.slice(0,split):round.matches.slice(split);
 if(!subset.length)return '';
 const markup=subset.map((m,j)=>arenaMatch(m,index,side==='left'?j:j+split,side)).join('');
 return '<section class="arena-lane '+side+'" style="--mobile-order:'+(index*2+(side==='left'?0:1))+'"><h3>'+esc(round.name)+'<small>CÔTÉ '+(side==='left'?'A':'B')+'</small></h3><div class="arena-lane-matches">'+markup+'</div></section>';
}
const before=numbered.slice(0,-1);
board.innerHTML='<div class="arena-status"><span>'+ (isExample?'SIMULATION / 20 ÉQUIPES':'LE TABLEAU')+'</span><span>ÉLIMINATION DIRECTE / BO1</span></div><div class="arena-navigation" aria-label="Navigation dans le tableau"><button type="button" data-view="left">← Côté A</button><button type="button" data-view="center">La finale</button><button type="button" data-view="right">Côté B →</button><span>Faites défiler pour suivre le parcours</span></div><div class="arena-scroll" tabindex="0" role="region" aria-label="Arbre des affrontements, défilement horizontal"><div class="arena-stage" style="--lane-count:'+Math.max(1,numbered.length*2-1)+'"><svg class="arena-wires" aria-hidden="true"></svg>'+before.map((r,i)=>lane(r,i,'left')).join('')+'<section class="arena-center" style="--mobile-order:'+(terminal*2)+'">'+numbered[terminal].matches.map((m,j)=>arenaMatch(m,terminal,j,'center')).join('')+'</section>'+before.map((r,i)=>({r,i})).reverse().map(({r,i})=>lane(r,i,'right')).join('')+'</div></div>'+(isExample?'<p class="arena-note">20 équipes · 19 matchs · 1 champion. Quatre barrages ramènent le tableau à 16 équipes ; les 12 autres entrent directement en huitièmes. Placement fictif, tirage officiel à venir.</p>':'');
function drawBracket(){
 const stage=board.querySelector('.arena-stage'),svg=board.querySelector('.arena-wires');
 const box=stage.getBoundingClientRect();svg.setAttribute('viewBox','0 0 '+box.width+' '+box.height);
 if(window.matchMedia('(max-width: 760px)').matches){svg.innerHTML='';return;}
 svg.innerHTML=Array.from(board.querySelectorAll('[data-next]')).map(m=>{
  const target=document.getElementById(m.dataset.next);if(!target)return '';
  const f=m.querySelector('.arena-pair').getBoundingClientRect(),t=target.getBoundingClientRect(),right=m.dataset.side==='right';
  const x1=(right?f.left:f.right)-box.left,x2=(right?t.right:t.left)-box.left,y1=f.top+f.height/2-box.top,y2=t.top+t.height/2-box.top,middle=(x1+x2)/2;
  return '<path class="'+m.dataset.side+'" d="M '+x1+' '+y1+' H '+middle+' V '+y2+' H '+x2+'"/>';
 }).join('');
}
new ResizeObserver(drawBracket).observe(board);
document.fonts.ready.then(drawBracket);

board.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{
 const side=button.dataset.view;
 const target=side==='center'?board.querySelector('.arena-center'):Array.from(board.querySelectorAll('.arena-lane.'+side))[side==='right'?before.length-1:0];
 if(target)target.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'nearest',inline:'center'});
}));
