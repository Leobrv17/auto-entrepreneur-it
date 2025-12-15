const serverUrl = process.env.API_BASE_URL || 'http://localhost:4000';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Auto Entrepreneur API',
    version: '1.0.0',
    description: 'Documentation de l\'API Auto Entrepreneur',
  },
  servers: [{ url: serverUrl }],
  tags: [
    { name: 'Auth', description: 'Authentification' },
    { name: 'Users', description: 'Gestion des utilisateurs' },
    { name: 'Projects', description: 'Gestion des projets' },
    { name: 'Board', description: 'Colonnes et tâches des projets' },
    { name: 'Favorites', description: 'Favoris utilisateur' },
    { name: 'Sync', description: 'Synchronisation' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', format: 'uuid' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ['user', 'admin'] },
        },
      },
      Project: {
        type: 'object',
        properties: {
          _id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          description: { type: 'string' },
          status: {
            type: 'string',
            enum: ['draft', 'active', 'completed', 'archived'],
          },
          members: {
            type: 'array',
            items: { $ref: '#/components/schemas/User' },
          },
        },
      },
      BoardColumn: {
        type: 'object',
        properties: {
          _id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          order: { type: 'number' },
        },
      },
      Task: {
        type: 'object',
        properties: {
          _id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          description: { type: 'string' },
          priority: { type: 'string', enum: ['low', 'medium', 'high'] },
          labels: {
            type: 'array',
            items: { type: 'string' },
          },
          dueDate: { type: 'string', format: 'date-time' },
          assignee: { $ref: '#/components/schemas/User' },
          columnId: { type: 'string' },
        },
      },
      Favorite: {
        type: 'object',
        properties: {
          _id: { type: 'string', format: 'uuid' },
          entityId: { type: 'string' },
          entityType: { type: 'string' },
        },
      },
      Credentials: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
        },
      },
      RegistrationInput: {
        type: 'object',
        required: ['firstName', 'lastName', 'email', 'password'],
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: "Créer un nouveau compte utilisateur",
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegistrationInput' },
            },
          },
        },
        responses: {
          201: { description: 'Utilisateur créé' },
          400: { description: 'Données invalides' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Authentifier un utilisateur et récupérer un token JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Credentials' },
            },
          },
        },
        responses: {
          200: {
            description: 'Authentification réussie',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: { type: 'string' },
                    user: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          401: { description: 'Identifiants invalides' },
        },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Récupérer le profil de l\'utilisateur courant',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Profil utilisateur',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
          401: { description: 'Non authentifié' },
        },
      },
    },
    '/api/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Déconnecter l\'utilisateur courant',
        security: [{ bearerAuth: [] }],
        responses: {
          204: { description: 'Déconnexion réussie' },
          401: { description: 'Non authentifié' },
        },
      },
    },
    '/api/users': {
      get: {
        tags: ['Users'],
        summary: 'Lister les utilisateurs (admin seulement)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Liste des utilisateurs',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/User' },
                },
              },
            },
          },
          403: { description: 'Accès refusé' },
        },
      },
    },
    '/api/users/{id}/role': {
      post: {
        tags: ['Users'],
        summary: 'Mettre à jour le rôle d\'un utilisateur',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  role: { type: 'string', enum: ['user', 'admin'] },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Rôle mis à jour' },
          403: { description: 'Accès refusé' },
        },
      },
    },
    '/api/projects': {
      get: {
        tags: ['Projects'],
        summary: 'Lister les projets accessibles',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Liste des projets',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Project' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Projects'],
        summary: 'Créer un projet (admin)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Project' },
            },
          },
        },
        responses: {
          201: { description: 'Projet créé' },
          403: { description: 'Accès refusé' },
        },
      },
    },
    '/api/projects/{id}': {
      get: {
        tags: ['Projects'],
        summary: 'Récupérer un projet',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Projet détaillé' },
          404: { description: 'Projet introuvable' },
        },
      },
      patch: {
        tags: ['Projects'],
        summary: 'Mettre à jour un projet (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Project' },
            },
          },
        },
        responses: {
          200: { description: 'Projet mis à jour' },
          403: { description: 'Accès refusé' },
        },
      },
      delete: {
        tags: ['Projects'],
        summary: 'Supprimer un projet (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          204: { description: 'Projet supprimé' },
          403: { description: 'Accès refusé' },
        },
      },
    },
    '/api/projects/{id}/grant-access': {
      post: {
        tags: ['Projects'],
        summary: 'Donner l\'accès à un utilisateur (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { userId: { type: 'string' } },
              },
            },
          },
        },
        responses: {
          200: { description: 'Accès accordé' },
          403: { description: 'Accès refusé' },
        },
      },
    },
    '/api/projects/{id}/revoke-access': {
      post: {
        tags: ['Projects'],
        summary: 'Retirer l\'accès à un utilisateur (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { userId: { type: 'string' } },
              },
            },
          },
        },
        responses: {
          200: { description: 'Accès retiré' },
          403: { description: 'Accès refusé' },
        },
      },
    },
    '/api/projects/{id}/board': {
      get: {
        tags: ['Board'],
        summary: 'Obtenir le board d\'un projet',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: {
            description: 'Board du projet',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    columns: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/BoardColumn' },
                    },
                    tasks: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Task' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/projects/{id}/columns': {
      post: {
        tags: ['Board'],
        summary: 'Créer une colonne (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/BoardColumn' },
            },
          },
        },
        responses: {
          201: { description: 'Colonne créée' },
        },
      },
    },
    '/api/projects/{id}/columns/{colId}': {
      patch: {
        tags: ['Board'],
        summary: 'Mettre à jour une colonne (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'colId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/BoardColumn' },
            },
          },
        },
        responses: {
          200: { description: 'Colonne mise à jour' },
        },
      },
    },
    '/api/projects/{id}/tasks': {
      post: {
        tags: ['Board'],
        summary: 'Créer une tâche (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Task' },
            },
          },
        },
        responses: {
          201: { description: 'Tâche créée' },
        },
      },
    },
    '/api/projects/{id}/tasks/{taskId}': {
      patch: {
        tags: ['Board'],
        summary: 'Mettre à jour une tâche (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'taskId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Task' },
            },
          },
        },
        responses: {
          200: { description: 'Tâche mise à jour' },
        },
      },
      delete: {
        tags: ['Board'],
        summary: 'Supprimer une tâche (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'taskId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          204: { description: 'Tâche supprimée' },
        },
      },
    },
    '/api/projects/{id}/tasks/{taskId}/move': {
      post: {
        tags: ['Board'],
        summary: 'Déplacer une tâche vers une autre colonne (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'taskId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  columnId: { type: 'string' },
                  order: { type: 'number' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Tâche déplacée' },
        },
      },
    },
    '/api/favorites': {
      get: {
        tags: ['Favorites'],
        summary: 'Lister les favoris de l\'utilisateur',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Liste des favoris',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Favorite' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Favorites'],
        summary: 'Ajouter un favori',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  entityId: { type: 'string' },
                  entityType: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Favori créé' },
        },
      },
    },
    '/api/favorites/{favId}': {
      delete: {
        tags: ['Favorites'],
        summary: 'Supprimer un favori',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'favId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          204: { description: 'Favori supprimé' },
        },
      },
    },
    '/api/sync/batch': {
      post: {
        tags: ['Sync'],
        summary: 'Synchroniser un lot de données',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                additionalProperties: true,
              },
            },
          },
        },
        responses: {
          200: { description: 'Synchronisation terminée' },
        },
      },
    },
  },
};

export default swaggerDocument;
