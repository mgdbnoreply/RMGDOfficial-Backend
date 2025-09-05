// "use client";
// import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { UserAPI } from '@/services/api'; // Import the new UserAPI

// interface User {
//   id: string;
//   email: string;
//   role: string;
//   name: string;
//   createdAt: string;
//   lastLogin?: string;
// }

// interface AuthContextType {
//   user: User | null;
//   users: User[];
//   login: (email: string, password: string) => Promise<boolean>;
//   logout: () => void;
//   isAuthenticated: boolean;
//   loading: boolean;
//   // User management functions
//   addUser: (userData: Omit<User, 'id' | 'createdAt'>) => boolean;
//   deleteUser: (userId: string) => boolean;
//   updateUser: (userId: string, userData: Partial<User>) => boolean;
//   getAllUsers: () => User[];
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// interface AuthProviderProps {
//   children: ReactNode;
// }

// // Default users
// const defaultUsers: User[] = [
//   {
//     id: 'admin-001',
//     email: 'admin@rmgd.org',
//     role: 'admin',
//     name: 'RMGD Administrator',
//     createdAt: '2024-01-01T00:00:00Z',
//     lastLogin: new Date().toISOString()
//   },
//   {
//     id: 'researcher-001',
//     email: 'researcher@rmgd.org',
//     role: 'researcher',
//     name: 'RMGD Researcher',
//     createdAt: '2024-01-01T00:00:00Z',
//     lastLogin: new Date().toISOString()
//   },
//   {
//     id: 'user-001',
//     email: 'user@rmgd.org',
//     role: 'user',
//     name: 'Community Contributor',
//     createdAt: '2024-01-01T00:00:00Z',
//     lastLogin: new Date().toISOString()
//   }
// ];

// // Default passwords (in production, this would be hashed)
// const defaultPasswords: Record<string, string> = {
//   'admin@rmgd.org': 'admin',
//   'researcher@rmgd.org': 'researcher',
//   'user@rmgd.org': 'user'
// };

// export const AuthProvider = ({ children }: AuthProviderProps) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [users, setUsers] = useState<User[]>(defaultUsers);
//   const [passwords, setPasswords] = useState<Record<string, string>>(defaultPasswords);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Load users and passwords from localStorage
//     if (typeof window !== 'undefined') {
//       let storedUsers: User[] = [];
//       let storedPasswords: Record<string, string> = {};
//       const storedCurrentUser = localStorage.getItem('rmgd_admin_user');

//       try {
//         storedUsers = JSON.parse(localStorage.getItem('rmgd_users') || '[]');
//       } catch (error) { 
//         console.error('Failed to parse stored users, using defaults.');
//         storedUsers = [];
//       }
      
//       try {
//         storedPasswords = JSON.parse(localStorage.getItem('rmgd_passwords') || '{}');
//       } catch (error) {
//         console.error('Failed to parse stored passwords, using defaults.');
//         storedPasswords = {};
//       }

//       // Merge default users to ensure they always exist, preventing stale localStorage issues
//       const userMap = new Map(storedUsers.map(u => [u.email, u]));
//       defaultUsers.forEach(defaultUser => {
//           // Add default user if not present in storage
//           if (!userMap.has(defaultUser.email)) {
//               userMap.set(defaultUser.email, defaultUser);
//           }
//       });

//       const finalUsers = Array.from(userMap.values());
//       const finalPasswords = { ...defaultPasswords, ...storedPasswords };
      
//       setUsers(finalUsers);
//       setPasswords(finalPasswords);

//       if (storedCurrentUser) {
//         try {
//           setUser(JSON.parse(storedCurrentUser));
//         } catch (error) {
//           localStorage.removeItem('rmgd_admin_user');
//         }
//       }
//     }
//     setLoading(false);
//   }, []);

//   // Save to localStorage whenever users or passwords change
//   useEffect(() => {
//     if (typeof window !== 'undefined' && !loading) {
//       localStorage.setItem('rmgd_users', JSON.stringify(users));
//       localStorage.setItem('rmgd_passwords', JSON.stringify(passwords));
//     }
//   }, [users, passwords, loading]);

//   const login = async (email: string, password: string): Promise<boolean> => {
//     const foundUser = users.find(u => u.email === email);
//     const storedPassword = passwords[email];
    
//     if (foundUser && storedPassword === password) {
//       // Update last login
//       const updatedUser = {
//         ...foundUser,
//         lastLogin: new Date().toISOString()
//       };
      
//       setUser(updatedUser);
      
//       // Update user in users array
//       setUsers(prev => prev.map(u => u.id === foundUser.id ? updatedUser : u));
      
//       if (typeof window !== 'undefined') {
//         localStorage.setItem('rmgd_admin_user', JSON.stringify(updatedUser));
//       }
//       return true;
//     }
    
//     return false;
//   };

//   const logout = () => {
//     setUser(null);
//     if (typeof window !== 'undefined') {
//       localStorage.removeItem('rmgd_admin_user');
//     }
//   };

//   const addUser = (userData: Omit<User, 'id' | 'createdAt'>): boolean => {
//     try {
//       // Check if email already exists
//       if (users.find(u => u.email === userData.email)) {
//         return false;
//       }

//       const newUser: User = {
//         ...userData,
//         id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//         createdAt: new Date().toISOString()
//       };

//       setUsers(prev => [...prev, newUser]);
      
//       // Set default password (user should change this)
//       setPasswords(prev => ({
//         ...prev,
//         [userData.email]: 'changeMe123'
//       }));

//       return true;
//     } catch (error) {
//       return false;
//     }
//   };

//   const deleteUser = (userId: string): boolean => {
//     try {
//       const userToDelete = users.find(u => u.id === userId);
//       if (!userToDelete) return false;

//       // Don't allow deleting the currently logged-in user
//       if (user?.id === userId) return false;

//       // Don't allow deleting the main admin
//       if (userToDelete.email === 'admin@rmgd.org') return false;

//       setUsers(prev => prev.filter(u => u.id !== userId));
      
//       // Remove password
//       setPasswords(prev => {
//         const newPasswords = { ...prev };
//         delete newPasswords[userToDelete.email];
//         return newPasswords;
//       });

//       return true;
//     } catch (error) {
//       return false;
//     }
//   };

//   const updateUser = (userId: string, userData: Partial<User>): boolean => {
//     try {
//       const userIndex = users.findIndex(u => u.id === userId);
//       if (userIndex === -1) return false;

//       const updatedUser = { ...users[userIndex], ...userData };
      
//       setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
      
//       // If updating current user, update the current user state
//       if (user?.id === userId) {
//         setUser(updatedUser);
//         if (typeof window !== 'undefined') {
//           localStorage.setItem('rmgd_admin_user', JSON.stringify(updatedUser));
//         }
//       }

//       return true;
//     } catch (error) {
//       return false;
//     }
//   };

//   const getAllUsers = (): User[] => {
//     return users;
//   };

//   const value: AuthContextType = {
//     user,
//     users,
//     login,
//     logout,
//     isAuthenticated: !!user,
//     loading,
//     addUser,
//     deleteUser,
//     updateUser,
//     getAllUsers
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserAPI } from '@/services/api'; // Import the new UserAPI

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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all users from the API on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const fetchedUsers = await UserAPI.getAllUsers();
        setUsers(fetchedUsers);

        // Check for a logged-in user in localStorage
        const storedCurrentUser = localStorage.getItem('rmgd_admin_user');
        if (storedCurrentUser) {
          setUser(JSON.parse(storedCurrentUser));
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
        // Handle error, maybe show a message to the user
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);


  // Replace the old login function in RMGDOfficial-Backend/contexts/AuthContext.tsx with this

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const loggedInUser = await UserAPI.login(email, password);
      
      if (loggedInUser) {
        // The API successfully authenticated the user
        const updatedUser = { ...loggedInUser, lastLogin: new Date().toISOString() };
        setUser(updatedUser);
        
        // Update the user's "lastLogin" time in the main users list
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));

        if (typeof window !== 'undefined') {
          localStorage.setItem('rmgd_admin_user', JSON.stringify(updatedUser));
        }
        return true;
      }
      
      // The API returned null, meaning login failed (invalid credentials)
      return false;
    } catch (error) {
      console.error("Login process failed:", error);
      return false;
    }
  };
  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rmgd_admin_user');
    }
  };

  const addUser = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      const newUser = await UserAPI.createUser(userData);
      if (newUser) {
        setUsers(prev => [...prev, newUser]);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error adding user:", error);
      return false;
    }
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      const success = await UserAPI.deleteUser(userId);
      if (success) {
        setUsers(prev => prev.filter(u => u.id !== userId));
      }
      return success;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  };

  const updateUser = async (userId: string, userData: Partial<User>): Promise<boolean> => {
    try {
      const success = await UserAPI.updateUser(userId, userData);
      if (success) {
        const updatedUser = { ...users.find(u => u.id === userId)!, ...userData };
        setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
        
        if (user?.id === userId) {
          setUser(updatedUser);
          if (typeof window !== 'undefined') {
            localStorage.setItem('rmgd_admin_user', JSON.stringify(updatedUser));
          }
        }
      }
      return success;
    } catch (error) {
      console.error("Error updating user:", error);
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