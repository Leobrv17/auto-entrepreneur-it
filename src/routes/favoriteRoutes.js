import { Router } from 'express';
import auth from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { param } from 'express-validator';
import { listFavorites, createFavorite, deleteFavorite } from '../controllers/favoriteController.js';

const router = Router();

router.use(auth);
router.get('/', listFavorites);
router.post('/', createFavorite);
router.delete('/:favId', [param('favId').isMongoId()], validate, deleteFavorite);

export default router;
