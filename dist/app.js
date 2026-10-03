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
const rounds = isExample ? [
 {name:'Demi-finales', matches:[{id:'M1',a:'Équipe A',b:'Équipe B'},{id:'M2',a:'Équipe C',b:'Équipe D'}]},
 {name:'Finale',matches:[{id:'M3',a:'Vainqueur du match 1',b:'Vainqueur du match 2'}]}
] : config.rounds;
text('#bracket-intro',isExample?'Tirage à venir. Voici un exemple à 4 équipes pour comprendre le parcours ; l’arbre définitif dépendra des inscriptions.':'Un seul match à gagner pour avancer. Retrouvez le parcours et les résultats de chaque équipe.');
let matchNumber=0;
const numbered=rounds.map(round=>({...round,matches:round.matches.map(m=>({...m,number:++matchNumber}))}));

const trophy = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M7 3h10v6a5 5 0 0 1-10 0V3Z M7 5H3v2a5 5 0 0 0 5 5 M17 5h4v2a5 5 0 0 1-5 5 M12 14v5 M8 21h8 M9 19h6"/></svg>';
const board=document.querySelector('#bracket');
board.innerHTML='<div class="bracket-topline"><span>'+ (isExample?'APERÇU DU PARCOURS':'TABLEAU DU TOURNOI')+'</span><span class="bracket-state">'+(isExample?'Tirage à venir':'Résultats & qualifications')+'</span></div><div class="bracket-board"><svg class="bracket-lines" aria-hidden="true"></svg><div class="bracket-lanes">'+numbered.map((round,i)=>{
 const final=i===numbered.length-1;
 const matches=round.matches.map((m,j)=>{
  const next=numbered[i+1]?.matches[Math.floor(j/2)];
  const done=(m.scoreA===1&&m.scoreB===0)||(m.scoreA===0&&m.scoreB===1);
  const row=(name,score,won,slot)=>{
   const initial=/^Équipe [A-Z]$/.test(name)?name.slice(-1):name.startsWith('Vainqueur')?'?':name.slice(0,2).toUpperCase();
   return '<div class="competitor '+(done?(won?'winner':'loser'):'')+'"><span class="team-emblem" aria-hidden="true">'+esc(initial)+'</span><span class="competitor-name">'+esc(name)+(done?'<small>'+(won?'Qualifiée':'Éliminée')+'</small>':'')+'</span><b class="match-score">'+esc(score??'—')+'</b></div>';
  };
  return '<article tabindex="-1" id="match-'+m.number+'" class="match '+(final?'champion':'')+'" '+(next?'data-next="match-'+next.number+'"':'')+'><div class="match-label"><strong><span class="match-index">'+String(m.number).padStart(2,'0')+'</span> '+(final?'FINALE':'MATCH '+m.number)+'</strong><span>'+(done?'TERMINÉ':'À VENIR')+'</span></div>'+row(m.a,m.scoreA,m.scoreA===1,0)+row(m.b||'À déterminer',m.scoreB,m.scoreB===1,1)+'<div class="match-destination">'+(next?'<span>Qualification</span><a href="#match-'+next.number+'">'+esc(m.nextLabel||('Match '+next.number))+'</a>':'<span>Le vainqueur remporte</span><strong>LA RIFT CUP</strong>')+'</div></article>';
 }).join('');
 return '<section class="round '+(final?'final-round':'')+'" aria-label="'+esc(round.name)+'"><h3><span class="round-step">'+String(i+1).padStart(2,'0')+'</span><span>'+esc(round.name)+'<small>'+round.matches.length+' '+(round.matches.length>1?'rencontres':'rencontre')+' · BO1</small></span></h3><div class="matches">'+matches+'</div></section>';
}).join('')+'</div></div><div class="bracket-finish">'+trophy+'<div><span>Au bout du parcours</span><strong>Une équipe. La RIFT CUP.</strong></div></div>'+(isExample?'<p class="example-label">Exemple à 4 équipes. Le tableau définitif sera établi après les inscriptions.</p>':'');
function drawBracket(){
 const plane=board.querySelector('.bracket-board');
 const svg=board.querySelector('.bracket-lines');
 const bounds=plane.getBoundingClientRect();
 svg.setAttribute('viewBox','0 0 '+bounds.width+' '+bounds.height);
 if(window.matchMedia('(max-width: 700px)').matches){svg.innerHTML='';return;}
 svg.innerHTML=Array.from(board.querySelectorAll('[data-next]')).map(match=>{
  const target=document.getElementById(match.dataset.next);
  if(!target)return '';
  const from=match.getBoundingClientRect(),to=target.getBoundingClientRect();
  const x1=from.right-bounds.left,y1=from.top+from.height/2-bounds.top,x2=to.left-bounds.left,y2=to.top+to.height/2-bounds.top,middle=(x1+x2)/2;
  return '<path d="M '+x1+' '+y1+' H '+middle+' V '+y2+' H '+x2+'"/><circle cx="'+x1+'" cy="'+y1+'" r="2.5"/>';
 }).join('');
}
new ResizeObserver(drawBracket).observe(board);
document.fonts.ready.then(drawBracket);
