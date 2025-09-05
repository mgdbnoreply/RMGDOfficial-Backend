"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserAPI } from '@/services/api'; // We still need the API to get user data

interface User {
  id: string;
  email: string;
  role: string;
  name: string;
  createdAt: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  addUser: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  updateUser: (userId: string, userData: Partial<User>) => Promise<boolean>;
  getAllUsers: () => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// ==================== NEW CODE STARTS HERE ====================
// TEMPORARY: A client-side dictionary for passwords.
// This is NOT secure for production but will allow you to log in.
const tempPasswords: Record<string, string> = {
  'admin@rmgd.org': 'admin',
  'researcher@rmgd.org': 'researcher',
  'user@rmgd.org': 'user'
};
// ==================== NEW CODE ENDS HERE ====================


export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const fetchedUsers = await UserAPI.getAllUsers();
        setUsers(fetchedUsers);

        const storedCurrentUser = localStorage.getItem('rmgd_admin_user');
        if (storedCurrentUser) {
          setUser(JSON.parse(storedCurrentUser));
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  // ==================== UPDATED LOGIN FUNCTION ====================
  const login = async (email: string, password: string): Promise<boolean> => {
    // Step 1: Find the user by email from the list fetched from the API.
    const foundUser = users.find(u => u.email === email);

    // Step 2: Check the password against our temporary password dictionary.
    const expectedPassword = tempPasswords[email];

    if (foundUser && expectedPassword === password) {
      // If both user exists and password is correct, login is successful.
      const updatedUser = { ...foundUser, lastLogin: new Date().toISOString() };
      setUser(updatedUser);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('rmgd_admin_user', JSON.stringify(updatedUser));
      }
      return true;
    }
    
    // If user is not found or password does not match, login fails.
    return false;
  };
  // =============================================================

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rmgd_admin_user');
    }
  };

  // --- User management functions (to be implemented later) ---
  const addUser = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<boolean> => {
    console.warn("Add User functionality is not yet connected to a backend POST endpoint.");
    return false;
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    console.warn("Delete User functionality is not yet connected to a backend DELETE endpoint.");
    return false;
  };

  const updateUser = async (userId: string, userData: Partial<User>): Promise<boolean> => {
    console.warn("Update User functionality is not yet connected to a backend PUT endpoint.");
    return false;
  };
  
  const getAllUsers = (): User[] => {
    return users;
  };

  const value: AuthContextType = {
    user,
    users,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
    addUser,
    deleteUser,
    updateUser,
    getAllUsers
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};