import { Game } from '@/types';

// The single, unified base URL for your entire API on AWS API Gateway.
const API_BASE = 'https://u3iysopa88.execute-api.us-east-1.amazonaws.com';

// Define the specific path for the games resource
const GAMES_API_PATH = `${API_BASE}/games`;

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

// ===== GAME API =====
export const GameAPI = {
  getAllGames: async (): Promise<Game[]> => {
    try {
      const res = await fetch(GAMES_API_PATH);
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
      const res = await fetch(`${GAMES_API_PATH}/${gameId}`);
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
      
      const res = await fetch(GAMES_API_PATH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      let formattedData = gameData.GameTitle && typeof gameData.GameTitle === 'object' && gameData.GameTitle.S !== undefined
        ? gameData
        : convertToDynamoDBFormat(gameData);
      
      const res = await fetch(`${GAMES_API_PATH}/${gameId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formattedData)
      });
      
      if (!res.ok) {
        const errorText = await res.text().catch(() => 'Could not read error response');
        throw new Error(`Failed to update game: ${res.status} ${res.statusText} - ${errorText}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating game:', error);
      throw error;
    }
  },

  deleteGame: async (gameId: string): Promise<boolean> => {
    try {
      const res = await fetch(`${GAMES_API_PATH}/${gameId}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch (error) {
      console.error('Error deleting game:', error);
      throw error;
    }
  }
};
