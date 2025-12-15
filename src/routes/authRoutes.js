import { Router } from 'express';
import auth from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { loginValidator, registerValidator } from '../utils/validators.js';
import { register, login, logout, me } from '../controllers/authController.js';

const router = Router();

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.post('/logout', auth, logout);
router.get('/me', auth, me);

export default router;
