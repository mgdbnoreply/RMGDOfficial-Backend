"use client";
import { useState } from 'react';
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
  ChevronRight
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

  const menuItems = [
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
      description: 'Physical device preservation',
      comingSoon: true
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
    }
  ];

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

              {/* User Management Toggle */}
              <button
                onClick={() => setShowUserManagement(!showUserManagement)}
                className="w-full flex items-center justify-between p-3 text-red-100 hover:text-white hover:bg-white/10 rounded-xl transition-all"
              >
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5" />
                  <span className="text-base font-medium">User Management</span>
                </div>
                {showUserManagement ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {/* User List */}
              {showUserManagement && (
                <div className="ml-8 space-y-2">
                  <div className="text-xs text-red-200 font-medium mb-2 uppercase tracking-wide">
                    Active Users ({users.length})
                  </div>
                  {users.map((u) => (
                    <div key={u.id} className="flex items-center space-x-2 p-2 bg-white/10 rounded-lg">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                        <User className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{u.name}</p>
                        <p className="text-xs text-red-200 truncate">{u.email}</p>
                      </div>
                      {u.id === user?.id && (
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => setActiveTab('users')}
                    className="w-full p-2 text-sm text-red-200 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  >
                    Manage Users →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => !item.comingSoon && setActiveTab(item.id)}
              disabled={item.comingSoon}
              className={`w-full flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 group text-left ${
                activeTab === item.id
                  ? 'bg-white/20 text-white border border-white/30 shadow-lg'
                  : item.comingSoon
                  ? 'text-red-300 cursor-not-allowed opacity-60'
                  : 'text-red-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className={`flex-shrink-0 ${
                activeTab === item.id ? 'text-white' : item.comingSoon ? 'text-red-400' : 'text-red-200 group-hover:text-white'
              }`}>
                <item.icon className="w-6 h-6" />
              </div>
              
              {!isCollapsed && (
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-base">{item.label}</span>
                    {item.comingSoon && (
                      <span className="px-2 py-1 text-xs bg-amber-500/20 text-amber-200 rounded-full border border-amber-500/30">
                        Soon
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-red-200 mt-1 leading-snug">{item.description}</p>
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-red-700/30">
            <div className="space-y-3">
              {/* Status */}
              <div className="sidebar-card p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-base text-white font-medium">Database Online</span>
                  </div>
                  <Clock className="w-5 h-5 text-green-400" />
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 p-3 text-red-100 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium text-base">Logout</span>
              </button>
            </div>
          </div>
        )}

        {/* Collapsed Mode Toggle */}
        {isCollapsed && (
          <div className="p-4 border-t border-red-700/30 hidden lg:block">
            <button
              onClick={() => setIsCollapsed(false)}
              className="w-full p-3 text-red-100 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            >
              <Menu className="w-6 h-6 mx-auto" />
            </button>
          </div>
        )}
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