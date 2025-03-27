# 🍽️ Recipient - Gestionnaire de Recettes Personnel

## 📋 TODO List
- [ ] Héberger l'application en ligne (Vercel/Netlify)
- [ ] Développer une version mobile native (React Native)
- [ ] Ajouter des fonctionnalités de partage de recettes
- [ ] Implémenter un système de catégorisation des recettes
- [ ] Créer une fonctionnalité de génération de liste de courses
- [ ] Ajouter des traductions (internationalisation)
- [ ] Ajouter une fonctionnalité de recherche par ingrédient
- [ ] Ajouter la posibilité de supprimer et modifier les recettes
- [ ] Ajouter le calcul du prix des recette et avec ca calculer le prix des jours/semaine/mois 
- [ ] Ajouter a meal planning la pillule repas qui permet de faire un repas avec plusieurs plats
- [ ] faire en sorte que les jours sauvegardé soit save dans une database composé de lien avec la database de recette idem pour les semaines et mois 
- [ ] faire une base de donés d'ingrédients et link les recette a cette base de doné (change le formulaire de création de recette avec des barre de recherche pour les ingredients de la database et les ajouter a la recette)
- [ ] reglez l'affichage des jours save dans le planning de semaine
- [ ] trouver comment automatiquement ajouter une photo a la création d'une recette


## 🚀 Présentation du Projet

RecipeVerse est une application web moderne de gestion de recettes, conçue pour les passionnés de cuisine qui souhaitent organiser et partager leurs recettes préférées.

## 🛠️ Technologies Utilisées

### Frontend
- React.js
- React Router
- CSS personnalisé avec variables et animations
- Responsive Design

### Backend & Authentification
- Supabase (Backend as a Service)
  - Authentification
  - Base de données PostgreSQL
  - Gestion des utilisateurs
  - Politiques de sécurité

### Hébergement & Déploiement
- (À définir : Vercel, Netlify, etc.)

## ✨ Fonctionnalités Actuelles

### Authentification
- Inscription/Connexion
- Déconnexion sécurisée
- Gestion des utilisateurs

### Gestion des Recettes
- Ajouter de nouvelles recettes
- Affichage en liste
- Vue détaillée en plein écran
- Suppression de recettes
- Stockage sécurisé dans Supabase

### Design
- Interface utilisateur moderne
- Thème sombre élégant
- Animations fluides
- Design responsive

## 🔧 Configuration du Projet

### Prérequis
- Node.js (v14+)
- npm ou yarn
- Compte Supabase

### Installation

1. Cloner le repository
```bash
git clone https://github.com/votre-username/recipeverse.git
cd recipeverse
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
- Créer un fichier `.env`
- Ajouter vos clés Supabase :
```
REACT_APP_SUPABASE_URL=votre_url_supabase
REACT_APP_SUPABASE_ANON_KEY=votre_clé_anonyme
```

4. Lancer l'application
```bash
npm start
```

## 🔒 Sécurité

- Authentification via Supabase
- Politiques de sécurité granulaires
- Stockage sécurisé des données utilisateur

## 🌐 Roadmap Future

### Version Mobile
- Développement d'une application React Native
- Synchronisation avec le backend Supabase
- Expérience utilisateur native

### Fonctionnalités Avancées
- Partage de recettes
- Génération de listes de courses
- Mode hors-ligne
- Importation de recettes depuis le web

## 🤝 Contributions

Les contributions sont les bienvenues ! Veuillez consulter les directives de contribution avant de soumettre une pull request.

## 📄 Licence

[À spécifier - par défaut MIT]

## 📞 Contact

Votre Nom - [votre-email]
Lien du projet : [URL du repository]


[![Netlify Status](https://api.netlify.com/api/v1/badges/70600db5-f85b-4433-9be4-08a3d44777a5/deploy-status)](https://app.netlify.com/sites/baecoliv/deploys)
