
import { User } from "@/types";

// Mock user data
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    email: "client@example.com",
    name: "Client User",
    role: "client",
    createdAt: new Date().toISOString(),
  },
];

// Initialize mock data in localStorage
const initializeMockData = () => {
  const storedUsers = localStorage.getItem('users');
  if (!storedUsers) {
    localStorage.setItem('users', JSON.stringify(mockUsers));
  }
};

// Initialize mock data
initializeMockData();

// Helper to get users from localStorage
const getUsersFromStorage = (): User[] => {
  const storedUsers = localStorage.getItem('users');
  return storedUsers ? JSON.parse(storedUsers) : [];
};

// Helper to save users to localStorage
const saveUsersToStorage = (users: User[]) => {
  localStorage.setItem('users', JSON.stringify(users));
};

export const userService = {
  // Get all users
  getUsers: async (): Promise<User[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return getUsersFromStorage();
  },

  // Get a specific user
  getUser: async (id: string): Promise<User | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const users = getUsersFromStorage();
    return users.find(user => user.id === id);
  },

  // Create a new user
  createUser: async (user: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    
    const users = getUsersFromStorage();
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    const updatedUsers = [...users, newUser];
    saveUsersToStorage(updatedUsers);
    
    return newUser;
  },

  // Update an existing user
  updateUser: async (id: string, updatedUser: Partial<User>): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const users = getUsersFromStorage();
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    const updatedUserList = [...users];
    updatedUserList[userIndex] = {
      ...updatedUserList[userIndex],
      ...updatedUser,
    };
    
    saveUsersToStorage(updatedUserList);
    
    return updatedUserList[userIndex];
  },

  // Delete a user
  deleteUser: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    const users = getUsersFromStorage();
    const updatedUsers = users.filter(user => user.id !== id);
    
    saveUsersToStorage(updatedUsers);
  },
};
