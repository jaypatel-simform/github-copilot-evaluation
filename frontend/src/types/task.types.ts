export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

/**
 * Task priorities, declared in descending order of urgency:
 * "Very high" > HIGH > MID > LOW.
 */
export enum TaskPriority {
  VERY_HIGH = 'Very high',
  HIGH = 'HIGH',
  MID = 'MID',
  LOW = 'LOW'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  error?: {
    message: string;
    statusCode: number;
    details?: Array<{
      field: string;
      message: string;
    }>;
  };
}
