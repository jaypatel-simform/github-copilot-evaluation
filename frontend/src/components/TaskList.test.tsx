import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import TaskList from './TaskList';
import taskService from '../services/taskService';
import { Task, TaskPriority, TaskStatus } from '../types/task.types';

jest.mock('../services/taskService');

const mockedService = taskService as jest.Mocked<typeof taskService>;

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: '1',
  title: 'Write report',
  description: 'Quarterly',
  status: TaskStatus.TODO,
  priority: TaskPriority.MID,
  dueDate: '2026-03-10T10:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

const lastParams = () =>
  mockedService.getAllTasks.mock.calls[mockedService.getAllTasks.mock.calls.length - 1][0];

describe('TaskList filters', () => {
  beforeEach(() => {
    mockedService.getAllTasks.mockReset();
    mockedService.getAllTasks.mockResolvedValue({ success: true, data: [makeTask()] });
  });

  it('loads with no filters initially', async () => {
    render(<TaskList />);
    await screen.findByText('Write report');
    expect(mockedService.getAllTasks).toHaveBeenCalledTimes(1);
    expect(lastParams()).toEqual({ sortByDueDate: false });
  });

  it('refetches with status when a status is chosen', async () => {
    render(<TaskList />);
    await screen.findByText('Write report');

    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'COMPLETED' } });

    await waitFor(() => expect(mockedService.getAllTasks).toHaveBeenCalledTimes(2));
    expect(lastParams()).toEqual({ sortByDueDate: false, status: 'COMPLETED' });
  });

  it('combines filters with the sort toggle', async () => {
    render(<TaskList />);
    await screen.findByText('Write report');

    fireEvent.change(screen.getByLabelText('Priority'), { target: { value: 'HIGH' } });
    await waitFor(() => expect(mockedService.getAllTasks).toHaveBeenCalledTimes(2));
    fireEvent.click(screen.getByLabelText('Sort by Due Date'));
    await waitFor(() => expect(mockedService.getAllTasks).toHaveBeenCalledTimes(3));

    expect(lastParams()).toEqual({ sortByDueDate: true, priority: 'HIGH' });
  });

  it('sends the date range as inclusive local-day boundaries', async () => {
    render(<TaskList />);
    await screen.findByText('Write report');

    fireEvent.change(screen.getByLabelText('Due from'), { target: { value: '2026-03-10' } });
    await waitFor(() => expect(mockedService.getAllTasks).toHaveBeenCalledTimes(2));
    fireEvent.change(screen.getByLabelText('Due to'), { target: { value: '2026-03-10' } });
    await waitFor(() => expect(mockedService.getAllTasks).toHaveBeenCalledTimes(3));

    expect(lastParams()).toEqual({
      sortByDueDate: false,
      dueDateFrom: new Date(2026, 2, 10, 0, 0, 0, 0).toISOString(),
      dueDateTo: new Date(2026, 2, 10, 23, 59, 59, 999).toISOString(),
    });
  });

  it('shows a message and does not call the API when from is after to', async () => {
    render(<TaskList />);
    await screen.findByText('Write report');

    fireEvent.change(screen.getByLabelText('Due to'), { target: { value: '2026-03-01' } });
    await waitFor(() => expect(mockedService.getAllTasks).toHaveBeenCalledTimes(2));

    fireEvent.change(screen.getByLabelText('Due from'), { target: { value: '2026-03-05' } });

    expect(await screen.findByRole('alert')).toHaveTextContent(/must be on or before/);
    expect(mockedService.getAllTasks).toHaveBeenCalledTimes(2);
    expect(screen.queryByText('No tasks match your filters')).not.toBeInTheDocument();
  });

  it('shows the filtered empty state when filters are active', async () => {
    render(<TaskList />);
    await screen.findByText('Write report');

    mockedService.getAllTasks.mockResolvedValue({ success: true, data: [] });
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'COMPLETED' } });

    expect(await screen.findByText('No tasks match your filters')).toBeInTheDocument();
    expect(screen.queryByText(/No tasks yet/)).not.toBeInTheDocument();
  });

  it('shows the original empty state when there are no filters', async () => {
    mockedService.getAllTasks.mockResolvedValue({ success: true, data: [] });
    render(<TaskList />);

    expect(
      await screen.findByText('No tasks yet. Create your first task to get started!')
    ).toBeInTheDocument();
    expect(screen.queryByText('No tasks match your filters')).not.toBeInTheDocument();
  });

  it('debounces search and sends q once', async () => {
    jest.useFakeTimers();
    try {
      render(<TaskList />);
      await act(async () => { await Promise.resolve(); });
      expect(mockedService.getAllTasks).toHaveBeenCalledTimes(1);

      const input = screen.getByLabelText('Search');
      fireEvent.change(input, { target: { value: 'r' } });
      fireEvent.change(input, { target: { value: 're' } });
      fireEvent.change(input, { target: { value: 'rep' } });
      expect(mockedService.getAllTasks).toHaveBeenCalledTimes(1);

      await act(async () => { jest.advanceTimersByTime(300); });

      expect(mockedService.getAllTasks).toHaveBeenCalledTimes(2);
      expect(lastParams()).toEqual({ sortByDueDate: false, q: 'rep' });
    } finally {
      jest.useRealTimers();
    }
  });

  it('Clear filters resets controls and refetches without filters', async () => {
    render(<TaskList />);
    await screen.findByText('Write report');

    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'TODO' } });
    fireEvent.change(screen.getByLabelText('Priority'), { target: { value: 'LOW' } });
    await waitFor(() => expect(lastParams()).toEqual({
      sortByDueDate: false, status: 'TODO', priority: 'LOW',
    }));

    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));

    await waitFor(() => expect(lastParams()).toEqual({ sortByDueDate: false }));
    expect((screen.getByLabelText('Status') as HTMLSelectElement).value).toBe('');
    expect((screen.getByLabelText('Priority') as HTMLSelectElement).value).toBe('');
    expect((screen.getByLabelText('Search') as HTMLInputElement).value).toBe('');
  });
});
