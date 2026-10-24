import React, { useState, useEffect, useRef } from 'react';
import { Task, CreateTaskDto, UpdateTaskDto, TaskStatus, TaskQueryParams } from '../types/task.types';
import taskService from '../services/taskService';
import TaskForm from './TaskForm';
import TaskItem from './TaskItem';
import TaskFilters, { TaskFilterValues, EMPTY_FILTERS } from './TaskFilters';
import './TaskList.css';

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [sortByDueDate, setSortByDueDate] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [filters, setFilters] = useState<TaskFilterValues>(EMPTY_FILTERS);
  const requestIdRef = useRef(0);

  const dateRangeError =
    filters.dueDateFrom && filters.dueDateTo && filters.dueDateFrom > filters.dueDateTo
      ? '"From" date must be on or before the "To" date'
      : null;

  const hasActiveFilters = !!(
    filters.status ||
    filters.priority ||
    filters.dueDateFrom ||
    filters.dueDateTo ||
    filters.q.trim()
  );

  // Convert a YYYY-MM-DD value to the start/end of that local day as an ISO string,
  // so the backend's inclusive range covers the whole selected day(s).
  const toLocalDayBoundary = (value: string, endOfDay: boolean): string => {
    const [y, m, d] = value.split('-').map(Number);
    const date = endOfDay
      ? new Date(y, m - 1, d, 23, 59, 59, 999)
      : new Date(y, m - 1, d, 0, 0, 0, 0);
    return date.toISOString();
  };

  const buildParams = (): TaskQueryParams => {
    const params: TaskQueryParams = { sortByDueDate };
    if (filters.status) params.status = filters.status;
    if (filters.priority) params.priority = filters.priority;
    if (filters.dueDateFrom) params.dueDateFrom = toLocalDayBoundary(filters.dueDateFrom, false);
    if (filters.dueDateTo) params.dueDateTo = toLocalDayBoundary(filters.dueDateTo, true);
    if (filters.q.trim()) params.q = filters.q.trim();
    return params;
  };

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sortByDueDate,
    filters.status,
    filters.priority,
    filters.dueDateFrom,
    filters.dueDateTo,
    filters.q,
  ]);

  const loadTasks = async () => {
    // Invalid date range: don't call the API (the backend would answer 400).
    if (dateRangeError) {
      requestIdRef.current += 1; // invalidate any in-flight request
      setLoading(false);
      return;
    }

    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const response = await taskService.getAllTasks(buildParams());
      if (requestId !== requestIdRef.current) return;
      if (response.success && response.data) {
        setTasks(response.data);
      }
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  const handleFilterChange = (partial: Partial<TaskFilterValues>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const handleClearFilters = () => {
    setFilters(EMPTY_FILTERS);
  };

  const handleCreateTask = async (taskData: CreateTaskDto) => {
    setFormLoading(true);
    setError(null);
    try {
      const response = await taskService.createTask(taskData);
      if (response.success) {
        await loadTasks();
        setShowForm(false);
        setEditingTask(undefined);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateTask = async (taskData: CreateTaskDto) => {
    if (!editingTask) return;
    
    setFormLoading(true);
    setError(null);
    try {
      const updateData: UpdateTaskDto = taskData;
      const response = await taskService.updateTask(editingTask.id, updateData);
      if (response.success) {
        await loadTasks();
        setShowForm(false);
        setEditingTask(undefined);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    setError(null);
    try {
      const response = await taskService.deleteTask(id);
      if (response.success) {
        await loadTasks();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  const handleStatusChange = async (id: string, status: TaskStatus) => {
    setError(null);
    try {
      const response = await taskService.updateTask(id, { status });
      if (response.success) {
        await loadTasks();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task status');
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(undefined);
  };

  const handleNewTask = () => {
    setEditingTask(undefined);
    setShowForm(true);
  };

  const getTaskCounts = () => {
    return {
      total: tasks.length,
      todo: tasks.filter(t => t.status === TaskStatus.TODO).length,
      inProgress: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
      completed: tasks.filter(t => t.status === TaskStatus.COMPLETED).length,
    };
  };

  const counts = getTaskCounts();

  return (
    <div className="task-list-container">
      <header className="app-header">
        <h1>Task Management</h1>
        <p className="subtitle">Manage your tasks efficiently</p>
      </header>

      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {!showForm && (
        <>
          <div className="task-stats">
            <div className="stat-card">
              <div className="stat-value">{counts.total}</div>
              <div className="stat-label">Total Tasks</div>
            </div>
            <div className="stat-card todo">
              <div className="stat-value">{counts.todo}</div>
              <div className="stat-label">To Do</div>
            </div>
            <div className="stat-card progress">
              <div className="stat-value">{counts.inProgress}</div>
              <div className="stat-label">In Progress</div>
            </div>
            <div className="stat-card completed">
              <div className="stat-value">{counts.completed}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>

          <TaskFilters
            filters={filters}
            onChange={handleFilterChange}
            onClear={handleClearFilters}
            dateRangeError={dateRangeError}
          />

          <div className="controls">
            <button onClick={handleNewTask} className="btn btn-primary">
              + New Task
            </button>
            
            <div className="sort-controls">
              <label>
                <input
                  type="checkbox"
                  checked={sortByDueDate}
                  onChange={(e) => setSortByDueDate(e.target.checked)}
                />
                Sort by Due Date
              </label>
              <button onClick={loadTasks} className="btn btn-refresh" disabled={loading}>
                {loading ? 'Refreshing...' : '↻ Refresh'}
              </button>
            </div>
          </div>

          <div className="tasks-container">
            {loading && tasks.length === 0 ? (
              <div className="loading">Loading tasks...</div>
            ) : dateRangeError ? null : tasks.length === 0 ? (
              <div className="empty-state">
                {hasActiveFilters ? (
                  <>
                    <p>No tasks match your filters</p>
                    <p>Try changing or clearing the filters.</p>
                  </>
                ) : (
                  <p>No tasks yet. Create your first task to get started!</p>
                )}
              </div>
            ) : (
              <div className="task-list">
                {tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onEdit={handleEdit}
                    onDelete={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={handleCancelForm}
          isLoading={formLoading}
        />
      )}
    </div>
  );
};

export default TaskList;
