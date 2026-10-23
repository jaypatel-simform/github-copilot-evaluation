export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

/**
 * Task priorities, declared in descending order of urgency:
 * "Very high" > HIGH > MID > LOW.
 *
 * Keep this order when the values are enumerated, e.g. `Object.values(TaskPriority)`
 * is used by the Joi validators to build the list of allowed values and the
 * validation error message, so a reader sees the most urgent value first.
 */
export enum TaskPriority {
  VERY_HIGH = 'Very high',
  HIGH = 'HIGH',
  MID = 'MID',
  LOW = 'LOW'
}

/**
 * Priorities that receive the automatic 7-day due date.
 * "Very high" is more urgent than HIGH and therefore follows the same rule.
 */
export const HIGH_URGENCY_PRIORITIES: readonly TaskPriority[] = [
  TaskPriority.VERY_HIGH,
  TaskPriority.HIGH
];

/** True for the priorities that rank at or above HIGH (i.e. "Very high" and HIGH). */
export const isHighUrgencyPriority = (priority: TaskPriority): boolean =>
  HIGH_URGENCY_PRIORITIES.includes(priority);

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date;
}

export interface TaskFilterDto {
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDateFrom?: Date;
  dueDateTo?: Date;
}
