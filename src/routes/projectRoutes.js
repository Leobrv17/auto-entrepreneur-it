import { Router } from 'express';
import auth, { adminOnly } from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { idParamValidator, projectValidator } from '../utils/validators.js';
import { listProjects, createProject, getProject, updateProject, deleteProject, grantAccess, revokeAccess } from '../controllers/projectController.js';

const router = Router();

router.use(auth);
router.get('/', listProjects);
router.get('/:id', idParamValidator, validate, getProject);
router.post('/', adminOnly, projectValidator, validate, createProject);
router.patch('/:id', adminOnly, idParamValidator, projectValidator, validate, updateProject);
router.delete('/:id', adminOnly, idParamValidator, validate, deleteProject);
router.post('/:id/grant-access', adminOnly, idParamValidator, validate, grantAccess);
router.post('/:id/revoke-access', adminOnly, idParamValidator, validate, revokeAccess);

export default router;
