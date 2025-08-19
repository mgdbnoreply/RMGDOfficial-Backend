import { Game } from '@/types';

const API_BASE = 'https://u3iysopa88.execute-api.us-east-1.amazonaws.com';

// ===== EXISTING GAME API =====
export const GameAPI = {
  getAllGames: async (): Promise<Game[]> => {
    try {
      const res = await fetch(`${API_BASE}/games`);
      if (!res.ok) throw new Error('Failed to fetch games');
      const data = await res.json();
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      throw error;
    }
  },

  getGameById: async (gameId: string): Promise<Game> => {
    try {
      const res = await fetch(`${API_BASE}/games/${gameId}`);
      if (!res.ok) throw new Error('Failed to fetch game');
      return await res.json();
    } catch (error) {
      throw error;
    }
  },

  createGame: async (gameData: any): Promise<Game | null> => {
    try {
      const res = await fetch(`${API_BASE}/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameData)
      });
      
      if (res.ok) {
        const result = await res.json();
        return result.game; // Return the created game object
      }
      return null;
    } catch (error) {
      throw error;
    }
  },

  updateGame: async (gameId: string, gameData: any): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/games/${gameId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameData)
      });
      return res.ok;
    } catch (error) {
      throw error;
    }
  },

  deleteGame: async (gameId: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/games/${gameId}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch (error) {
      throw error;
    }
  }
};

// ===== NEW COLLECTIONS API =====
export const CollectionsAPI = {
  getAllCollections: async (): Promise<any[]> => {
    try {
      const res = await fetch(`${API_BASE}/collections`);
      if (!res.ok) throw new Error('Failed to fetch collections');
      const data = await res.json();
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      throw error;
    }
  },

  getCollectionById: async (collectionId: string): Promise<any> => {
    try {
      const res = await fetch(`${API_BASE}/collections/${collectionId}`);
      if (!res.ok) throw new Error('Failed to fetch collection');
      const data = await res.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  createCollection: async (collectionData: any): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/collections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(collectionData)
      });
      return res.ok;
    } catch (error) {
      throw error;
    }
  },

  updateCollection: async (collectionId: string, collectionData: any): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/collections/${collectionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(collectionData)
      });
      return res.ok;
    } catch (error) {
      throw error;
    }
  },

  deleteCollection: async (collectionId: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/collections/${collectionId}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch (error) {
      throw error;
    }
  },

  // Additional helper methods for collections
  getCollectionsByType: async (type: string): Promise<any[]> => {
    try {
      const res = await fetch(`${API_BASE}/collections?type=${type}`);
      if (!res.ok) throw new Error(`Failed to fetch collections by type: ${type}`);
      const data = await res.json();
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      throw error;
    }
  },

  searchCollections: async (query: string): Promise<any[]> => {
    try {
      const res = await fetch(`${API_BASE}/collections/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Failed to search collections');
      const data = await res.json();
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      throw error;
    }
  }
};

// ===== EXISTING DASHBOARD API =====
export const DashboardAPI = {
  getDashboardStats: async (): Promise<any> => {
    try {
      const res = await fetch(`${API_BASE}/games/stats`);
      if (!res.ok) throw new Error('Failed to fetch dashboard stats');
      return await res.json();
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
};