# SR10 Projet – Plateforme de gestion de candidatures

## Présentation

Ce projet est une application web permettant la gestion des candidatures, des offres d'emploi, des utilisateurs (candidats, recruteurs, administrateurs) et des organisations. Elle a été réalisée dans le cadre du module SR10.

## Fonctionnalités principales

- **Authentification et gestion des sessions** :
  - Connexion et création de compte pour les différents types d'utilisateurs.
  - Gestion des sessions utilisateurs.

- **Gestion des utilisateurs** :
  - Création, visualisation et gestion des comptes utilisateurs (candidats, recruteurs, administrateurs).
  - Visualisation de la liste des utilisateurs.

- **Gestion des offres d'emploi** :
  - Création, modification, suppression et visualisation des offres.
  - Consultation des offres par les candidats.

- **Gestion des candidatures** :
  - Postulation à une offre par un candidat.
  - Visualisation et gestion des candidatures par les recruteurs.
  - Acceptation ou refus des candidatures.

- **Gestion des organisations** :
  - Création et gestion des organisations (entreprises, écoles, etc.).
  
- **Gestion des pièces jointes** :
  - Ajout et gestion de documents lors de la candidature (CV, lettre de motivation, etc.).

- **Espace personnel** :
  - Espace dédié pour chaque utilisateur selon son rôle (candidat, recruteur, administrateur).

- **Interface utilisateur** :
  - Utilisation de EJS pour le rendu des vues côté serveur.
  - Maquettes et prototypes disponibles dans le dossier `Livrable2`.

## Structure du projet

- `myapp/` : Contient l'application principale (routes, modèles, contrôleurs, vues, etc.)
- `Livrable_1/` et `Livrable2/` : Documents de conception, diagrammes, maquettes.
- `src/` : Fichiers statiques et ressources supplémentaires.

## Lancer le projet

1. Installer les dépendances :
   ```bash
   cd myapp
   npm install
   ```
2. Démarrer le serveur :
   ```bash
   npm start
   ```
3. Accéder à l'application via `http://localhost:3000` (ou le port configuré).

## Tests

Des tests unitaires sont disponibles dans le dossier `myapp/test/`.

## Auteurs

- Projet réalisé par Jean Vives et Lewis Botokeky – SR10

---
N'hésitez pas à consulter les dossiers `Livrable_1` et `Livrable2` pour plus d'informations sur la conception et les maquettes.
