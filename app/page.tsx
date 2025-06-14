"use client";
import React, { useState, useEffect } from 'react';
import { Game } from '@/types';
import { GameAPI } from '@/services/api';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Login from '@/components/Login';
import Sidebar from '@/components/Sidebar';
import ConsoleCollection from '@/components/ConsoleCollection';
import UserManagement from '@/components/UserManagement';
import GamesTab from '@/components/GamesTab';
import AnalyticsTab from '@/components/AnalyticsTab';
import AdminTab from '@/components/AdminTab';

function DashboardContent() {
  const [activeTab, setActiveTab] = useState('games');
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllGames();
    }
  }, [isAuthenticated]);

  const fetchAllGames = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Fetching all games...');
      const data = await GameAPI.getAllGames();
      console.log('✅ Games loaded:', data.length);
      setGames(data);
    } catch (err: any) {
      console.error('❌ Error loading games:', err);
      setError(`Failed to load games: ${err.message}`);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner during auth check
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center login-bg">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <p className="text-white text-xl">Loading RMGD Portal...</p>
          <p className="text-red-200 text-base mt-2">Retro Mobile Gaming Database</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <Login />;
  }

  // Get tab title and description
  const getTabInfo = () => {
    switch (activeTab) {
      case 'games':
        return {
          title: 'Game Collection Database',
          description: 'Comprehensive catalog of retro mobile games (1975-2008)'
        };
      case 'console':
        return {
          title: 'Console & Device Collection',
          description: 'Physical gaming device preservation - Coming Soon'
        };
      case 'analytics':
        return {
          title: 'Research Analytics Center',
          description: 'Historical analysis and academic research insights'
        };
      case 'admin':
        return {
          title: 'System Administration',
          description: 'Database management and system configuration'
        };
      case 'users':
        return {
          title: 'User Management Portal',
          description: 'Manage RMGD portal access and user permissions'
        };
      default:
        return {
          title: 'RMGD Dashboard',
          description: 'Retro Mobile Gaming Database Administration'
        };
    }
  };

  const { title, description } = getTabInfo();

  // Main dashboard with clean white background
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-80 transition-all duration-300">
        {/* Header */}
        <header className="header-bg border-b p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">{title}</h1>
              <p className="text-rmgd-primary text-lg font-medium">{description}</p>
            </div>
            
            <div className="text-right">
              <div className="academic-card-elevated p-6">
                <p className="text-primary text-lg font-semibold">
                  {games.length} Games Catalogued
                </p>
                <div className="flex items-center justify-end space-x-2 mt-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <p className="text-green-700 text-base font-medium">
                    Database Online
                  </p>
                </div>
                <p className="text-secondary text-sm mt-1">
                  Historical Period: 1975-2008
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-8 bg-gray-50 min-h-screen">
          <div className="max-w-full">
            {activeTab === 'games' && (
              <GamesTab
                games={games}
                loading={loading}
                error={error}
                onRefresh={fetchAllGames}
              />
            )}

            {activeTab === 'console' && (
              <ConsoleCollection />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsTab  />
            )}

            {activeTab === 'admin' && (
              <AdminTab />
            )}

            {activeTab === 'users' && (
              <UserManagement />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function RMGDDashboard() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
}