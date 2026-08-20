# SportSee

Application de suivi sportif et d’analyse de performance pour le projet SportSee.

## Prérequis

- Node.js 18+
- npm
- Un backend API SportSee démarré localement sur `http://localhost:8000`

## Installation

1. Installer les dépendances :
   ```bash
   npm install
   ```
2. Copier le fichier d’environnement :
   ```bash
   copy .env.example .env
   ```
3. Vérifier la configuration dans `.env` :
   ```env
   VITE_USE_MOCK=false
   VITE_API_URL=http://localhost:8000/api
   VITE_ASSET_URL=http://localhost:8000
   ```

## Démarrage

```bash
npm run dev
```

## Authentification

L’application suit une session utilisateur stockée dans le `sessionStorage` sous la clé `sportsee_user`.
Le backend doit renvoyer un JWT valide pour autoriser les requêtes API.

## Scripts

```bash
npm run dev
npm run build
npm run lint
```
