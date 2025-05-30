
import { Game } from '@/types';

const API_BASE = 'https://u3iysopa88.execute-api.us-east-1.amazonaws.com/games';

export const GameAPI = {
  getAllGames: async (): Promise<Game[]> => {
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error('Failed to fetch games');
      const data = await res.json();
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      console.error('Error fetching games:', error);
      throw error;
    }
  },

  getGameById: async (gameId: string): Promise<Game> => {
    try {
      const res = await fetch(`${API_BASE}/${gameId}`);
      if (!res.ok) throw new Error('Failed to fetch game');
      return await res.json();
    } catch (error) {
      console.error('Error fetching game:', error);
      throw error;
    }
  },

  createGame: async (gameData: any): Promise<boolean> => {
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameData)
      });
      return res.ok;
    } catch (error) {
      console.error('Error creating game:', error);
      throw error;
    }
  },

  updateGame: async (gameId: string, gameData: Game): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/${gameId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameData)
      });
      return res.ok;
    } catch (error) {
      console.error('Error updating game:', error);
      throw error;
    }
  },

  deleteGame: async (gameId: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/${gameId}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch (error) {
      console.error('Error deleting game:', error);
      throw error;
    }
  }
};

export const DashboardAPI = {
  getDashboardStats: async (): Promise<any> => {
    try {
      const res = await fetch(`${API_BASE}/stats`);
      if (!res.ok) throw new Error('Failed to fetch dashboard stats');
      return await res.json();
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
};