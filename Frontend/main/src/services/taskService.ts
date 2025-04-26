
import { Task } from "@/types";

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
  getTasks: async (): Promise<Task[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return getTasksFromStorage();
  },

  // Get a specific task
  getTask: async (id: string): Promise<Task | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const tasks = getTasksFromStorage();
    return tasks.find(task => task.id === id);
  },

  // Create a new task
  createTask: async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    
    const tasks = getTasksFromStorage();
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedTasks = [...tasks, newTask];
    saveTasksToStorage(updatedTasks);
    
    return newTask;
  },

  // Update an existing task
  updateTask: async (id: string, updatedTask: Partial<Task>): Promise<Task> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const tasks = getTasksFromStorage();
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    const updatedTaskList = [...tasks];
    updatedTaskList[taskIndex] = {
      ...updatedTaskList[taskIndex],
      ...updatedTask,
      updatedAt: new Date().toISOString(),
    };
    
    saveTasksToStorage(updatedTaskList);
    
    return updatedTaskList[taskIndex];
  },

  // Delete a task
  deleteTask: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    const tasks = getTasksFromStorage();
    const updatedTasks = tasks.filter(task => task.id !== id);
    
    saveTasksToStorage(updatedTasks);
  },
};
