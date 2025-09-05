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
  password?: string; // For password change forms
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
      await fetchAllUsers(); // Fetch users for the management page
      const storedUser = localStorage.getItem('rmgd_admin_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const response = await UserAPI.login(email, password);
    if (response && response.user) {
      const loggedInUser = { ...response.user, lastLogin: new Date().toISOString() };
      setUser(loggedInUser);
      localStorage.setItem('rmgd_admin_user', JSON.stringify(loggedInUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('rmgd_admin_user');
  };

  const addUser = async (userData: { Name: string, Email: string, Role: string }): Promise<boolean> => {
    const newUser = await UserAPI.createUser(userData);
    if (newUser) {
      await fetchAllUsers(); // Refresh the user list
      return true;
    }
    return false;
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    const success = await UserAPI.deleteUser(userId);
    if (success) {
      await fetchAllUsers(); // Refresh the user list
    }
    return success;
  };

  const updateUser = async (userId: string, userData: Partial<{ Name: string, Role: string, Password: string }>): Promise<boolean> => {
    const success = await UserAPI.updateUser(userId, userData);
    if (success) {
      await fetchAllUsers(); // Refresh the user list
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
