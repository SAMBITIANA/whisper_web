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
