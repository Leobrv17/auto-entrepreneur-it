# Auto-entrepreneur IT backend

API Express + MongoDB pour la gestion de projets et kanban avec rôles admin/client.

## Lancement

```bash
# lancer uniquement MongoDB via Docker
docker compose up -d mongodb

# installer et démarrer l'API en local (nécessite un `.env` basé sur `.env.example`)
npm install
npm run dev
```

### Seed admin

```bash
npm run seed
```

Utilise `SEED_ADMIN_EMAIL` et `SEED_ADMIN_PASSWORD` (voir `.env.example`).

## Curl rapides

```bash
# register
token=$(curl -s -X POST http://localhost:4000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"secret"}' | jq -r .token)

# login
token=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"admin123"}' | jq -r .token)

# créer un projet (admin)
curl -X POST http://localhost:4000/api/projects \
  -H "Authorization: Bearer $token" \
  -H 'Content-Type: application/json' \
  -d '{"title":"Projet client","description":"Site web"}'

# donner accès à un client
dummyClientId=...
curl -X POST http://localhost:4000/api/projects/<projectId>/grant-access \
  -H "Authorization: Bearer $token" \
  -H 'Content-Type: application/json' \
  -d '{"userId":"'$dummyClientId'"}'

# créer une tâche
curl -X POST http://localhost:4000/api/projects/<projectId>/tasks \
  -H "Authorization: Bearer $token" \
  -H 'Content-Type: application/json' \
  -d '{"title":"Installer serveur","columnId":"<columnId>","priority":"high"}'
```
