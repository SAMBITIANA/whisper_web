# whispers_web

Front Next.js 16 (App Router) du projet Whispers. Il consomme l'API
NestJS + Fastify de `../whispers_server` (Prisma 8, cluster Node.js).

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Tailwind CSS 4, ESLint (`eslint-config-next`)
- Axios (REST), Socket.IO client (temps réel), Zod (validation)
- Vitest + Testing Library (jsdom)

## Variables d'environnement

Copier `.env.example` vers `.env.local` :

| Variable | Défaut | Rôle |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:3200` | Origine du serveur Nest : cible du proxy `/api` et des appels côté serveur |
| `NEXT_PUBLIC_SOCKET_URL` | `http://localhost:3200` | Origine du serveur Socket.IO (le WebSocket n'est pas proxyfiable par Next) |

## Design

- **shadcn/ui v4** (style `radix-nova`) — les composants sont copiés dans
  `src/components/ui` et appartiennent au projet.
- **Direction éditoriale « papier & encre »** : filets fins au lieu de cartes,
  grille asymétrique, petit grain de papier, aucune ombre portée lourde.
- **Palette sage** appliquée aux tokens shadcn en OKLCH (`--primary` = vert
  d'encre `#3F4D3A`, `--secondary`/`--accent` = lavis de sauge, `--muted-foreground`
  sauge sourde) + utilitaires bruts `--color-sage-100/300/500/700/900`,
  `--color-paper`, `--color-paper-deep`, `--color-ink`, `--rule`. Bandes, footer
  et panneau d'authentification en sauge claire (`#D2DCB6`), cadres photo et
  corps du lecteur en sauge moyenne (`#A1BC98`). Thème clair et thème sombre
  (nuit verte).
- **Typographie auto-hébergée** (`src/fonts/`, `next/font/local`, aucune requête
  Google au runtime) : **Fraunces** variable pour les citations et titres,
  **Instrument Sans** pour l'interface, **Geist Mono** pour les chiffres.
- Utilitaires maison dans `globals.css` : `.display`, `.eyebrow`, `.hanging`,
  `.paper-frame`, `.link-underline`, `.rule`, `.rise`.
- Typographie française appliquée au rendu via `typography()` et
  `formatViews()` (`src/lib/format.ts`) : apostrophes courbes, espaces fines
  insécables, « 184,3 k » — jamais dans les données.

## Pages (données fictives)

| Route | Contenu |
| --- | --- |
| `/` | Une éditoriale (citation du jour encadrée), tendances en liste numérotée, humeurs, dernières parutions, proposition, formats, communauté |
| `/catalogue` | Recherche, filtres (format, sujet, humeur) et tri, sur `src/lib/fake-data.ts` |
| `/citation/[slug]` | Lecteur, source, statistiques, citations liées |
| `/source/[slug]` | Toutes les citations issues d'une source |
| `/connexion`, `/inscription` | Authentification simulée (mot de passe, lien magique, Google) et comptes de démonstration |
| `/compte` | Espace membre : profil, propositions, médias enregistrés, préférences |
| `/admin` | Tableau de bord de l'équipe (KPI, file de modération, activité, pipeline) |
| `/admin/moderation`, `/admin/contenus` | Modération des propositions, liste des médias et des brouillons |
| `/admin/contenus/nouveau` | Création d'un contenu des 4 formats avec aperçu de la couche de texte |
| `/admin/sources`, `/admin/utilisateurs` | Catalogue des sources, comptes et rôles (utilisateurs réservé aux administrateurs) |

`src/lib/fake-data.ts` contient le catalogue de démonstration (13 médias, 13
sources, citations en français et en anglais). Il remplacera l'API NestJS
lorsque le backend exposera `/api`.

Les visuels sont **des images réelles téléchargées en local** dans
`public/media/` (34 photos libres issues de picsum.photos, licence Unsplash) :
elles simulent la diffusion future par Backblaze B2 + Cloudflare, sans
dépendance réseau à l'exécution. `public/media/sources/` contient un visuel de
dossier par source (page `/source/[slug]`), distinct des affiches des
citations. Les pages d'authentification et le « carnet de repérages » de
l'accueil utilisent les photos `auth-*.jpg` et `carnet-*.jpg`. Pour remplacer
par le vrai CDN, il suffit de changer les champs `poster` de `FakeMedia` /
`FakeSource` par les URL Cloudflare.

## Espaces et rôles (maquette)

L'authentification est **simulée** : la session est un cookie JSON en base64
(`whispers_session`, 7 jours, **non `httpOnly`**) lu par `SessionProvider`,
avec des gardes de route côté client (`src/lib/use-required-session.ts`). Ce
n'est pas une implémentation de sécurité — l'API NestJS devra poser un cookie
`httpOnly` (ou un JWT court + refresh), OAuth + PKCE et des guards serveur.

| Rôle | Libellé | Droits |
| --- | --- | --- |
| Visiteur | — | Catalogue, citations, sources |
| `USER` | Membre | Proposer, enregistrer, préférences, compte |
| `EDITOR` | Éditeur | Modération, contenus, sources, tableau de bord |
| `ADMIN` | Administrateur | + comptes et rôles |

Comptes de démonstration (mot de passe `whispers`) : `julien@whispers.app`
(administrateur), `lea@whispers.app` (éditeur), `sam@whispers.app` (membre).
Les comptes créés via `/inscription` sont conservés dans
`localStorage["whispers_local_accounts"]`.

Les modifications de la maquette persistent par navigateur :
`whispers_proposals` (modération), `whispers_contents` (contenus et
brouillons), `whispers_sources`, `whispers_users` (rôles/statuts). Le lien
magique et Google sont simulés par un toast.

## Scripts

```bash
npm run dev        # serveur de dev (turbopack) sur http://localhost:3000
npm run build      # build de production
npm run start      # sert le build
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm test           # Vitest
npm run test:watch # Vitest en watch
```

## API et temps réel

- Requêtes REST : `src/lib/api.ts` (instance Axios). Côté navigateur la base
  est relative (`/api`) et passe par le rewrite Next
  (`next.config.ts` → `${NEXT_PUBLIC_API_BASE_URL}/api/:path*`), donc même
  origine et pas de CORS. Côté serveur (RSC / route handlers) la base est
  absolue.
- Socket.IO : `src/lib/socket.ts`. Connexion sur le path `/api/socket.io`
  (identique à l'adapter du serveur) en transport `websocket` uniquement :
  en cluster, le polling long-polling casse le routage entre workers sans
  sticky-session.

## Backend

```bash
cd ../whispers_server
npm run build
npm run start:cluster   # cluster Node.js, 1 worker par cœur
```

Variables côté serveur : `CLUSTER_ENABLED` (auto en production),
`CLUSTER_WORKERS`, `PORT` (3200).
