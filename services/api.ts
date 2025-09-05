import { Game } from '@/types';

const API_BASE = 'https://u3iysopa88.execute-api.us-east-1.amazonaws.com';

// Helper function to convert frontend Game object to DynamoDB format
const convertToDynamoDBFormat = (gameData: any) => {
  const formatted: any = {};
  
  // Convert each field to DynamoDB format if needed
  Object.keys(gameData).forEach(key => {
    const value = gameData[key];
    
    // Check if already in DynamoDB format
    if (value && typeof value === 'object' && (value.S !== undefined || value.SS !== undefined || value.N !== undefined)) {
      formatted[key] = value;
    } 
    // Convert strings to DynamoDB format
    else if (typeof value === 'string') {
      formatted[key] = { S: value };
    }
    // Convert string arrays to DynamoDB format
    else if (Array.isArray(value)) {
      formatted[key] = { SS: value };
    }
    // Handle numbers
    else if (typeof value === 'number') {
      formatted[key] = { N: value.toString() };
    }
  });
  
  return formatted;
};

// ==================== NEW CODE STARTS HERE ====================
// This new helper function is ONLY used for the User API.

/**
 * Converts a single DynamoDB-formatted item into a regular JavaScript object.
 * It also renames 'UserID' to 'id' to match the frontend's expectation.
 * @param {any} item - The item from DynamoDB with keys like { "S": "value" }.
 * @returns {any} A clean JavaScript object.
 */
const unmarshall = (item: any) => {
  if (!item) return {};
  const obj: { [key: string]: any } = {};
  for (const key in item) {
    const valueObject = item[key];
    if (valueObject) {
      const type = Object.keys(valueObject)[0]; // 'S', 'N', 'SS', etc.
      obj[key] = valueObject[type];
    }
  }
  // The frontend code expects an 'id' property.
  if (obj.UserID) {
    obj.id = obj.UserID;
    delete obj.UserID;
  }
  return obj;
};
// ==================== NEW CODE ENDS HERE ====================


// ===== EXISTING GAME API (UNCHANGED) =====
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

  createGame: async (gameData: any): Promise<Game | null> => {
    try {
      const formattedData = gameData.GameTitle?.S 
        ? gameData 
        : convertToDynamoDBFormat(gameData);
      
      console.log('Creating game with data:', formattedData);
      
      const res = await fetch(`${API_BASE}/games`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedData)
      });
      
      if (res.ok) {
        const result = await res.json();
        return result.game;
      }
      
      console.error('Failed to create game:', res.status, await res.text());
      return null;
    } catch (error) {
      console.error('Error creating game:', error);
      throw error;
    }
  },

  updateGame: async (gameId: string, gameData: any): Promise<boolean> => {
    try {
      console.log('=== UPDATE GAME DEBUG ===');
      console.log('Game ID:', gameId);
      console.log('Original gameData:', gameData);
      
      let formattedData;
      if (gameData.GameTitle && typeof gameData.GameTitle === 'object' && gameData.GameTitle.S !== undefined) {
        console.log('Data is already in DynamoDB format');
        formattedData = gameData;
      } else {
        console.log('Converting to DynamoDB format');
        formattedData = convertToDynamoDBFormat(gameData);
      }
      
      console.log('Formatted data being sent:', JSON.stringify(formattedData, null, 2));
      console.log('API URL:', `${API_BASE}/games/${gameId}`);
      
      const res = await fetch(`${API_BASE}/games/${gameId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formattedData)
      });
      
      console.log('Response received:');
      console.log('- Status:', res.status);
      console.log('- Status Text:', res.statusText);
      console.log('- Headers:', Object.fromEntries(res.headers.entries()));
      
      if (!res.ok) {
        const errorText = await res.text().catch(() => 'Could not read error response');
        console.error('Update failed. Error response:', errorText);
        throw new Error(`Failed to update game: ${res.status} ${res.statusText}`);
      }
      
      const result = await res.json().catch(() => ({ message: 'Update completed' }));
      console.log('Update successful. Response:', result);
      console.log('=== END UPDATE GAME DEBUG ===');
      
      return true;
    } catch (error) {
      console.error('=== UPDATE GAME ERROR ===');
      console.error('Error details:', error);
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.error('This is likely a CORS error. Check:');
        console.error('1. API Gateway OPTIONS method is configured');
        console.error('2. API Gateway has been deployed');
        console.error('3. Lambda returns CORS headers');
      }
      console.error('=== END UPDATE GAME ERROR ===');
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

// ===== NEW COLLECTIONS API (UNCHANGED) =====
export const CollectionsAPI = {
  getAllCollections: async (): Promise<any[]> => {
    try {
      const res = await fetch(`${API_BASE}/collections`);
      if (!res.ok) throw new Error('Failed to fetch collections');
      const data = await res.json();
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      console.error('Error fetching collections:', error);
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
      console.error('Error fetching collection:', error);
      throw error;
    }
  },

  createCollection: async (collectionData: any): Promise<any | null> => {
    try {
      const res = await fetch(`${API_BASE}/collections`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(collectionData)
      });
      
      if (res.ok) {
        const result = await res.json();
        return result.collection || result;
      } else {
        const errorDetails = await res.text();
        console.error('Create collection failed:', errorDetails);
        return null;
      }
    } catch (error) {
      console.error('Error creating collection:', error);
      throw error;
    }
  },

  updateCollection: async (collectionId: string, collectionData: any): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/collections/${collectionId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(collectionData)
      });
      
      if (res.ok) {
        return true;
      } else {
        const errorDetails = await res.text();
        console.error('Update collection failed:', errorDetails);
        return false;
      }
    } catch (error) {
      console.error('Error updating collection:', error);
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
      console.error('Error deleting collection:', error);
      throw error;
    }
  },

  getCollectionsByType: async (type: string): Promise<any[]> => {
    try {
      const res = await fetch(`${API_BASE}/collections?type=${type}`);
      if (!res.ok) throw new Error(`Failed to fetch collections by type: ${type}`);
      const data = await res.json();
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      console.error('Error fetching collections by type:', error);
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
      console.error('Error searching collections:', error);
      throw error;
    }
  }
};

// ==================== UPDATED USER API ====================
// This is the only other part that has changed.
export const UserAPI = {
  getAllUsers: async (): Promise<any[]> => {
    try {
      const res = await fetch(`${API_BASE}/user`);
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      const items = Array.isArray(data) ? data : [data];
      // Use the new helper to clean the data
      return items.map(unmarshall);
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
  // These functions are placeholders for when you expand your backend
  createUser: async (userData: any) => null,
  updateUser: async (userId: string, userData: any) => false,
  deleteUser: async (userId: string) => false,
};
// ==========================================================

// ===== EXISTING DASHBOARD API (UNCHANGED) =====
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