import axios from 'axios';
import { Task } from "@/types";

const API_URL = 'http://localhost:5137/api/todoapi';

// Mock task data
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Create project plan",
    description: "Outline the project scope, goals, and timeline",
    status: "todo",
    priority: "high",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    assignedTo: "1",
    createdBy: "1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Research competitors",
    description: "Analyze key competitors and their strategies",
    status: "in-progress",
    priority: "medium",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    assignedTo: "1",
    createdBy: "1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Design wireframes",
    description: "Create initial UI/UX wireframes for the application",
    status: "completed",
    priority: "medium",
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    assignedTo: "1",
    createdBy: "1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// In a real application, these functions would make API calls
// For now, we'll use localStorage to persist the mock data
const initializeMockData = () => {
  const storedTasks = localStorage.getItem('tasks');
  if (!storedTasks) {
    localStorage.setItem('tasks', JSON.stringify(mockTasks));
  }
};

// Initialize mock data
initializeMockData();

// Helper to get tasks from localStorage
const getTasksFromStorage = (): Task[] => {
  const storedTasks = localStorage.getItem('tasks');
  return storedTasks ? JSON.parse(storedTasks) : [];
};

// Helper to save tasks to localStorage
const saveTasksToStorage = (tasks: Task[]) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

export const taskService = {
  // Get all tasks
  async getTasks(): Promise<Task[]> {
    const response = await axios.get(`${API_URL}`);
    return response.data.map((todo: any) => ({
      id: todo.id.toString(),
      title: todo.title,
      description: todo.details || '',
      status: todo.isDone ? 'completed' : 'todo',
      priority: 'medium', // Default as ToDo model doesn't have priority
      dueDate: todo.date,
      assignedTo: null, // ToDo model doesn't have assignedTo
      createdBy: '1', // Default as ToDo model doesn't have createdBy
      createdAt: todo.date,
      updatedAt: todo.date
    }));
  },

  // Get a specific task
  async getTask(id: string): Promise<Task> {
    const response = await axios.get(`${API_URL}/${id}`);
    const todo = response.data;
    return {
      id: todo.id.toString(),
      title: todo.title,
      description: todo.details || '',
      status: todo.isDone ? 'completed' : 'todo',
      priority: 'medium',
      dueDate: todo.date,
      assignedTo: null,
      createdBy: '1',
      createdAt: todo.date,
      updatedAt: todo.date
    };
  },

  // Create a new task
  async createTask(task: Partial<Task>): Promise<Task> {
    const todoToCreate = {
      title: task.title || '',
      details: task.description || '',
      date: task.dueDate || new Date().toISOString(),
      isDone: task.status === 'completed'
    };
    
    try {
      const response = await axios.post(`${API_URL}`, todoToCreate);
      const createdTodo = response.data;
      
      return {
        id: createdTodo.id.toString(),
        title: createdTodo.title,
        description: createdTodo.details || '',
        status: createdTodo.isDone ? 'completed' : 'todo',
        priority: task.priority || 'medium',
        dueDate: createdTodo.date,
        assignedTo: task.assignedTo || null,
        createdBy: task.createdBy || '1',
        createdAt: createdTodo.date,
        updatedAt: createdTodo.date
      };
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Update an existing task
  async updateTask(id: string, task: Partial<Task>): Promise<void> {
    const todoToUpdate = {
      id: parseInt(id),
      title: task.title,
      details: task.description,
      date: task.dueDate || new Date().toISOString(),
      isDone: task.status === 'completed'
    };
    await axios.put(`${API_URL}/${id}`, todoToUpdate);
  },

  // Delete a task
  async deleteTask(id: string): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  }
};
