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
      console.error('Error fetching games:', error);
      throw error;
    }
  },

  getGameById: async (gameId: string): Promise<Game> => {
    try {
      const res = await fetch(`${API_BASE}/games/${gameId}`);
      if (!res.ok) throw new Error('Failed to fetch game');
      return await res.json();
    } catch (error) {
      console.error('Error fetching game:', error);
      throw error;
    }
  },

  createGame: async (gameData: any): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/games`, {
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
      const res = await fetch(`${API_BASE}/games/${gameId}`, {
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
      const res = await fetch(`${API_BASE}/games/${gameId}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch (error) {
      console.error('Error deleting game:', error);
      throw error;
    }
  }
};

// ===== NEW COLLECTIONS API =====
export const CollectionsAPI = {
  getAllCollections: async (): Promise<any[]> => {
    try {
      console.log('🔄 Fetching all collections...');
      const res = await fetch(`${API_BASE}/collections`);
      if (!res.ok) throw new Error('Failed to fetch collections');
      const data = await res.json();
      console.log('✅ Collections loaded:', Array.isArray(data) ? data.length : 1);
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      console.error('❌ Error fetching collections:', error);
      throw error;
    }
  },

  getCollectionById: async (collectionId: string): Promise<any> => {
    try {
      console.log(`🔄 Fetching collection: ${collectionId}`);
      const res = await fetch(`${API_BASE}/collections/${collectionId}`);
      if (!res.ok) throw new Error('Failed to fetch collection');
      const data = await res.json();
      console.log('✅ Collection loaded:', data);
      return data;
    } catch (error) {
      console.error('Error fetching collection:', error);
      throw error;
    }
  },

  createCollection: async (collectionData: any): Promise<boolean> => {
    try {
      console.log('🔄 Creating collection...');
      const res = await fetch(`${API_BASE}/collections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(collectionData)
      });
      console.log(res.ok ? '✅ Collection created successfully' : '❌ Failed to create collection');
      return res.ok;
    } catch (error) {
      console.error('Error creating collection:', error);
      throw error;
    }
  },

  updateCollection: async (collectionId: string, collectionData: any): Promise<boolean> => {
    try {
      console.log(`🔄 Updating collection: ${collectionId}`);
      const res = await fetch(`${API_BASE}/collections/${collectionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(collectionData)
      });
      console.log(res.ok ? '✅ Collection updated successfully' : '❌ Failed to update collection');
      return res.ok;
    } catch (error) {
      console.error('Error updating collection:', error);
      throw error;
    }
  },

  deleteCollection: async (collectionId: string): Promise<boolean> => {
    try {
      console.log(`🔄 Deleting collection: ${collectionId}`);
      const res = await fetch(`${API_BASE}/collections/${collectionId}`, {
        method: 'DELETE'
      });
      console.log(res.ok ? '✅ Collection deleted successfully' : '❌ Failed to delete collection');
      return res.ok;
    } catch (error) {
      console.error('Error deleting collection:', error);
      throw error;
    }
  },

  // Additional helper methods for collections
  getCollectionsByType: async (type: string): Promise<any[]> => {
    try {
      console.log(`🔄 Fetching collections by type: ${type}`);
      const res = await fetch(`${API_BASE}/collections?type=${type}`);
      if (!res.ok) throw new Error(`Failed to fetch collections by type: ${type}`);
      const data = await res.json();
      console.log(`✅ Found ${Array.isArray(data) ? data.length : 1} collections of type: ${type}`);
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      console.error(`Error fetching collections by type ${type}:`, error);
      throw error;
    }
  },

  searchCollections: async (query: string): Promise<any[]> => {
    try {
      console.log(`🔄 Searching collections: ${query}`);
      const res = await fetch(`${API_BASE}/collections/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Failed to search collections');
      const data = await res.json();
      console.log(`✅ Found ${Array.isArray(data) ? data.length : 1} collections matching: ${query}`);
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      console.error('Error searching collections:', error);
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