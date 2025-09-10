"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserAPI } from '@/services/api';

// This interface matches the data structure sent by your backend's mapUserKeys function
interface User {
  id: string;
  email: string;
  role: string;
  name: string;
  createdAt: string;
  lastLogin?: string;
  password?: string; // Optional: used only for password change forms
  status?: 'pending' | 'approved' | 'rejected'; // Added status
}

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  addUser: (userData: { Name: string, Email: string, Password?: string, Role: string, Status: string }) => Promise<boolean>; // Added Password and Status
  deleteUser: (userId: string) => Promise<boolean>;
  updateUser: (userId: string, userData: Partial<{ Name: string, Role: string, Password: string, Status: string }>) => Promise<boolean>; // Added Status
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

  // Fetches the full list of users for the User Management page
  const fetchAllUsers = async () => {
    try {
      const fetchedUsers = await UserAPI.getAllUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Failed to fetch user list:", error);
      setUsers([]); // Set to empty array on failure
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      // Check for a logged-in user in localStorage first
      const storedUser = localStorage.getItem('rmgd_admin_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      // Then fetch the latest user list for the admin panel
      await fetchAllUsers();
      setLoading(false);
    };
    initializeAuth();
  }, []);

  /**
   * Authenticates a user by calling the secure /login API endpoint.
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    const response = await UserAPI.login(email, password);
    
    // The API returns an object like { user: {...} } on success
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

  /**
   * Creates a new user and refreshes the local user list.
   */
  const addUser = async (userData: { Name: string, Email: string, Password?: string, Role: string, Status: string }): Promise<boolean> => {
    const newUser = await UserAPI.createUser(userData);
    if (newUser) {
      await fetchAllUsers(); // Refresh the list from the server
      return true;
    }
    return false;
  };

  /**
   * Deletes a user and refreshes the local user list.
   */
  const deleteUser = async (userId: string): Promise<boolean> => {
    const success = await UserAPI.deleteUser(userId);
    if (success) {
      await fetchAllUsers(); // Refresh the list
    }
    return success;
  };

  /**
   * Updates a user and refreshes the local user list.
   */
  const updateUser = async (userId: string, userData: Partial<{ Name: string, Role: string, Password: string, Status: string }>): Promise<boolean> => {
    const success = await UserAPI.updateUser(userId, userData);
    if (success) {
      await fetchAllUsers(); // Refresh the list
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