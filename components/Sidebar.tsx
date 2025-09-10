"use client";
import { useState, useMemo } from 'react';
import { 
  Gamepad2, 
  BarChart3, 
  Settings, 
  Menu, 
  X, 
  LogOut, 
  User,
  Database,
  Clock,
  Users,
  ChevronDown,
  ChevronRight,
  CheckSquare
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const { user, logout, users } = useAuth();

  const baseMenuItems = [
    {
      id: 'games',
      label: 'Game Collection',
      icon: Gamepad2,
      description: 'Manage retro mobile games database'
    },
    {
      id: 'console',
      label: 'Console Collection',
      icon: Database,
      description: 'Physical device preservation'
    },
    {
      id: 'analytics',
      label: 'Research Analytics',
      icon: BarChart3,
      description: 'Historical analysis & insights'
    },
    {
      id: 'admin',
      label: 'System Administration',
      icon: Settings,
      description: 'System settings & configuration'
    },
    {
      id: 'approval',
      label: 'Approval Queue',
      icon: CheckSquare,
      description: 'Review user submissions'
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      description: 'Manage portal access'
    },
    {
      id: 'user-dashboard',
      label: 'My Dashboard',
      icon: User,
      description: 'View your submissions'
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: User,
      description: 'Update your profile settings'
    }
  ];

  const menuItems = useMemo(() => {
    if (!user) return [];

    let items;
    switch (user.role) {
      case 'admin':
        items = baseMenuItems.filter(item => item.id !== 'user-dashboard');
        // Sort alphabetically for admin
        return items.sort((a, b) => a.label.localeCompare(b.label));
      case 'researcher':
        return baseMenuItems.filter(item => 
          item.id === 'games' || item.id === 'console' || item.id === 'analytics' || item.id === 'profile'
        );
      case 'user':
        return baseMenuItems.filter(item => item.id === 'user-dashboard' || item.id === 'profile');
      default:
        return [];
    }
  }, [user]);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar - Keep Red */}
      <div className={`fixed left-0 top-0 h-full sidebar-bg z-50 transition-all duration-300 shadow-xl ${
        isCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'w-80 lg:w-80'
      }`}>
        
        {/* Header */}
        <div className="p-6 border-b border-red-700/30">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/30">
                  <Gamepad2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">RMGD</h2>
                  <p className="text-red-100 text-sm font-medium">Admin Portal</p>
                </div>
              </div>
            )}
            
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 text-red-100 hover:text-white hover:bg-white/10 rounded-lg transition-all lg:hidden"
            >
              {isCollapsed ? <Menu className="w-6 h-6" /> : <X className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* User Info */}
        {!isCollapsed && (
          <div className="p-4 border-b border-red-700/30">
            <div className="space-y-3">
              {/* Current User */}
              <div className="sidebar-card p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-medium text-white truncate">{user?.name || user?.email}</p>
                    <p className="text-sm text-red-100 capitalize">{user?.role} Access</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 group text-left ${
                activeTab === item.id
                  ? 'bg-white/20 text-white border border-white/30 shadow-lg'
                  : 'text-red-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className={`flex-shrink-0 ${
                activeTab === item.id ? 'text-white' : 'text-red-200 group-hover:text-white'
              }`}>
                <item.icon className="w-6 h-6" />
              </div>
              
              {!isCollapsed && (
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-base">{item.label}</span>
                  </div>
                  <p className="text-sm text-red-200 mt-1 leading-snug">{item.description}</p>
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className={`absolute bottom-0 w-full p-4 border-t border-red-700/30 ${isCollapsed ? 'hidden lg:block' : ''}`}>
           <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-3 p-3 text-red-100 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
            >
              <LogOut className="w-6 h-6" />
              {!isCollapsed && <span className="font-medium text-base">Logout</span>}
            </button>
        </div>

      </div>

      {/* Mobile Menu Button */}
      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="fixed top-4 left-4 z-40 p-3 bg-red-600 text-white rounded-xl border border-red-500 lg:hidden shadow-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}
    </>
  );
}