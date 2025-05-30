export type Game = {
  GameID: { S: string };
  GameTitle: { S: string };
  GameDescription: { S: string };
  Developer: { S: string };
  YearDeveloped: { S: string };
  Genre: { S: string };
  Photos: { SS: string[] };
  [key: string]: unknown;
};

export type NewGame = {
  GameTitle: string;
  GameDescription: string;
  Developer: string;
  YearDeveloped: string;
  Genre: string;
  Photos: string[];
};

export type DashboardStats = {
  totalGames: number;
  developers: number;
  genres: number;
  recentGames: number;
};