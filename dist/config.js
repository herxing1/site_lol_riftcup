// Toutes les informations du tournoi se modifient ici.
// Date avec fuseau explicite : le 24 octobre 2026 à 20 h à Paris (UTC+2).
window.RIFT_CONFIG = {
  name: 'RIFT CUP', organizer: 'BDE ATIDUT',
  startsAt: '2026-10-24T20:00:00+02:00',
  description: 'Le BDE ATIDUT vous donne rendez-vous pour la RIFT CUP : un tournoi League of Legends en 5v5. Cinq joueurs, un Nexus à défendre et une victoire à aller chercher. Retrouvez ici les équipes et toutes les rencontres du tournoi.',
  practical: 'Inscrivez votre équipe via le formulaire. Le lieu et les autres informations pratiques seront annoncés prochainement.',
  registrationUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSduJUFoFO_ggA7YLDADNrkm7wXz1CW1e1MmuDyvBOxJ8ThWAQ/viewform?usp=header',
  teams: [{
    name: 'longduzob',
    players: ['Xeyio#EUW', 'BARON ZEPPELI#GRRR', 'Un0Toxic#1617', 'Agent Mossad#677', 'BoZ00#1234']
  }, {
    name: 'Les Glaciers',
    players: ['T1 Twisten#PERPI', 'BrancheTaZine#BTZ', 'Magic Monkey#NARA', 'Make You Scream#BABY', 'WinnieLourson#WWEAE']
  }],
  // Exemple d’équipe : { name: 'Les Poro', tag: 'POR', poster: 'assets/equipes/les-poro.jpg', players: ['Top', 'Jungle', 'Mid', 'ADC', 'Support'] }
  // Affiche facultative : mettre l’image dans assets/equipes/, puis son chemin dans poster.
  // Une URL https:// vers une image est également acceptée. Sans poster, le paysage reste affiché.
  // Ajoutez les tours et les matchs quand le format du tournoi est confirmé.
  // Exemple : { name: 'Demi-finales', matches: [{ a: 'Les Poro', b: 'Les Drakes', scoreA: 1, scoreB: 0 }] }
  rounds: [],
};
