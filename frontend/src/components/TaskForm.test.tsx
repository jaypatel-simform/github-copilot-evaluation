import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskForm from './TaskForm';
import { TaskPriority } from '../types/task.types';

describe('TaskForm priority options', () => {
  const renderForm = (onSubmit = jest.fn(), onCancel = jest.fn()) => {
    render(
      <TaskForm
        task={undefined}
        onSubmit={onSubmit}
        onCancel={onCancel}
        isLoading={false}
      />
    );
    return { onSubmit, onCancel };
  };

  test('contains a "Very High" priority option', () => {
    renderForm();

    const option = screen.getByRole('option', { name: 'Very High' }) as HTMLOptionElement;

    expect(option).toBeInTheDocument();
    expect(option.value).toBe(TaskPriority.VERY_HIGH);
  });

  test('submits priority "Very High" when selected', () => {
    const { onSubmit } = renderForm();

    fireEvent.change(screen.getByLabelText(/Title \*/), {
      target: { value: 'Very High task' }
    });
    fireEvent.change(screen.getByLabelText(/Description \*/), {
      target: { value: 'Round trip the new priority' }
    });
    fireEvent.change(screen.getByLabelText(/Priority/), {
      target: { value: TaskPriority.VERY_HIGH }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create Task' }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ priority: 'Very High' })
    );
  });
});
