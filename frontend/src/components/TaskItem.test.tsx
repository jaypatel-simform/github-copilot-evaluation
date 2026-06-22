import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskItem from './TaskItem';
import { Task, TaskStatus, TaskPriority } from '../types/task.types';

const baseTask: Task = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  title: 'Test Task',
  description: 'Test description',
  status: TaskStatus.IN_PROGRESS,
  priority: TaskPriority.HIGH,
  dueDate: '2024-06-15T00:00:00.000Z',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const handlers = {
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onStatusChange: jest.fn(),
};

beforeEach(() => jest.clearAllMocks());

describe('TaskItem – status display', () => {
  it('replaces ALL underscores in status so IN_PROGRESS shows as "IN PROGRESS"', () => {
    render(<TaskItem task={baseTask} {...handlers} />);
    // The badge text must NOT contain an underscore
    expect(screen.queryByText('IN_PROGRESS')).not.toBeInTheDocument();
    expect(screen.getByText('IN PROGRESS')).toBeInTheDocument();
  });
});

describe('TaskItem – date display', () => {
  it('displays the due date as the correct UTC calendar day (not shifted by local timezone)', () => {
    render(<TaskItem task={baseTask} {...handlers} />);
    // 2024-06-15T00:00:00.000Z must render as "Jun 15, 2024"
    // Without UTC fix, UTC-N users would see "Jun 14, 2024"
    const dueDateEl = screen.getByText(/Jun 15, 2024/i);
    expect(dueDateEl).toBeInTheDocument();
  });

  it('displays the created date as the correct UTC calendar day', () => {
    render(<TaskItem task={baseTask} {...handlers} />);
    // 2024-01-01T00:00:00.000Z must render as "Jan 1, 2024" not "Dec 31, 2023"
    const createdEl = screen.getByText(/Jan 1, 2024/i);
    expect(createdEl).toBeInTheDocument();
  });
});
