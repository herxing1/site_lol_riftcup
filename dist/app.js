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
text('.nav-date', `${new Intl.DateTimeFormat('fr-FR', {...dateOptions, day:'numeric',month:'short'}).format(target)} · ${time}`);
text('#closing-date', `${fullDate} · ${time} · Heure de Paris`);
function tick(){
 const remaining = Math.max(0, target.getTime() - Date.now());
 const seconds = Math.floor(remaining/1000);
 ['days','hours','minutes','seconds'].forEach((key,i)=>text(`#${key}`,String([Math.floor(seconds/86400),Math.floor(seconds/3600)%24,Math.floor(seconds/60)%60,seconds%60][i]).padStart(2,'0')));
 document.querySelector('#start-status').hidden=remaining>0;
}
tick(); setInterval(tick,1000);
const esc = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const images=['fiora','jayce','leona','senna'];
const teams=config.teams.length?config.teams:Array.from({length:4},()=>({name:'Équipe à annoncer',players:[]}));
text('#team-status',config.teams.length?`${config.teams.length} ÉQUIPES`:'ANNONCE À VENIR');
document.querySelector('#teams').innerHTML=teams.map((team,i)=>`<article class="team-card"><div class="team-art"><span class="team-number">${esc(team.tag || String(i+1).padStart(2,'0'))}</span><img src="assets/${images[i%images.length]}.png" alt="" loading="lazy"></div><div class="team-body"><h3>${esc(team.name)}</h3><p>${config.teams.length?'LEAGUE OF LEGENDS · 5V5':'Composition à venir'}</p>${team.players?.length?`<details><summary>Voir les joueurs</summary><ul>${team.players.map(p=>`<li>${esc(p)}</li>`).join('')}</ul></details>`:''}</div></article>`).join('');
const rounds=config.rounds.length?config.rounds:[{name:'Rencontres à annoncer',matches:[{a:'Équipe à annoncer',b:'Équipe à annoncer'},{a:'Équipe à annoncer',b:'Équipe à annoncer'}]},{name:'Tour suivant',matches:[{a:'À déterminer',b:'À déterminer'}]},{name:'Victoire',matches:[{a:'Champion à venir'}]}];
if(config.rounds.length) text('#bracket-intro','Retrouvez les rencontres et les résultats de la RIFT CUP.');
document.querySelector('#bracket').innerHTML=rounds.map((round,i)=>`<div class="round"><h3>${esc(round.name)}</h3><div class="matches">${round.matches.map((m,j)=>`<article class="match ${i===rounds.length-1?'champion':''}"><div class="match-label">${config.rounds.length?`RENCONTRE ${j+1}`:'À VENIR'}</div><div class="competitor"><span>${esc(m.a)}</span><b>${esc(m.scoreA??'—')}</b></div>${m.b?`<div class="competitor"><span>${esc(m.b)}</span><b>${esc(m.scoreB??'—')}</b></div>`:''}</article>`).join('')}</div></div>`).join('');
