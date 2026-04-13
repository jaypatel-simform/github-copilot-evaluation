import React from 'react';
import { Task, TaskStatus, TaskPriority } from '../types/task.types';
import './TaskItem.css';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusClass = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return 'status-todo';
      case TaskStatus.IN_PROGRESS:
        return 'status-progress';
      case TaskStatus.COMPLETED:
        return 'status-completed';
      default:
        return '';
    }
  };

  const getPriorityClass = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return 'priority-high';
      case TaskPriority.MID:
        return 'priority-mid';
      case TaskPriority.LOW:
        return 'priority-low';
      default:
        return '';
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      onDelete(task.id);
    }
  };

  const isCompleted = task.status === TaskStatus.COMPLETED;

  return (
    <div className={`task-item ${getStatusClass(task.status)}`}>
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <div className="task-badges">
          <span className={`badge priority ${getPriorityClass(task.priority)}`}>
            {task.priority}
          </span>
          <span className={`badge status ${getStatusClass(task.status)}`}>
            {task.status.replace('_', ' ')}
          </span>
        </div>
      </div>
      
      <p className="task-description">{task.description}</p>
      
      <div className="task-meta">
        <div className="task-dates">
          <span className="meta-item">
            <strong>Created:</strong> {formatDate(task.createdAt)}
          </span>
          {task.dueDate && (
            <span className="meta-item">
              <strong>Due:</strong> {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      <div className="task-actions">
        {!isCompleted && (
          <div className="status-buttons">
            {task.status !== TaskStatus.TODO && (
              <button 
                onClick={() => onStatusChange(task.id, TaskStatus.TODO)}
                className="btn btn-small"
              >
                Mark as To Do
              </button>
            )}
            {task.status !== TaskStatus.IN_PROGRESS && (
              <button 
                onClick={() => onStatusChange(task.id, TaskStatus.IN_PROGRESS)}
                className="btn btn-small"
              >
                Mark as In Progress
              </button>
            )}
            {task.status !== TaskStatus.COMPLETED && (
              <button 
                onClick={() => onStatusChange(task.id, TaskStatus.COMPLETED)}
                className="btn btn-small btn-success"
              >
                Mark as Completed
              </button>
            )}
          </div>
        )}
        
        <div className="action-buttons">
          {!isCompleted && (
            <button onClick={() => onEdit(task)} className="btn btn-edit">
              Edit
            </button>
          )}
          <button onClick={handleDelete} className="btn btn-delete">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
