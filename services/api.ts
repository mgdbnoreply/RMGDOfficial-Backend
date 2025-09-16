import { Game } from '@/types';

const API_BASE = 'https://u3iysopa88.execute-api.us-east-1.amazonaws.com';

// Helper function to convert frontend Game object to DynamoDB format
const convertToDynamoDBFormat = (gameData: any) => {
  const formatted: any = {};
  
  Object.keys(gameData).forEach(key => {
    const value = gameData[key];
    
    if (value && typeof value === 'object' && (value.S !== undefined || value.SS !== undefined || value.N !== undefined)) {
      formatted[key] = value;
    } 
    else if (typeof value === 'string') {
      formatted[key] = { S: value };
    }
    else if (Array.isArray(value)) {
      formatted[key] = { SS: value };
    }
    else if (typeof value === 'number') {
      formatted[key] = { N: value.toString() };
    }
  });
  
  return formatted;
};

/**
 * Converts a single DynamoDB-formatted item into a regular JavaScript object.
 * It also handles capitalized keys from the database (e.g., "UserID", "Email")
 * and maps them to the lowercase keys the frontend application expects (e.g., "id", "email").
 * @param {any} item - The item from DynamoDB with keys like { "S": "value" }.
 * @returns {any} A clean JavaScript object.
 */
const unmarshallUser = (item: any) => {
    if (!item) return null;
    const userObject: { [key: string]: any } = {};
    for (const key in item) {
        const valueObject = item[key];
        if (valueObject) {
            const type = Object.keys(valueObject)[0]; // 'S', 'N', etc.
            userObject[key] = valueObject[type];
        }
    }

    // Map PascalCase keys from DB to camelCase keys for the frontend
    return {
        id: userObject.UserID,
        email: userObject.Email,
        name: userObject.Name,
        password: userObject.Password, // Include the password for the login check
        role: userObject.Role,
        createdAt: userObject.CreatedAt || new Date().toISOString()
    };
};


// ===== EXISTING GAME API (UNCHANGED) =====
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
      const formattedData = gameData.GameTitle?.S 
        ? gameData 
        : convertToDynamoDBFormat(gameData);
      
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
    
      return null;
    } catch (error) {
      throw error;
    }
  },

  updateGame: async (gameId: string, gameData: any): Promise<boolean> => {
    try {
      let formattedData;
      if (gameData.GameTitle && typeof gameData.GameTitle === 'object' && gameData.GameTitle.S !== undefined) {
        formattedData = gameData;
      } else {
        formattedData = convertToDynamoDBFormat(gameData);
      }
      
      const res = await fetch(`${API_BASE}/games/${gameId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formattedData)
      });
      
      if (!res.ok) {
        const errorText = await res.text().catch(() => 'Could not read error response');
        throw new Error(`Failed to update game: ${res.status} ${res.statusText}`);
      }
      
      const result = await res.json().catch(() => ({ message: 'Update completed' }));
      
      return true;
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

// ===== COLLECTIONS API (UNCHANGED) =====
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

  createCollection: async (collectionData: any): Promise<any | null> => {
    try {
      console.log('📡 Sending collection data to API:', collectionData);
      
      const res = await fetch(`${API_BASE}/collections`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(collectionData)
      });
      
      console.log('📡 API Response status:', res.status, res.statusText);
      
      if (res.ok) {
        const result = await res.json();
        console.log('📡 API Response data:', result);
        return result.collection || result;
      } else {
        const errorDetails = await res.text();
        console.error('📡 API Error details:', errorDetails);
        throw new Error(`API Error: ${res.status} - ${errorDetails}`);
      }
    } catch (error) {
      console.error('📡 Network/API Error:', error);
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
        return false;
      }
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



// ===== DASHBOARD API (UNCHANGED) =====
export const DashboardAPI = {
  getDashboardStats: async (): Promise<any> => {
    try {
      const res = await fetch(`${API_BASE}/games/stats`);
      if (!res.ok) throw new Error('Failed to fetch dashboard stats');
      return await res.json();
    } catch (error) {
      throw error;
    }
  }
};

// ===== USER API (FINALIZED AND CORRECTED) =====
export const UserAPI = {
  /**
   * [UPDATED] Calls the POST /user endpoint to authenticate a user.
   */
  login: async (email: string, password: string): Promise<any | null> => {
    try {
      // Change the endpoint from /login to /user
      const res = await fetch(`${API_BASE}/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (error) {
      return null;
    }
  },


  /**
   * CORRECTED: Calls the GET /user endpoint (singular) to fetch all users.
   */
  getAllUsers: async (): Promise<any[]> => {
    try {
      // The endpoint is /user, not /users
      const res = await fetch(`${API_BASE}/user`);
      if (!res.ok) throw new Error('Failed to fetch users');
      return await res.json();
    } catch (error) {
      throw error;
    }
  },

  /**
   * Calls the POST /user endpoint to create a new user.
   */
  createUser: async (userData: { Name: string; Email: string; Role: string }): Promise<any | null> => {
    try {
      const res = await fetch(`${API_BASE}/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return res.ok ? await res.json() : null;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Calls the PUT /user/{UserID} endpoint to update a user.
   */
  updateUser: async (userId: string, userData: { Name?: string; Role?: string; Password?: string }): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/user/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return res.ok;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Calls the DELETE /user/{UserID} endpoint to remove a user.
   */
  deleteUser: async (userId: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/user/${userId}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch (error) {
      throw error;
    }
  }
};