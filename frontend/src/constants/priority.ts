import { TaskPriority } from '../types/task.types';

export interface PriorityOption {
  value: TaskPriority;
  label: string;
}

/**
 * Single source of truth for the priority selector, ordered most urgent first:
 * "Very high" ranks above "High".
 */
export const PRIORITY_OPTIONS: readonly PriorityOption[] = [
  { value: TaskPriority.VERY_HIGH, label: 'Very high' },
  { value: TaskPriority.HIGH, label: 'High' },
  { value: TaskPriority.MID, label: 'Medium' },
  { value: TaskPriority.LOW, label: 'Low' }
];

/** CSS class used by the priority badge in the task list, per priority. */
export const PRIORITY_BADGE_CLASS: Record<TaskPriority, string> = {
  [TaskPriority.VERY_HIGH]: 'priority-very-high',
  [TaskPriority.HIGH]: 'priority-high',
  [TaskPriority.MID]: 'priority-mid',
  [TaskPriority.LOW]: 'priority-low'
};
