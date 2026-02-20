import Joi from 'joi';
import { TaskStatus, TaskPriority } from '../models/task.model';

export const createTaskSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required().messages({
    'string.empty': 'Title is required',
    'string.min': 'Title must not be empty',
    'string.max': 'Title must not exceed 200 characters',
    'any.required': 'Title is required'
  }),
  description: Joi.string().trim().max(1000).required().messages({
    'string.empty': 'Description is required',
    'string.max': 'Description must not exceed 1000 characters',
    'any.required': 'Description is required'
  }),
  status: Joi.string().valid(...Object.values(TaskStatus)).optional().messages({
    'any.only': `Status must be one of: ${Object.values(TaskStatus).join(', ')}`
  }),
  priority: Joi.string().valid(...Object.values(TaskPriority)).optional().messages({
    'any.only': `Priority must be one of: ${Object.values(TaskPriority).join(', ')}`
  }),
  dueDate: Joi.date().iso().optional().messages({
    'date.base': 'Due date must be a valid date',
    'date.format': 'Due date must be in ISO format'
  })
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).optional().messages({
    'string.empty': 'Title must not be empty',
    'string.min': 'Title must not be empty',
    'string.max': 'Title must not exceed 200 characters'
  }),
  description: Joi.string().trim().max(1000).optional().messages({
    'string.max': 'Description must not exceed 1000 characters'
  }),
  status: Joi.string().valid(...Object.values(TaskStatus)).optional().messages({
    'any.only': `Status must be one of: ${Object.values(TaskStatus).join(', ')}`
  }),
  priority: Joi.string().valid(...Object.values(TaskPriority)).optional().messages({
    'any.only': `Priority must be one of: ${Object.values(TaskPriority).join(', ')}`
  }),
  dueDate: Joi.date().iso().optional().messages({
    'date.base': 'Due date must be a valid date',
    'date.format': 'Due date must be in ISO format'
  })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});
