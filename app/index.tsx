"use client";
import React, { useState, useEffect } from 'react';
import { Game } from '@/types';
import { GameAPI } from '@/services/api';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import GamesTab from '@/components/GamesTab';
import AnalyticsTab from '@/components/AnalyticsTab';
import AdminTab from '@/components/AdminTab';

export default function RMGDDashboard() {
  const [activeTab, setActiveTab] = useState('games');
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllGames();
  }, []);

  const fetchAllGames = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await GameAPI.getAllGames();
      setGames(data);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'games' && (
          <GamesTab
            games={games}
            loading={loading}
            error={error}
            onRefresh={fetchAllGames}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsTab games={games} />
        )}

        {activeTab === 'admin' && (
          <AdminTab />
        )}
      </div>
    </div>
  );
}