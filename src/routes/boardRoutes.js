import { Router } from 'express';
import auth, { adminOnly } from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { columnIdParamValidator, columnValidator, idParamValidator, taskIdParamValidator, taskValidator } from '../utils/validators.js';
import { getBoard, createColumn, updateColumn, createTask, updateTask, deleteTask, moveTask } from '../controllers/boardController.js';

const router = Router({ mergeParams: true });

router.use(auth);
router.get('/:id/board', idParamValidator, validate, getBoard);
router.post('/:id/columns', adminOnly, idParamValidator, columnValidator, validate, createColumn);
router.patch('/:id/columns/:colId', adminOnly, idParamValidator, columnIdParamValidator, columnValidator, validate, updateColumn);
router.post('/:id/tasks', adminOnly, idParamValidator, taskValidator, validate, createTask);
router.patch('/:id/tasks/:taskId', adminOnly, idParamValidator, taskIdParamValidator, taskValidator, validate, updateTask);
router.delete('/:id/tasks/:taskId', adminOnly, idParamValidator, taskIdParamValidator, validate, deleteTask);
router.post('/:id/tasks/:taskId/move', adminOnly, idParamValidator, taskIdParamValidator, validate, moveTask);

export default router;
