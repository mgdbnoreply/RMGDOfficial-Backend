"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserAPI } from '@/services/api';

// Defines the structure of a User object throughout the application.
interface User {
  id: string;
  email: string;
  role: string;
  name: string;
  createdAt: string;
  lastLogin?: string;
  password?: string; // Included for type safety in password change forms
}

// Defines the shape of the data and functions provided by the AuthContext.
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

// Create the React Context.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Custom hook to easily access the authentication context in any component.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Provides authentication state and functions to its children components.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetches all users from the API and updates the state.
   * This is used to populate the user management page.
   */
  const fetchAllUsers = async () => {
    try {
      const fetchedUsers = await UserAPI.getAllUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Failed to fetch user list:", error);
    }
  };

  // On initial application load, check for a persisted session and fetch all users.
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
   * Handles the login process by calling the backend API.
   * On success, it sets the user state and persists the session.
   */
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

  /**
   * Clears the user session from state and local storage.
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('rmgd_admin_user');
  };

  /**
   * Creates a new user via the API and refreshes the local user list.
   */
  const addUser = async (userData: { Name: string, Email: string, Role: string }): Promise<boolean> => {
    const newUser = await UserAPI.createUser(userData);
    if (newUser) {
      await fetchAllUsers(); // Refresh the list from the server
      return true;
    }
    return false;
  };

  /**
   * Deletes a user via the API and refreshes the local user list.
   */
  const deleteUser = async (userId: string): Promise<boolean> => {
    const success = await UserAPI.deleteUser(userId);
    if (success) {
      await fetchAllUsers(); // Refresh the list
    }
    return success;
  };

  /**
   * Updates a user's details via the API and refreshes the local user list.
   */
  const updateUser = async (userId: string, userData: Partial<{ Name: string, Role: string, Password: string }>): Promise<boolean> => {
    const success = await UserAPI.updateUser(userId, userData);
    if (success) {
      await fetchAllUsers(); // Refresh the list
    }
    return success;
  };

  // The value provided to consuming components.
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

