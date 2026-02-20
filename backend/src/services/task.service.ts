import { Task, CreateTaskDto, UpdateTaskDto, TaskStatus, TaskPriority } from '../models/task.model';
import { randomUUID } from 'node:crypto';
import { logger } from '../utils/logger';
import { ForbiddenError } from '../utils/errors';

class TaskStore {
  private readonly tasks: Map<string, Task> = new Map();

  /**
   * Calculate due date based on priority
   * If priority is HIGH, set due date to 7 days from now
   */
  private calculateDueDate(priority: TaskPriority, providedDueDate?: Date): Date {
    if (priority === TaskPriority.HIGH && !providedDueDate) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);
      logger.debug('Auto-calculated due date for HIGH priority task', { 
        dueDate: dueDate.toISOString() 
      });
      return dueDate;
    }
    
    if (providedDueDate) {
      return new Date(providedDueDate);
    }
    
    // Default to 30 days from now if not provided and not high priority
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 30);
    return defaultDueDate;
  }

  create(dto: CreateTaskDto): Task {
    try {
      const id = randomUUID();
      const now = new Date();
      const priority = dto.priority || TaskPriority.MID;
      const dueDate = this.calculateDueDate(priority, dto.dueDate);
      
      const task: Task = {
        id,
        title: dto.title,
        description: dto.description,
        status: dto.status || TaskStatus.TODO,
        priority,
        dueDate,
        createdAt: now,
        updatedAt: now
      };

      this.tasks.set(id, task);
      
      logger.debug('Task stored in memory', { 
        taskId: id, 
        priority,
        dueDate: dueDate.toISOString(),
        totalTasks: this.tasks.size 
      });
      
      return task;
    } catch (error) {
      logger.error('Error in task store create', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  findAll(sortByDueDate = false): Task[] {
    try {
      const tasks = Array.from(this.tasks.values());
      
      if (sortByDueDate) {
        tasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        logger.debug('Tasks sorted by due date', { count: tasks.length });
      }
      
      logger.debug('Retrieved all tasks from memory', { count: tasks.length, sorted: sortByDueDate });
      return tasks;
    } catch (error) {
      logger.error('Error in task store findAll', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  findById(id: string): Task | undefined {
    try {
      const task = this.tasks.get(id);
      logger.debug('Task lookup by ID', { taskId: id, found: !!task });
      return task;
    } catch (error) {
      logger.error('Error in task store findById', { 
        taskId: id,
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  update(id: string, dto: UpdateTaskDto): Task | undefined {
    try {
      const task = this.tasks.get(id);
      
      if (!task) {
        logger.debug('Task not found for update', { taskId: id });
        return undefined;
      }

      // Prevent modification of completed tasks
      if (task.status === TaskStatus.COMPLETED) {
        logger.warn('Attempt to modify completed task', { taskId: id });
        throw new ForbiddenError('Cannot modify a task that is already completed');
      }

      // Recalculate due date if priority is being changed to HIGH
      let dueDate = task.dueDate;
      if (dto.priority === TaskPriority.HIGH && task.priority !== TaskPriority.HIGH) {
        dueDate = this.calculateDueDate(TaskPriority.HIGH, dto.dueDate);
        logger.debug('Due date recalculated for priority change to HIGH', {
          taskId: id,
          newDueDate: dueDate.toISOString()
        });
      } else if (dto.dueDate) {
        dueDate = new Date(dto.dueDate);
      }

      const updatedTask: Task = {
        ...task,
        ...dto,
        dueDate,
        updatedAt: new Date()
      };

      this.tasks.set(id, updatedTask);
      
      logger.debug('Task updated in memory', { taskId: id });
      
      return updatedTask;
    } catch (error) {
      logger.error('Error in task store update', { 
        taskId: id,
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  delete(id: string): boolean {
    try {
      const deleted = this.tasks.delete(id);
      logger.debug('Task deletion attempted', { taskId: id, success: deleted, remainingTasks: this.tasks.size });
      return deleted;
    } catch (error) {
      logger.error('Error in task store delete', { 
        taskId: id,
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }
}

export const taskStore = new TaskStore();
