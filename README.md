# RIFT CUP

Site vitrine responsive du tournoi League of Legends du BDE ATIDUT.

## Modifier les informations

Tout le contenu variable est regroupé dans `dist/config.js` : description, informations pratiques, date, équipes et rencontres. Des exemples commentés expliquent comment remplir les équipes et les tours. Les modifications nécessitent une nouvelle publication pour apparaître sur le site hébergé. Vous pouvez aussi demander les modifications dans le chat de création du site.

La date est fixée au 24 octobre 2026 à 20 h, heure de Paris. Conserver un fuseau explicite dans la date (le 24 octobre, Paris est à UTC+2). Après l'échéance, le compte à rebours reste à zéro et affiche le début du tournoi.

Les équipes et les tours affichés en l'absence de données sont des emplacements d'attente, pas un format officiel de tournoi. Remplir `rounds` avec le véritable format quand il est connu.

Les styles sont dans `dist/style.css`, la structure dans `dist/index.html`. Aucun outil de compilation n'est nécessaire. Les images fournies sont dans `dist/assets`. Pour un hébergement classique, publier le contenu de `dist`.
