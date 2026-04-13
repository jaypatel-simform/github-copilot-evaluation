import { Task, CreateTaskDto, UpdateTaskDto, ApiResponse } from '../types/task.types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

class TaskService {
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'An error occurred');
    }
    
    return data;
  }

  async getAllTasks(sortByDueDate?: boolean): Promise<ApiResponse<Task[]>> {
    const url = sortByDueDate 
      ? `${API_BASE_URL}/tasks?sortByDueDate=true`
      : `${API_BASE_URL}/tasks`;
    
    const response = await fetch(url);
    return this.handleResponse<Task[]>(response);
  }

  async getTaskById(id: string): Promise<ApiResponse<Task>> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
    return this.handleResponse<Task>(response);
  }

  async createTask(taskData: CreateTaskDto): Promise<ApiResponse<Task>> {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    return this.handleResponse<Task>(response);
  }

  async updateTask(id: string, updates: UpdateTaskDto): Promise<ApiResponse<Task>> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    return this.handleResponse<Task>(response);
  }

  async deleteTask(id: string): Promise<ApiResponse<void>> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    return this.handleResponse<void>(response);
  }
}

const taskServiceInstance = new TaskService();

export default taskServiceInstance;
