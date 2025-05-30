"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  // User management functions
  addUser: (userData: Omit<User, 'id' | 'createdAt'>) => boolean;
  deleteUser: (userId: string) => boolean;
  updateUser: (userId: string, userData: Partial<User>) => boolean;
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

// Default users
const defaultUsers: User[] = [
  {
    id: 'admin-001',
    email: 'admin@rmgd.org',
    role: 'admin',
    name: 'RMGD Administrator',
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: new Date().toISOString()
  }
];

// Default passwords (in production, this would be hashed)
const defaultPasswords: Record<string, string> = {
  'admin@rmgd.org': 'admin'
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(defaultUsers);
  const [passwords, setPasswords] = useState<Record<string, string>>(defaultPasswords);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load users and passwords from localStorage
    if (typeof window !== 'undefined') {
      const storedUsers = localStorage.getItem('rmgd_users');
      const storedPasswords = localStorage.getItem('rmgd_passwords');
      const storedCurrentUser = localStorage.getItem('rmgd_admin_user');

      if (storedUsers) {
        try {
          setUsers(JSON.parse(storedUsers));
        } catch (error) {
          console.error('Failed to load users:', error);
        }
      }

      if (storedPasswords) {
        try {
          setPasswords(JSON.parse(storedPasswords));
        } catch (error) {
          console.error('Failed to load passwords:', error);
        }
      }

      if (storedCurrentUser) {
        try {
          setUser(JSON.parse(storedCurrentUser));
        } catch (error) {
          localStorage.removeItem('rmgd_admin_user');
        }
      }
    }
    setLoading(false);
  }, []);

  // Save to localStorage whenever users or passwords change
  useEffect(() => {
    if (typeof window !== 'undefined' && !loading) {
      localStorage.setItem('rmgd_users', JSON.stringify(users));
      localStorage.setItem('rmgd_passwords', JSON.stringify(passwords));
    }
  }, [users, passwords, loading]);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = users.find(u => u.email === email);
    const storedPassword = passwords[email];
    
    if (foundUser && storedPassword === password) {
      // Update last login
      const updatedUser = {
        ...foundUser,
        lastLogin: new Date().toISOString()
      };
      
      setUser(updatedUser);
      
      // Update user in users array
      setUsers(prev => prev.map(u => u.id === foundUser.id ? updatedUser : u));
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('rmgd_admin_user', JSON.stringify(updatedUser));
      }
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rmgd_admin_user');
    }
  };

  const addUser = (userData: Omit<User, 'id' | 'createdAt'>): boolean => {
    try {
      // Check if email already exists
      if (users.find(u => u.email === userData.email)) {
        return false;
      }

      const newUser: User = {
        ...userData,
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString()
      };

      setUsers(prev => [...prev, newUser]);
      
      // Set default password (user should change this)
      setPasswords(prev => ({
        ...prev,
        [userData.email]: 'changeMe123'
      }));

      return true;
    } catch (error) {
      console.error('Failed to add user:', error);
      return false;
    }
  };

  const deleteUser = (userId: string): boolean => {
    try {
      const userToDelete = users.find(u => u.id === userId);
      if (!userToDelete) return false;

      // Don't allow deleting the currently logged-in user
      if (user?.id === userId) return false;

      // Don't allow deleting the main admin
      if (userToDelete.email === 'admin@rmgd.org') return false;

      setUsers(prev => prev.filter(u => u.id !== userId));
      
      // Remove password
      setPasswords(prev => {
        const newPasswords = { ...prev };
        delete newPasswords[userToDelete.email];
        return newPasswords;
      });

      return true;
    } catch (error) {
      console.error('Failed to delete user:', error);
      return false;
    }
  };

  const updateUser = (userId: string, userData: Partial<User>): boolean => {
    try {
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex === -1) return false;

      const updatedUser = { ...users[userIndex], ...userData };
      
      setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
      
      // If updating current user, update the current user state
      if (user?.id === userId) {
        setUser(updatedUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem('rmgd_admin_user', JSON.stringify(updatedUser));
        }
      }

      return true;
    } catch (error) {
      console.error('Failed to update user:', error);
      return false;
    }
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