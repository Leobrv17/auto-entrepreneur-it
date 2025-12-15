import { Router } from 'express';
import auth from '../middlewares/auth.js';
import { batchSync } from '../controllers/syncController.js';

const router = Router();

router.use(auth);
router.post('/batch', batchSync);

export default router;
