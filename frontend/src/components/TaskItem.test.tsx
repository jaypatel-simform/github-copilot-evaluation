import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskItem from './TaskItem';
import { Task, TaskStatus, TaskPriority } from '../types/task.types';

const buildTask = (priority: TaskPriority): Task => ({
  id: '1',
  title: 'Ship release candidate',
  description: 'Cut the RC branch and publish the release notes.',
  status: TaskStatus.TODO,
  priority,
  dueDate: '2026-03-01T00:00:00.000Z',
  createdAt: '2026-02-01T00:00:00.000Z',
  updatedAt: '2026-02-01T00:00:00.000Z',
});

describe('TaskItem priority badge', () => {
  it('renders "Very high" with its own distinct badge class', () => {
    render(
      <TaskItem
        task={buildTask(TaskPriority.VERY_HIGH)}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onStatusChange={jest.fn()}
      />
    );

    const badge = screen.getByText('Very high');
    expect(badge).toHaveClass('badge', 'priority', 'priority-very-high');
    expect(badge).not.toHaveClass('priority-high');
  });

  it('still renders HIGH with the priority-high badge class', () => {
    render(
      <TaskItem
        task={buildTask(TaskPriority.HIGH)}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onStatusChange={jest.fn()}
      />
    );

    const badge = screen.getByText('HIGH');
    expect(badge).toHaveClass('badge', 'priority', 'priority-high');
    expect(badge).not.toHaveClass('priority-very-high');
  });
});
