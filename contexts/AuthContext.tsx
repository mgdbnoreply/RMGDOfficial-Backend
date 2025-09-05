"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// NOTE: The UserAPI has been removed as there is no deployed /users endpoint.
// User management is now handled on the client-side with localStorage.

interface User {
  UserID: string;
  Email: string;
  Role: string;
  Name: string;
  CreatedAt: string;
  LastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  // User management functions
  addUser: (userData: Omit<User, 'UserID' | 'CreatedAt'>) => Promise<boolean>;
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

// Initial default users, including the one from your CSV.
const defaultUsers: User[] = [
  {
    UserID: '001',
    Email: 'parkar.ar@northeastern.edu',
    Name: 'Arslan Parkar',
    Role: 'admin',
    CreatedAt: '2024-01-01T00:00:00Z',
  },
  {
    UserID: 'researcher-001',
    Email: 'researcher@rmgd.org',
    Name: 'RMGD Researcher',
    Role: 'researcher',
    CreatedAt: '2024-01-01T00:00:00Z',
  },
  {
    UserID: 'user-001',
    Email: 'user@rmgd.org',
    Name: 'Community Contributor',
    Role: 'user',
    CreatedAt: '2024-01-01T00:00:00Z',
  }
];

// Mock password store, including the password from your CSV.
const MOCK_PASSWORDS: Record<string, string> = {
  'parkar.ar@northeastern.edu': 'ib2026ib',
  'researcher@rmgd.org': 'researcher',
  'user@rmgd.org': 'user'
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Load state from localStorage on initial render
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem('rmgd_users');
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      } else {
        setUsers(defaultUsers); // Initialize with defaults if nothing is stored
      }

      const storedUser = sessionStorage.getItem('rmgd_admin_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse from storage, using defaults.", error);
      setUsers(defaultUsers);
    } finally {
      setLoading(false);
    }
  }, []);

  // Persist users to localStorage whenever the users state changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('rmgd_users', JSON.stringify(users));
    }
  }, [users, loading]);


  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = users.find(u => u.Email === email);
    const correctPassword = MOCK_PASSWORDS[email];

    if (foundUser && correctPassword === password) {
      const updatedUser = {
        ...foundUser,
        LastLogin: new Date().toISOString()
      };
      
      setUser(updatedUser);
      sessionStorage.setItem('rmgd_admin_user', JSON.stringify(updatedUser));
      // Also update the user in our main users list
      setUsers(currentUsers => currentUsers.map(u => u.UserID === foundUser.UserID ? updatedUser : u));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('rmgd_admin_user');
  };

  const addUser = async (userData: Omit<User, 'UserID' | 'CreatedAt'>): Promise<boolean> => {
    return new Promise((resolve) => {
      if (users.find(u => u.Email === userData.Email)) {
        console.error("User with this email already exists.");
        resolve(false);
        return;
      }

      const newUser: User = {
        ...userData,
        UserID: `user-${Date.now()}`,
        CreatedAt: new Date().toISOString(),
      };

      setUsers(prev => [...prev, newUser]);
      // Note: You would need a system to manage passwords for new users.
      // For this mock, we'll just log a note.
      console.log(`User ${newUser.Email} created. Set a mock password if needed for testing.`);
      resolve(true);
    });
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
     return new Promise((resolve) => {
        if (user?.UserID === userId) {
            console.error("Cannot delete the currently logged-in user.");
            resolve(false);
            return;
        }
        setUsers(prev => prev.filter(u => u.UserID !== userId));
        resolve(true);
    });
  };

  const updateUser = async (userId: string, userData: Partial<User>): Promise<boolean> => {
    return new Promise((resolve) => {
        setUsers(prevUsers => prevUsers.map(u => 
            u.UserID === userId ? { ...u, ...userData } : u
        ));
        
        if (user?.UserID === userId) {
            const updatedCurrentUser = { ...user, ...userData };
            setUser(updatedCurrentUser);
            sessionStorage.setItem('rmgd_admin_user', JSON.stringify(updatedCurrentUser));
        }
        resolve(true);
    });
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
