import { Router } from 'express';
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask
} from '../controllers/task.controller';
import { validate } from '../middleware/validation';
import { validateUUID } from '../middleware/validateUUID';
import { createTaskSchema, updateTaskSchema } from '../validators/task.validator';

const router = Router();

// Create a new task
router.post('/tasks', validate(createTaskSchema), createTask);

// Get all tasks
router.get('/tasks', getAllTasks);

// Get a specific task by ID
router.get('/tasks/:id', validateUUID('id'), getTaskById);

// Update a task
router.put('/tasks/:id', validateUUID('id'), validate(updateTaskSchema), updateTask);

// Delete a task
router.delete('/tasks/:id', validateUUID('id'), deleteTask);

export default router;
