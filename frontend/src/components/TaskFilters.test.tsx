import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import TaskFilters, { EMPTY_FILTERS, TaskFilterValues } from './TaskFilters';

const setup = (overrides: Partial<TaskFilterValues> = {}, props: any = {}) => {
  const onChange = jest.fn();
  const onClear = jest.fn();
  const utils = render(
    <TaskFilters
      filters={{ ...EMPTY_FILTERS, ...overrides }}
      onChange={onChange}
      onClear={onClear}
      {...props}
    />
  );
  return { onChange, onClear, ...utils };
};

describe('TaskFilters', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('debounces the search input (one onChange after 300ms)', () => {
    const { onChange } = setup();
    const input = screen.getByLabelText('Search');

    fireEvent.change(input, { target: { value: 'f' } });
    act(() => { jest.advanceTimersByTime(100); });
    fireEvent.change(input, { target: { value: 'fo' } });
    act(() => { jest.advanceTimersByTime(100); });
    fireEvent.change(input, { target: { value: 'foo' } });

    expect(onChange).not.toHaveBeenCalled();
    act(() => { jest.advanceTimersByTime(299); });
    expect(onChange).not.toHaveBeenCalled();
    act(() => { jest.advanceTimersByTime(1); });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({ q: 'foo' });
  });

  it('reports status, priority and date changes immediately', () => {
    const { onChange } = setup();

    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'IN_PROGRESS' } });
    expect(onChange).toHaveBeenLastCalledWith({ status: 'IN_PROGRESS' });

    fireEvent.change(screen.getByLabelText('Priority'), { target: { value: 'HIGH' } });
    expect(onChange).toHaveBeenLastCalledWith({ priority: 'HIGH' });

    fireEvent.change(screen.getByLabelText('Due from'), { target: { value: '2026-01-05' } });
    expect(onChange).toHaveBeenLastCalledWith({ dueDateFrom: '2026-01-05' });

    fireEvent.change(screen.getByLabelText('Due to'), { target: { value: '2026-01-10' } });
    expect(onChange).toHaveBeenLastCalledWith({ dueDateTo: '2026-01-10' });
  });

  it('offers the expected options', () => {
    setup();
    const status = screen.getByLabelText('Status');
    const priority = screen.getByLabelText('Priority');
    expect(Array.from(status.querySelectorAll('option')).map(o => o.textContent)).toEqual([
      'All', 'TODO', 'IN_PROGRESS', 'COMPLETED',
    ]);
    expect(Array.from(priority.querySelectorAll('option')).map(o => o.textContent)).toEqual([
      'All', 'HIGH', 'MID', 'LOW',
    ]);
  });

  it('disables Clear when nothing is active', () => {
    setup();
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeDisabled();
  });

  it('Clear calls onClear, empties the search box and cancels the pending debounce', () => {
    const { onChange, onClear } = setup({ status: 'TODO' as any });
    const input = screen.getByLabelText('Search') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'abc' } });
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));

    expect(onClear).toHaveBeenCalledTimes(1);
    expect(input.value).toBe('');
    act(() => { jest.advanceTimersByTime(500); });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('resets the search box when filters.q is cleared externally', () => {
    const { rerender, onChange, onClear } = setup({ q: 'foo' });
    const input = screen.getByLabelText('Search') as HTMLInputElement;
    expect(input.value).toBe('foo');

    rerender(
      <TaskFilters filters={EMPTY_FILTERS} onChange={onChange} onClear={onClear} />
    );
    expect(input.value).toBe('');
  });

  it('renders the date range error', () => {
    setup({}, { dateRangeError: 'Bad range' });
    expect(screen.getByRole('alert')).toHaveTextContent('Bad range');
  });
});
