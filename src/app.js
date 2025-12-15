import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import boardRoutes from './routes/boardRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import syncRoutes from './routes/syncRoutes.js';
import notFound from './middlewares/notFound.js';
import errorHandler from './middlewares/errorHandler.js';
import swaggerDocument from './swagger.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const swaggerHtml = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <title>Auto Entrepreneur API Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.onload = () => {
        SwaggerUIBundle({
          url: '/api-docs.json',
          dom_id: '#swagger-ui',
        });
      };
    </script>
  </body>
</html>`;

app.get('/api-docs', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(swaggerHtml);
});

app.get('/api-docs.json', (req, res) => {
  res.json(swaggerDocument);
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects', boardRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/sync', syncRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
