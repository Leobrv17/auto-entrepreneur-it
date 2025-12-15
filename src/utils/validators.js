import { body, param } from 'express-validator';

export const registerValidator = [
  body('firstName').notEmpty().withMessage('firstName is required'),
  body('lastName').notEmpty().withMessage('lastName is required'),
  body('email').isEmail().withMessage('email is invalid'),
  body('password').isLength({ min: 6 }).withMessage('password too short'),
];

export const loginValidator = [
  body('email').isEmail(),
  body('password').notEmpty(),
];

export const projectValidator = [
  body('title').notEmpty(),
  body('description').optional().isString(),
  body('status').optional().isIn(['draft', 'active', 'completed', 'archived']),
];

export const columnValidator = [
  body('title').notEmpty(),
  body('order').optional().isNumeric(),
];

export const taskValidator = [
  body('title').notEmpty(),
  body('description').optional().isString(),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('labels').optional().isArray(),
  body('dueDate').optional().isISO8601(),
  body('assignee').optional().isMongoId(),
  body('columnId').optional().isMongoId(),
];

export const idParamValidator = [param('id').isMongoId()];

export const columnIdParamValidator = [param('colId').isMongoId()];
export const taskIdParamValidator = [param('taskId').isMongoId()];
