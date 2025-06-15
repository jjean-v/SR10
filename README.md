# SR10 Projet – Plateforme de gestion de candidatures

## Présentation

Ce projet est une application web permettant la gestion des candidatures, des offres d'emploi, des utilisateurs (candidats, recruteurs, administrateurs) et des organisations. Elle a été réalisée dans le cadre du module SR10.

## Fonctionnalités principales

- **Fonctionnalitées communes à tous les utilisateurs**

  - Espace dédié pour chaque utilisateur selon son rôle (candidat, recruteur, administrateur).
  - Connexion et création de compte pour les différents types d'utilisateurs.
  - Visualiser son espace personnelle
  - Deconnexion
  


- **Fonctionnalités pour les candidats**

  - Consulter la liste des offres publiées
  - Rechercher des offres par mots-clés
  - Visualiser les détails d’une offre
  - Postuler à une offre
  - Joindre un CV ou une lettre de motivation à une candidature
  - Suivre la liste et l’avancement de ses candidatures
  - En cas d’acceptation, accepter ou refuser l’offre
  - Devenir recruteur
  - Créer une Organisation (lorsqu'il devient recruteur)

- **Fonctionnalités pour les recruteurs**

  - Lister les offres de leur entreprise
  - Rechercher parmi les offres
  - Visualiser les détails d’une offre
  - Lister les différentes fiches de poste
  - Rechercher parmi les fiches de poste
  - Visualiser les fiches de poste en détail
  - Modifier ou supprimer une offre
  - Modifier ou supprimer une fiche de poste
  - Créer une nouvelle offre
  - Créer une nouvelle fiche de poste
  - Consulter les candidatures reçues pour leurs offres
  - Accepter ou refuser des candidatures
  

- **Fonctionnalitées pour les administrateurs** :
  - Création, modification, suppression et visualisation des offres.
  - Consultation des offres par les candidats.


- **Gestion des organisations** :
  - Création et gestion des organisations (entreprises, écoles, etc.).
  

## Structure du projet

- `myapp/` : Contient l'application principale (routes, modèles, contrôleurs, vues, etc.)
- `Livrable_1/` et `Livrable2/` : Documents de conception, diagrammes, maquettes.
- `src/` : Fichiers statiques et ressources supplémentaires.

## Lancer le projet

1. Installer les dépendances :
   ```bash
   cd myapp
   npm install
   npm install express-session
   npm install multer
   ```
2. Démarrer le serveur :
   ```bash
   npm start
   ```
3. Accéder à l'application via `http://localhost:3000`

## Tests

Des tests unitaires sont disponibles dans le dossier `myapp/test/`.

## Auteurs

- Projet réalisé par Jean Vives et Lewis Botokeky – SR10

---
N'hésitez pas à consulter les dossiers `Livrable_1` et `Livrable2` pour plus d'informations sur la conception et les maquettes.
