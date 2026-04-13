import React, { useState, useEffect } from 'react';
import { Task, CreateTaskDto, TaskStatus, TaskPriority } from '../types/task.types';
import './TaskForm.css';

interface TaskFormProps {
  task?: Task;
  onSubmit: (taskData: CreateTaskDto) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState<CreateTaskDto>({
    title: '',
    description: '',
    status: TaskStatus.TODO,
    priority: TaskPriority.MID,
    dueDate: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      });
    }
  }, [task]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const submitData: CreateTaskDto = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        priority: formData.priority,
      };

      if (formData.dueDate) {
        submitData.dueDate = new Date(formData.dueDate).toISOString();
      }

      onSubmit(submitData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h2>{task ? 'Edit Task' : 'Create New Task'}</h2>
      
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={errors.title ? 'error' : ''}
          disabled={isLoading}
          maxLength={200}
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={errors.description ? 'error' : ''}
          disabled={isLoading}
          maxLength={1000}
          rows={4}
        />
        {errors.description && <span className="error-message">{errors.description}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={isLoading}
          >
            <option value={TaskStatus.TODO}>To Do</option>
            <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
            <option value={TaskStatus.COMPLETED}>Completed</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            disabled={isLoading}
          >
            <option value={TaskPriority.LOW}>Low</option>
            <option value={TaskPriority.MID}>Medium</option>
            <option value={TaskPriority.HIGH}>High</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="dueDate">Due Date</label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} disabled={isLoading} className="btn-cancel">
          Cancel
        </button>
        <button type="submit" disabled={isLoading} className="btn-submit">
          {isLoading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
