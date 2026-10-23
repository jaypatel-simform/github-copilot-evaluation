import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import TaskForm from './TaskForm';
import { TaskPriority } from '../types/task.types';

describe('TaskForm priority selector', () => {
  it('offers the four priorities, most urgent first', () => {
    render(<TaskForm onSubmit={jest.fn()} onCancel={jest.fn()} isLoading={false} />);

    const select = screen.getByLabelText('Priority') as HTMLSelectElement;
    const labels = Array.from(select.options).map((option) => option.textContent);

    expect(labels).toEqual(['Very high', 'High', 'Medium', 'Low']);
    expect(Array.from(select.options).map((option) => option.value)).toEqual([
      'Very high',
      TaskPriority.HIGH,
      TaskPriority.MID,
      TaskPriority.LOW,
    ]);
  });

  it('submits "Very high" unchanged and omits dueDate when left blank', () => {
    const onSubmit = jest.fn();
    render(<TaskForm onSubmit={onSubmit} onCancel={jest.fn()} isLoading={false} />);

    fireEvent.change(screen.getByLabelText('Title *'), {
      target: { value: 'Ship release candidate' },
    });
    fireEvent.change(screen.getByLabelText('Description *'), {
      target: { value: 'Cut the RC branch.' },
    });
    fireEvent.change(screen.getByLabelText('Priority'), {
      target: { value: TaskPriority.VERY_HIGH },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create Task' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const submitted = onSubmit.mock.calls[0][0];
    expect(submitted).toEqual(
      expect.objectContaining({ priority: 'Very high', title: 'Ship release candidate' })
    );
    expect(submitted).not.toHaveProperty('dueDate');
  });
});
