import { Request, Response, NextFunction } from 'express';
import { taskStore } from '../services/task.service';
import { CreateTaskDto, UpdateTaskDto } from '../models/task.model';
import { NotFoundError, InternalServerError } from '../utils/errors';
import { logger } from '../utils/logger';

export const createTask = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const dto: CreateTaskDto = req.body;
    
    logger.info('Creating new task', { title: dto.title });
    
    const task = taskStore.create(dto);
    
    logger.info('Task created successfully', { taskId: task.id });
    
    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    logger.error('Error creating task', { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    next(error instanceof Error ? error : new InternalServerError());
  }
};

export const getAllTasks = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const sortByDueDate = req.query.sortByDueDate === 'true';
    
    logger.info('Fetching all tasks', { sortByDueDate });
    
    const tasks = taskStore.findAll(sortByDueDate);
    
    logger.info('Tasks retrieved successfully', { count: tasks.length, sorted: sortByDueDate });
    
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    logger.error('Error fetching tasks', { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    next(error instanceof Error ? error : new InternalServerError());
  }
};

export const getTaskById = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { id } = req.params;
    
    logger.info('Fetching task by ID', { taskId: id });
    
    const task = taskStore.findById(id);
    
    if (!task) {
      logger.warn('Task not found', { taskId: id });
      throw new NotFoundError('Task', id);
    }
    
    logger.info('Task retrieved successfully', { taskId: id });
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    logger.error('Error fetching task by ID', { 
      taskId: req.params.id,
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    next(error instanceof Error ? error : new InternalServerError());
  }
};

export const updateTask = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { id } = req.params;
    const dto: UpdateTaskDto = req.body;
    
    logger.info('Updating task', { taskId: id, updates: dto });
    
    const task = taskStore.update(id, dto);
    
    if (!task) {
      logger.warn('Task not found for update', { taskId: id });
      throw new NotFoundError('Task', id);
    }
    
    logger.info('Task updated successfully', { taskId: id });
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    logger.error('Error updating task', { 
      taskId: req.params.id,
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    next(error instanceof Error ? error : new InternalServerError());
  }
};

export const deleteTask = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { id } = req.params;
    
    logger.info('Deleting task', { taskId: id });
    
    const deleted = taskStore.delete(id);
    
    if (!deleted) {
      logger.warn('Task not found for deletion', { taskId: id });
      throw new NotFoundError('Task', id);
    }
    
    logger.info('Task deleted successfully', { taskId: id });
    
    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting task', { 
      taskId: req.params.id,
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    next(error instanceof Error ? error : new InternalServerError());
  }
};
