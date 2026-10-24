import taskService from './taskService';
import { TaskPriority, TaskStatus } from '../types/task.types';

describe('taskService.getAllTasks', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: [] }),
    });
    (global as any).fetch = fetchMock;
  });

  const calledUrl = (): string => fetchMock.mock.calls[0][0];

  it('calls /tasks with no query when no params are given', async () => {
    await taskService.getAllTasks();
    expect(calledUrl()).toMatch(/\/tasks$/);
  });

  it('sends sortByDueDate=true when enabled', async () => {
    await taskService.getAllTasks({ sortByDueDate: true });
    expect(calledUrl()).toMatch(/\/tasks\?sortByDueDate=true$/);
  });

  it('omits sortByDueDate when false', async () => {
    await taskService.getAllTasks({ sortByDueDate: false });
    expect(calledUrl()).toMatch(/\/tasks$/);
  });

  it('omits empty and undefined values', async () => {
    await taskService.getAllTasks({
      status: undefined,
      priority: undefined,
      dueDateFrom: '',
      dueDateTo: '',
      q: '   ',
    });
    expect(calledUrl()).toMatch(/\/tasks$/);
  });

  it('encodes all params together', async () => {
    await taskService.getAllTasks({
      sortByDueDate: true,
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      dueDateFrom: '2026-01-01T00:00:00.000Z',
      dueDateTo: '2026-01-31T23:59:59.999Z',
      q: '  foo & bar/baz ',
    });
    const url = new URL(calledUrl());
    expect(url.searchParams.get('sortByDueDate')).toBe('true');
    expect(url.searchParams.get('status')).toBe('TODO');
    expect(url.searchParams.get('priority')).toBe('HIGH');
    expect(url.searchParams.get('dueDateFrom')).toBe('2026-01-01T00:00:00.000Z');
    expect(url.searchParams.get('dueDateTo')).toBe('2026-01-31T23:59:59.999Z');
    expect(url.searchParams.get('q')).toBe('foo & bar/baz');
    expect(calledUrl()).toContain('q=foo+%26+bar%2Fbaz');
  });
});
