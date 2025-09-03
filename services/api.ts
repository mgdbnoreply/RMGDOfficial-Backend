// import { Game } from '@/types';

// const API_BASE = 'https://u3iysopa88.execute-api.us-east-1.amazonaws.com';

// // ===== EXISTING GAME API =====
// export const GameAPI = {
//   getAllGames: async (): Promise<Game[]> => {
//     try {
//       const res = await fetch(`${API_BASE}/games`);
//       if (!res.ok) throw new Error('Failed to fetch games');
//       const data = await res.json();
//       return Array.isArray(data) ? data : [data];
//     } catch (error) {
//       throw error;
//     }
//   },

//   getGameById: async (gameId: string): Promise<Game> => {
//     try {
//       const res = await fetch(`${API_BASE}/games/${gameId}`);
//       if (!res.ok) throw new Error('Failed to fetch game');
//       return await res.json();
//     } catch (error) {
//       throw error;
//     }
//   },

//   createGame: async (gameData: any): Promise<Game | null> => {
//     try {
//       const res = await fetch(`${API_BASE}/games`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(gameData)
//       });
      
//       if (res.ok) {
//         const result = await res.json();
//         return result.game; // Return the created game object
//       }
//       return null;
//     } catch (error) {
//       throw error;
//     }
//   },

//   updateGame: async (gameId: string, gameData: any): Promise<boolean> => {
//     try {
//       const res = await fetch(`${API_BASE}/games/${gameId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(gameData)
//       });
//       return res.ok;
//     } catch (error) {
//       throw error;
//     }
//   },

//   deleteGame: async (gameId: string): Promise<boolean> => {
//     try {
//       const res = await fetch(`${API_BASE}/games/${gameId}`, {
//         method: 'DELETE'
//       });
//       return res.ok;
//     } catch (error) {
//       throw error;
//     }
//   }
// };

// // ===== NEW COLLECTIONS API =====
// export const CollectionsAPI = {
//   getAllCollections: async (): Promise<any[]> => {
//     try {
//       const res = await fetch(`${API_BASE}/collections`);
//       if (!res.ok) throw new Error('Failed to fetch collections');
//       const data = await res.json();
//       return Array.isArray(data) ? data : [data];
//     } catch (error) {
//       throw error;
//     }
//   },

//   getCollectionById: async (collectionId: string): Promise<any> => {
//     try {
//       const res = await fetch(`${API_BASE}/collections/${collectionId}`);
//       if (!res.ok) throw new Error('Failed to fetch collection');
//       const data = await res.json();
//       return data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   createCollection: async (collectionData: any): Promise<any | null> => {
//     try {
//       const res = await fetch(`${API_BASE}/collections`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(collectionData)
//       });
      
//       if (res.ok) {
//         const result = await res.json();
//         return result.collection || result; // Return the created collection object
//       } else {
//         const errorDetails = await res.text();
//         return null;
//       }
//     } catch (error) {
//       throw error;
//     }
//   },

//   updateCollection: async (collectionId: string, collectionData: any): Promise<boolean> => {
//     try {
//       const res = await fetch(`${API_BASE}/collections/${collectionId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(collectionData)
//       });
      
//       if (res.ok) {
//         const result = await res.json();
//         return true;
//       } else {
//         const errorDetails = await res.text();
//         return false;
//       }
//     } catch (error) {
//       throw error;
//     }
//   },

//   deleteCollection: async (collectionId: string): Promise<boolean> => {
//     try {
//       const res = await fetch(`${API_BASE}/collections/${collectionId}`, {
//         method: 'DELETE'
//       });
//       return res.ok;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Additional helper methods for collections
//   getCollectionsByType: async (type: string): Promise<any[]> => {
//     try {
//       const res = await fetch(`${API_BASE}/collections?type=${type}`);
//       if (!res.ok) throw new Error(`Failed to fetch collections by type: ${type}`);
//       const data = await res.json();
//       return Array.isArray(data) ? data : [data];
//     } catch (error) {
//       throw error;
//     }
//   },

//   searchCollections: async (query: string): Promise<any[]> => {
//     try {
//       const res = await fetch(`${API_BASE}/collections/search?q=${encodeURIComponent(query)}`);
//       if (!res.ok) throw new Error('Failed to search collections');
//       const data = await res.json();
//       return Array.isArray(data) ? data : [data];
//     } catch (error) {
//       throw error;
//     }
//   }
// };

// // ===== EXISTING DASHBOARD API =====
// export const DashboardAPI = {
//   getDashboardStats: async (): Promise<any> => {
//     try {
//       const res = await fetch(`${API_BASE}/games/stats`);
//       if (!res.ok) throw new Error('Failed to fetch dashboard stats');
//       return await res.json();
//     } catch (error) {
//       throw error;
//     }
//   }
// };

import { Game } from '@/types';

const API_BASE = 'https://u3iysopa88.execute-api.us-east-1.amazonaws.com';

// Helper function to handle CORS errors
const handleCorsError = (error: any, operation: string) => {
  console.error(`CORS error during ${operation}:`, error);
  if (error.message?.includes('CORS')) {
    throw new Error(`CORS error: Unable to ${operation}. Please check API configuration.`);
  }
  throw error;
};

// ===== EXISTING GAME API =====
export const GameAPI = {
  getAllGames: async (): Promise<Game[]> => {
    try {
      const res = await fetch(`${API_BASE}/games`);
      if (!res.ok) throw new Error('Failed to fetch games');
      const data = await res.json();
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      return handleCorsError(error, 'fetch games');
    }
  },

  getGameById: async (gameId: string): Promise<Game> => {
    try {
      const res = await fetch(`${API_BASE}/games/${gameId}`);
      if (!res.ok) throw new Error('Failed to fetch game');
      return await res.json();
    } catch (error) {
      return handleCorsError(error, 'fetch game');
    }
  },

  createGame: async (gameData: any): Promise<Game | null> => {
    try {
      const res = await fetch(`${API_BASE}/games`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData)
      });
      
      if (res.ok) {
        const result = await res.json();
        return result.game; // Return the created game object
      }
      
      // Log detailed error for debugging
      console.error('Failed to create game:', res.status, res.statusText);
      return null;
    } catch (error) {
      return handleCorsError(error, 'create game');
    }
  },

  updateGame: async (gameId: string, gameData: any): Promise<boolean> => {
    try {
      console.log('Updating game:', gameId, gameData); // Debug log
      
      const res = await fetch(`${API_BASE}/games/${gameId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData)
      });
      
      if (!res.ok) {
        console.error('Update failed:', res.status, res.statusText);
        const errorText = await res.text().catch(() => 'No error details');
        console.error('Error details:', errorText);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Update game error:', error);
      handleCorsError(error, 'update game');
      return false;
    }
  },

  deleteGame: async (gameId: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/games/${gameId}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch (error) {
      return handleCorsError(error, 'delete game');
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
      return handleCorsError(error, 'fetch collections');
    }
  },

  getCollectionById: async (collectionId: string): Promise<any> => {
    try {
      const res = await fetch(`${API_BASE}/collections/${collectionId}`);
      if (!res.ok) throw new Error('Failed to fetch collection');
      const data = await res.json();
      return data;
    } catch (error) {
      return handleCorsError(error, 'fetch collection');
    }
  },

  createCollection: async (collectionData: any): Promise<any | null> => {
    try {
      const res = await fetch(`${API_BASE}/collections`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
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
      return handleCorsError(error, 'create collection');
    }
  },

  updateCollection: async (collectionId: string, collectionData: any): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/collections/${collectionId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
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
      handleCorsError(error, 'update collection');
      return false;
    }
  },

  deleteCollection: async (collectionId: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/collections/${collectionId}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch (error) {
      return handleCorsError(error, 'delete collection');
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
      return handleCorsError(error, 'fetch collections by type');
    }
  },

  searchCollections: async (query: string): Promise<any[]> => {
    try {
      const res = await fetch(`${API_BASE}/collections/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Failed to search collections');
      const data = await res.json();
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      return handleCorsError(error, 'search collections');
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
      return handleCorsError(error, 'fetch dashboard stats');
    }
  }
};