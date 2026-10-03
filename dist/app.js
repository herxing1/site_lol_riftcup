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
document.querySelector('#bracket').innerHTML=(isExample?'<p class="example-label">EXEMPLE DE PARCOURS · TIRAGE NON EFFECTUÉ</p>':'')+numbered.map((round,i)=>{
 const matches=round.matches.map((m,j)=>{
  const next=numbered[i+1]?.matches[Math.floor(j/2)];
  const destination=m.nextLabel || (next?'Le vainqueur rejoint le match '+next.number:'Le vainqueur remporte la RIFT CUP');
  const done=(m.scoreA===1&&m.scoreB===0)||(m.scoreA===0&&m.scoreB===1);
  const row=(name,score,won)=>'<div class="competitor '+(done?(won?'winner':'loser'):'')+'"><span>'+esc(name)+(done?'<small>'+(won?'Victoire':'Éliminée')+'</small>':'')+'</span><b>'+esc(score??'—')+'</b></div>';
  return '<article class="match '+(i===numbered.length-1?'champion':'')+'"><div class="match-label"><strong>MATCH '+m.number+'</strong><span>'+(done?'TERMINÉ':'1 PARTIE')+'</span></div>'+row(m.a,m.scoreA,m.scoreA===1)+row(m.b||'À déterminer',m.scoreB,m.scoreB===1)+'<p class="match-destination">'+esc(destination)+'</p></article>';
 }).join('');
 return '<div class="round"><h3><span class="round-step">'+(i+1)+'</span>'+esc(round.name)+'</h3><div class="matches">'+matches+'</div></div>';
}).join('')+'<p class="bracket-finish">Vainqueur de la finale <strong>Champion de la RIFT CUP</strong></p>';
