# Manga Collection Frontend

Frontend Vue.js de l'application **Manga Collection**.

Ce projet fournit l'interface utilisateur pour consommer le backend de Manga Collection.

## Aperçu

- Connexion utilisateur via API
- Consultation d'un catalogue de mangas
- Upload d'un manga avec image
- Affichage sécurisé des images protégées
- Gestion de session et renouvellement automatique du token

## Stack technique

- **Vue 3**
- **Vite**
- **JavaScript**
- **Fetch API**

## Prérequis

- Node.js
- npm
- Backend API en fonctionnement

## Installation

1. Cloner le dépôt :

   ```bash
   git clone <url-du-dépôt>
   cd manga-frontend
   ```

2. Installer les dépendances :

   ```bash
   npm install
   ```

## Configuration

Créer un fichier `.env.development` à la racine du projet :

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

Modifiez cette URL si votre backend utilise un autre hôte ou port.

## Lancement

### Mode développement

```bash
npm run dev
```

Ouvrez le navigateur à : `http://localhost:5173`

### Build de production

```bash
npm run build
```

### Prévisualiser le build

```bash
npm run preview
```

## Structure du projet

```text
src/
├── App.vue
├── main.js
├── services/
│   └── api.js
└── components/
    ├── LoginForm.vue
    ├── RegisterForm.vue
    ├── MangaList.vue
    ├── MangaCard.vue
    └── UploadForm.vue
```

## Description des fichiers

- `src/App.vue` : composant principal et point d'entrée de l'interface
- `src/main.js` : initialisation de l'application Vue
- `src/services/api.js` : gestion centralisée des appels API et des tokens
- `src/components/LoginForm.vue` : formulaire de connexion
- `src/components/RegisterForm.vue` : formulaire d'inscription
- `src/components/MangaList.vue` : affichage de la liste de mangas
- `src/components/MangaCard.vue` : carte de présentation pour chaque manga
- `src/components/UploadForm.vue` : formulaire d'ajout de manga avec image

## Fonctionnalités

- Authentification utilisateur
- Récupération sécurisée des mangas
- Upload de mangas avec image
- Affichage d'images protégées via requêtes authentifiées
- Interface responsive

## API utilisées

- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /health`
- `GET /mangas`
- `POST /mangas`
- `GET /mangas/{id}/image`

## Gestion des images protégées

Les images ne sont pas chargées via une URL publique. Le frontend :

1. appelle l'endpoint protégé avec le token d'accès
2. récupère le contenu binaire
3. crée une URL locale temporaire pour l'affichage

## Upload de manga

Le formulaire envoie une requête `multipart/form-data` avec :

- `title`
- `description`
- `price`
- `image`

### Contraintes communes

- `price` doit être un nombre positif (exemple : `7.90`, `10`, `10.50`)
- formats d'image acceptés : `jpg`, `jpeg`, `png`, `webp`
- taille maximale d'image définie par le backend

## Dépannage rapide

### Le frontend ne démarre pas

- Vérifiez `node -v` et `npm -v`
- Lancez `npm install`

### L'API ne répond pas

- Testez : `curl http://localhost:8000/api/v1/health`

### Le frontend ne peut pas atteindre l'API

- Vérifiez le fichier `.env.development`
- Assurez-vous que `VITE_API_BASE_URL` est correct

### Les mangas ne s'affichent pas

- Le backend est-il disponible ?
- L'utilisateur est-il connecté ?
- Le token est-il expiré ?
- L'endpoint `/mangas` est-il protégé ?

### Les images ne s'affichent pas

- L'utilisateur est-il connecté ?
- Le token est-il valide ?
- L'endpoint `/mangas/{id}/image` répond-il ?
- L'image existe-t-elle côté backend ?

### L'upload échoue

- Le titre est-il renseigné ?
- Le prix est-il valide ?
- Une image est-elle sélectionnée ?
- Le format d'image est-il accepté ?
- La session est-elle valide ?

## Sécurité et comportement

- Appels API centralisés
- Gestion des erreurs d'authentification
- Refresh automatique du token en cas de 401
- Nettoyage de session en cas d'erreur
- Upload via `FormData`
- Affichage conditionnel selon l'état d'authentification
- Récupération d'images protégées via requêtes authentifiées

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus d'informations.

 • no public catalog without backend changes
 • no public registration without backend changes
 • roles are enforced by the backend
 • critical security controls remain a backend responsibility
