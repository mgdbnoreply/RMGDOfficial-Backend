"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserAPI } from '@/services/api';

interface User {
  id: string;
  email: string;
  role: string;
  name: string;
  createdAt: string;
  lastLogin?: string;
  password?: string;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  addUser: (userData: { Name: string, Email: string, Role: string }) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  updateUser: (userId: string, userData: Partial<{ Name: string, Role: string, Password: string }>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllUsers = async () => {
    try {
      const fetchedUsers = await UserAPI.getAllUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Failed to fetch user list:", error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      await fetchAllUsers();
      const storedUser = localStorage.getItem('rmgd_admin_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  /**
   * Handles login by fetching all users and checking credentials on the client-side.
   * NOTE: This is not a secure production pattern. Passwords should be validated on the server.
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    // The `users` state is populated by the `useEffect` hook.
    const foundUser = users.find(u => u.email === email);

    if (foundUser && foundUser.password === password) {
      const loggedInUser = { ...foundUser };
      delete loggedInUser.password; // Do not store the password in the active user state
      loggedInUser.lastLogin = new Date().toISOString();
      
      setUser(loggedInUser);
      localStorage.setItem('rmgd_admin_user', JSON.stringify(loggedInUser));
      return true;
    }

    console.error("Login failed: User not found or password incorrect.");
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('rmgd_admin_user');
  };

  const addUser = async (userData: { Name: string, Email: string, Role: string }): Promise<boolean> => {
    const newUser = await UserAPI.createUser(userData);
    if (newUser) {
      await fetchAllUsers();
      return true;
    }
    return false;
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    const success = await UserAPI.deleteUser(userId);
    if (success) {
      await fetchAllUsers();
    }
    return success;
  };

  const updateUser = async (userId: string, userData: Partial<{ Name: string, Role: string, Password: string }>): Promise<boolean> => {
    const success = await UserAPI.updateUser(userId, userData);
    if (success) {
      await fetchAllUsers();
    }
    return success;
  };

  const value = {
    user,
    users,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
    addUser,
    deleteUser,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

