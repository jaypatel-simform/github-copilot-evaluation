import React, { useEffect, useState } from 'react';
import { TaskStatus, TaskPriority } from '../types/task.types';
import './TaskFilters.css';

export interface TaskFilterValues {
  status: TaskStatus | '';
  priority: TaskPriority | '';
  dueDateFrom: string;
  dueDateTo: string;
  q: string;
}

export const EMPTY_FILTERS: TaskFilterValues = {
  status: '',
  priority: '',
  dueDateFrom: '',
  dueDateTo: '',
  q: '',
};

export const SEARCH_DEBOUNCE_MS = 300;

interface TaskFiltersProps {
  filters: TaskFilterValues;
  onChange: (partial: Partial<TaskFilterValues>) => void;
  onClear: () => void;
  dateRangeError?: string | null;
  disabled?: boolean;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  onChange,
  onClear,
  dateRangeError,
  disabled = false,
}) => {
  const [searchInput, setSearchInput] = useState(filters.q);

  // Debounce the search text before reporting it to the parent.
  useEffect(() => {
    if (searchInput === filters.q) {
      return;
    }
    const timer = setTimeout(() => {
      onChange({ q: searchInput });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  // When the parent clears the search (e.g. "Clear filters"), reset the input.
  useEffect(() => {
    if (filters.q === '') {
      setSearchInput('');
    }
  }, [filters.q]);

  const handleClear = () => {
    // Reset the local input too, which also cancels any pending debounce.
    setSearchInput('');
    onClear();
  };

  const hasActiveFilters = !!(
    filters.status ||
    filters.priority ||
    filters.dueDateFrom ||
    filters.dueDateTo ||
    filters.q.trim() ||
    searchInput.trim()
  );

  return (
    <div className="task-filters">
      <div className="filter-bar">
        <div className="filter-field">
          <label htmlFor="filter-status">Status</label>
          <select
            id="filter-status"
            value={filters.status}
            disabled={disabled}
            onChange={(e) => onChange({ status: e.target.value as TaskStatus | '' })}
          >
            <option value="">All</option>
            <option value={TaskStatus.TODO}>TODO</option>
            <option value={TaskStatus.IN_PROGRESS}>IN_PROGRESS</option>
            <option value={TaskStatus.COMPLETED}>COMPLETED</option>
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="filter-priority">Priority</label>
          <select
            id="filter-priority"
            value={filters.priority}
            disabled={disabled}
            onChange={(e) => onChange({ priority: e.target.value as TaskPriority | '' })}
          >
            <option value="">All</option>
            <option value={TaskPriority.HIGH}>HIGH</option>
            <option value={TaskPriority.MID}>MID</option>
            <option value={TaskPriority.LOW}>LOW</option>
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="filter-due-from">Due from</label>
          <input
            id="filter-due-from"
            type="date"
            value={filters.dueDateFrom}
            disabled={disabled}
            onChange={(e) => onChange({ dueDateFrom: e.target.value })}
          />
        </div>

        <div className="filter-field">
          <label htmlFor="filter-due-to">Due to</label>
          <input
            id="filter-due-to"
            type="date"
            value={filters.dueDateTo}
            disabled={disabled}
            onChange={(e) => onChange({ dueDateTo: e.target.value })}
          />
        </div>

        <div className="filter-field filter-search">
          <label htmlFor="filter-search">Search</label>
          <input
            id="filter-search"
            type="search"
            placeholder="Search title or description"
            maxLength={100}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className="filter-field filter-actions">
          <button
            type="button"
            className="filter-clear-btn"
            onClick={handleClear}
            disabled={!hasActiveFilters}
          >
            Clear filters
          </button>
        </div>
      </div>

      {dateRangeError && (
        <p role="alert" className="filter-error">
          {dateRangeError}
        </p>
      )}
    </div>
  );
};

export default TaskFilters;
