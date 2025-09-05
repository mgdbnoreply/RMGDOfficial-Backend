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

// ==================== CORRECTED PASSWORD LIST ====================
// This now includes the correct credentials for your user.
const tempPasswords: Record<string, string> = {
  'parkar.ar@northeastern.edu': 'ib2026ib'
};
// =================================================================

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      console.log("AuthContext: Starting to initialize and fetch users...");
      try {
        const fetchedUsers = await UserAPI.getAllUsers();
        console.log("AuthContext: Raw data fetched from API:", fetchedUsers);
        setUsers(fetchedUsers);

        const storedCurrentUser = localStorage.getItem('rmgd_admin_user');
        if (storedCurrentUser) {
          setUser(JSON.parse(storedCurrentUser));
        }
      } catch (error) {
        console.error("AuthContext: An error occurred while fetching users.", error);
      } finally {
        setLoading(false);
        console.log("AuthContext: Initialization finished.");
      }
    };
    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log(`AuthContext: Attempting login for email: "${email}" with password: "${password}"`);
    console.log("AuthContext: Current state of users array:", users);

    const foundUser = users.find(u => u.email === email);
    
    if (foundUser) {
      console.log("AuthContext: User found in state:", foundUser);
    } else {
      console.error("AuthContext: User NOT found in state for email:", email);
    }

    const expectedPassword = tempPasswords[email];

    if (foundUser && expectedPassword === password) {
      console.log("AuthContext: Login successful! Password matches.");
      const updatedUser = { ...foundUser, lastLogin: new Date().toISOString() };
      setUser(updatedUser);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('rmgd_admin_user', JSON.stringify(updatedUser));
      }
      return true;
    }
    
    console.error("AuthContext: Login failed. User not found or password incorrect.");
    return false;
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rmgd_admin_user');
    }
  };

  // --- Placeholder User management functions ---
  // In RMGDOfficial-Backend/contexts/AuthContext.tsx, find and replace these functions

  const addUser = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<boolean> => {
    const newUser = await UserAPI.createUser(userData);
    if (newUser) {
      setUsers(prev => [...prev, newUser]);
      return true;
    }
    return false;
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    const success = await UserAPI.deleteUser(userId);
    if (success) {
      setUsers(prev => prev.filter(u => u.id !== userId));
    }
    return success;
  };

  const updateUser = async (userId: string, userData: Partial<User>): Promise<boolean> => {
    const success = await UserAPI.updateUser(userId, userData);
    if (success) {
      // Refetch all users to ensure the state is consistent
      const updatedUsers = await UserAPI.getAllUsers();
      setUsers(updatedUsers);
    }
    return success;
  };
  const getAllUsers = (): User[] => users;

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