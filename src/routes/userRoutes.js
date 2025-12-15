import { Router } from 'express';
import auth, { adminOnly } from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { idParamValidator } from '../utils/validators.js';
import { listUsers, updateRole } from '../controllers/userController.js';

const router = Router();

router.use(auth, adminOnly);
router.get('/', listUsers);
router.post('/:id/role', idParamValidator, validate, updateRole);

export default router;
