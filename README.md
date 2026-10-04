# RIFT CUP

Site vitrine responsive du tournoi League of Legends du BDE ATIDUT.

## Ajouter les affiches des équipes

1. Copiez chaque affiche (JPG, PNG ou WebP) dans `dist/assets/equipes/`.
2. Dans `dist/config.js`, ajoutez une équipe avec le champ `poster`, par exemple :

```js
teams: [
  {
    name: 'Les Poro',
    tag: 'POR',
    poster: 'assets/equipes/les-poro.jpg',
    players: ['Joueur 1', 'Joueur 2', 'Joueur 3', 'Joueur 4', 'Joueur 5']
  }
],
```

Une adresse HTTPS directe vers une image fonctionne aussi. L'affiche est affichée en entier, sans recadrage, et peut être agrandie en cliquant dessus. Fermez-la avec le bouton Fermer ou la touche Échap. Si `poster` est vide ou absent, le paysage est conservé. Si l'image ne charge pas, la carte indique « Affiche indisponible ».

Republiez le site après modification. Il n'y a pas d'import d'image depuis la page publique : vous pouvez transmettre les affiches dans le chat pour les faire intégrer et publier.

## Modifier les informations

Tout le contenu variable est regroupé dans `dist/config.js` : description, informations pratiques, date, équipes et rencontres. Des exemples commentés expliquent comment remplir les équipes et les tours. Les modifications nécessitent une nouvelle publication pour apparaître sur le site hébergé. Vous pouvez aussi demander les modifications dans le chat de création du site.

La date est fixée au 24 octobre 2026 à 20 h, heure de Paris. Conserver un fuseau explicite dans la date (le 24 octobre, Paris est à UTC+2). Après l'échéance, le compte à rebours reste à zéro et affiche le début du tournoi.

Les équipes et les tours affichés en l'absence de données sont des emplacements d'attente, pas un format officiel de tournoi. Remplir `rounds` avec le véritable format quand il est connu.

Les styles sont dans `dist/style.css`, la structure dans `dist/index.html`. Aucun outil de compilation n'est nécessaire. Les images fournies sont dans `dist/assets`. Pour un hébergement classique, publier le contenu de `dist`.

### Simulation du grand arbre
Quand `rounds` est vide, le site affiche une simulation de 20 équipes (10 par côté), avec 4 barrages puis huitièmes, quarts, demi-finales et finale. Ce ne sont pas des inscriptions réelles. Renseigner `rounds` remplace la simulation. Pour les tours avec exemptions, utiliser un `id` par match et `nextId` pour indiquer le match suivant.
