// ===== GAME TYPES (EXISTING) =====

export type Game = {
  GameID: { S: string };
  GameTitle: { S: string };
  GameDescription: { S: string };
  Developer: { S: string };
  YearDeveloped: { S: string };
  Genre: { S: string };
  Photos: { SS: string[] };
  Articles?: { SS: string[] };
  Connectivity?: { S: string };
  DeveloperLocation?: { S: string };
  GameWebsite?: { S: string };
  HardwareFeatures?: { S: string };
  Players?: { S: string };
  Purpose?: { S: string };
  [key: string]: unknown;
};

export type NewGame = {
  GameTitle: string;
  Developer: string;
  GameDescription?: string;
  YearDeveloped?: string;
  Genre?: string;
  Photos?: string[];
  Articles?: string[];
  Connectivity?: string;
  DeveloperLocation?: string;
  GameWebsite?: string;
  HardwareFeatures?: string;
  Players?: string;
  Purpose?: string;
};

export type DashboardStats = {
  totalGames: number;
  developers: number;
  genres: number;
  recentGames: number;
};

// ===== COLLECTION TYPES (UPDATED FOR YOUR API FORMAT) =====

/**
 * Your actual API Collection format - DynamoDB structure
 */
export type CollectionDynamoDB = {
  productId: { S: string };
  category: { S: string };
  description: { S: string };
  id: { S: string };
  image: { S: string };
  maker: { S: string };
  name: { S: string };
  year: { S: string };
  [key: string]: unknown;
};

/**
 * Collection display format (matches your API structure)
 */
export type Collection = {
  id: string;
  name: string;
  category: string;
  description: string;
  maker: string;
  year: string;
  image: string;
  productId: string;
  status?: string; // Optional since not in your API
  createdAt?: string;
  updatedAt?: string;
};

/**
 * New Collection input format (for creating new collections)
 */
export type NewCollection = {
  name: string;
  category: string;
  description: string;
  maker: string;
  year: string;
  image: string;
};

/**
 * Collection categories based on your data
 */
export const COLLECTION_CATEGORIES = [
  'phone',
  'console',
  'handheld',
  'pda',
  'calculator',
  'watch',
  'tablet',
  'gaming',
  'other'
] as const;

export type CollectionCategory = typeof COLLECTION_CATEGORIES[number];

/**
 * Collection search parameters
 */
export type CollectionSearchQuery = {
  name?: string;
  category?: string;
  maker?: string;
  year?: string;
  decade?: string;
  hasImage?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: CollectionSortField;
  sortOrder?: 'asc' | 'desc';
};

/**
 * Available fields for sorting collections
 */
export type CollectionSortField =
  | 'name'
  | 'category'
  | 'maker'
  | 'year'
  | 'productId'
  | 'createdAt'
  | 'updatedAt';

/**
 * Collection statistics
 */
export type CollectionStats = {
  totalCollections: number;
  categories: number;
  makers: number;
  vintageItems: number;
  phones: number;
  recentItems: number;
};

// ===== USER MANAGEMENT TYPES =====

/**
 * User roles in the RMGD system
 */
export type UserRole = 'admin' | 'researcher' | 'user';

/**
 * User account information
 */
export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
  permissions?: UserPermissions;
  preferences?: UserPreferences;
};

/**
 * User permissions structure
 */
export type UserPermissions = {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManageUsers: boolean;
  canViewAnalytics: boolean;
  canExportData: boolean;
  canAccessAdmin: boolean;
};

/**
 * User preferences
 */
export type UserPreferences = {
  theme?: 'light' | 'dark' | 'auto';
  defaultView?: 'grid' | 'list';
  itemsPerPage?: number;
  notifications?: {
    email: boolean;
    browser: boolean;
  };
};

/**
 * Login credentials
 */
export type LoginCredentials = {
  email: string;
  password: string;
};

/**
 * Authentication context state
 */
export type AuthState = {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
};

// ===== ANALYTICS TYPES =====

/**
 * Enhanced dashboard statistics
 */
export type EnhancedDashboardStats = {
  // Games
  totalGames: number;
  developers: number;
  genres: number;
  recentGames: number;

  // Collections
  totalCollections: number;
  categories: number;
  makers: number;
  vintageItems: number;

  // Users
  totalUsers?: number;
  activeUsers?: number;

  // System
  storageUsed?: number;
  lastBackup?: string;
};

/**
 * Analytics data structure
 */
export type AnalyticsData = {
  gamesOverTime: TimeSeriesData[];
  genreDistribution: CategoryData[];
  developerStats: CategoryData[];
  yearlyBreakdown: CategoryData[];
  topDevelopers: CategoryData[];
  documentationRate: number;
  eraAnalysis: {
    earlyEra: number; // 1975-1989
    goldenAge: number; // 1990-1999
    modernEra: number; // 2000-2008
  };

  // Collections analytics
  collectionsOverTime?: TimeSeriesData[];
  categoryDistribution?: CategoryData[];
  makerStats?: CategoryData[];
};

/**
 * Time series data point
 */
export type TimeSeriesData = {
  date: string;
  value: number;
  label?: string;
};

/**
 * Category data for charts
 */
export type CategoryData = {
  name: string;
  value: number;
  percentage?: number;
  color?: string;
};

// ===== API TYPES =====

/**
 * Standard API response wrapper
 */
export type APIResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  timestamp: string;
};

/**
 * API error structure
 */
export type APIError = {
  code: string;
  message: string;
  details?: unknown;
  statusCode?: number;
};

/**
 * Batch operation request
 */
export type BatchRequest<T> = {
  operations: Array<{
    action: 'create' | 'update' | 'delete';
    id?: string;
    data?: T;
  }>;
};

/**
 * Batch operation response
 */
export type BatchResponse = {
  successful: number;
  failed: number;
  errors: Array<{
    index: number;
    error: string;
  }>;
};

// ===== UI STATE TYPES =====

/**
 * Loading states for different operations
 */
export type LoadingState = {
  games: boolean;
  collections: boolean;
  users: boolean;
  analytics: boolean;
  auth: boolean;
  [key: string]: boolean;
};

/**
 * View mode options
 */
export type ViewMode = 'grid' | 'list' | 'table';

/**
 * Modal state management
 */
export type ModalState = {
  addGame: boolean;
  editGame: boolean;
  gameDetail: boolean;
  addCollection: boolean;
  editCollection: boolean;
  collectionDetail: boolean;
  userManagement: boolean;
  settings: boolean;
  [key: string]: boolean;
};

/**
 * Form validation state
 */
export type ValidationState<T> = {
  [K in keyof T]?: {
    isValid: boolean;
    error?: string;
  };
};

// ===== TRANSFORMATION HELPERS =====

/**
 * Helper function to safely extract string from DynamoDB format
 */
export const extractString = (value: any): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (value.S) return value.S;
  return String(value);
};

/**
 * Helper function to safely extract string array from DynamoDB format
 */
export const extractStringArray = (value: any): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (value.SS && Array.isArray(value.SS)) return value.SS;
  return [];
};

/**
 * Convert your Collection DynamoDB format to display format
 */
export function collectionToDisplay(item: CollectionDynamoDB): Collection {
  return {
    id: extractString(item.id || item.productId),
    name: extractString(item.name),
    category: extractString(item.category),
    description: extractString(item.description),
    maker: extractString(item.maker),
    year: extractString(item.year),
    image: extractString(item.image),
    productId: extractString(item.productId),
    status: 'active', // default since not in your API
  };
}

/**
 * Convert NewCollection to your DynamoDB format
 */
export function newCollectionToDynamo(newCollection: NewCollection): CollectionDynamoDB {
  const productId = `${newCollection.maker.toLowerCase().replace(/\s+/g, '-')}-${newCollection.name.toLowerCase().replace(/\s+/g, '-')}`;

  return {
    productId: { S: productId },
    category: { S: newCollection.category },
    description: { S: newCollection.description },
    id: { S: productId },
    image: { S: newCollection.image },
    maker: { S: newCollection.maker },
    name: { S: newCollection.name },
    year: { S: newCollection.year }
  };
}

/**
 * Convert Game (DynamoDB format) to display format
 */
export type GameDisplay = {
  id: string;
  title: string;
  description: string;
  developer: string;
  year: string;
  genre: string;
  photos: string[];
  createdAt?: string;
  updatedAt?: string;
};

export function gameToDisplay(game: Game): GameDisplay {
  return {
    id: game.GameID.S,
    title: game.GameTitle.S,
    description: game.GameDescription.S,
    developer: game.Developer.S,
    year: game.YearDeveloped.S,
    genre: game.Genre.S,
    photos: game.Photos.SS,
  };
}

// ===== TYPE GUARDS =====

/**
 * Check if value is a valid Game object
 */
export function isGame(value: unknown): value is Game {
  return (
    typeof value === 'object' &&
    value !== null &&
    'GameID' in value &&
    'GameTitle' in value
  );
}

/**
 * Check if value is a valid Collection object (your format)
 */
export function isCollection(value: unknown): value is CollectionDynamoDB {
  return (
    typeof value === 'object' &&
    value !== null &&
    'productId' in value &&
    'name' in value &&
    'category' in value
  );
}

/**
 * Check if value is a valid User object
 */
export function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'email' in value &&
    'role' in value
  );
}

// ===== CONSTANTS =====

/**
 * Game genres (existing)
 */
export const GAME_GENRES = [
  'Action',
  'Adventure',
  'Puzzle',
  'Strategy',
  'Sports',
  'Racing',
  'Simulation',
  'Arcade',
  'RPG',
  'Platform',
  'Shooter',
  'Educational',
  'Music',
  'Card',
  'Board'
] as const;

export type GameGenre = typeof GAME_GENRES[number];

/**
 * Historical eras for RMGD
 */
export const RMGD_ERAS = {
  EARLY: { start: 1975, end: 1989, label: 'Early Era' },
  GOLDEN: { start: 1990, end: 1999, label: 'Golden Age' },
  MODERN: { start: 2000, end: 2008, label: 'Modern Era' }
} as const;

/**
 * Default user permissions by role
 */
export const DEFAULT_PERMISSIONS: Record<UserRole, UserPermissions> = {
  admin: {
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canManageUsers: true,
    canViewAnalytics: true,
    canExportData: true,
    canAccessAdmin: true,
  },
  researcher: {
    canCreate: true,
    canEdit: true,
    canDelete: false,
    canManageUsers: false,
    canViewAnalytics: true,
    canExportData: true,
    canAccessAdmin: false,
  },
  user: {
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canManageUsers: false,
    canViewAnalytics: false,
    canExportData: false,
    canAccessAdmin: false,
  },
};

/**
 * Check if user role has specific permission
 */
export function hasPermission(user: User, permission: keyof UserPermissions): boolean {
  return user.permissions?.[permission] ?? DEFAULT_PERMISSIONS[user.role][permission];
}

// ===== UTILITY TYPES =====

/**
 * Make all properties optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Pick specific fields from a type
 */
export type PickFields<T, K extends keyof T> = Pick<T, K>;

/**
 * Omit specific fields from a type
 */
export type OmitFields<T, K extends keyof T> = Omit<T, K>;

/**
 * Convert DynamoDB format to display format
 */
export type DynamoToDisplay<T> = {
  [K in keyof T]: T[K] extends { S: string }
    ? string
    : T[K] extends { N: string }
    ? number
    : T[K] extends { SS: string[] }
    ? string[]
    : T[K];
};

// ===== EXPORT TYPES =====

/**
 * Export format options
 */
export type ExportFormat = 'json' | 'csv' | 'xlsx' | 'pdf';

/**
 * Export configuration
 */
export type ExportConfig = {
  format: ExportFormat;
  fields: string[];
  includeImages: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
  filters?: CollectionSearchQuery;
};

// ===== CONFIGURATION TYPES =====

/**
 * Application configuration
 */
export type AppConfig = {
  apiBaseUrl: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  features: {
    userManagement: boolean;
    analytics: boolean;
    collections: boolean;
    export: boolean;
    backup: boolean;
  };
  limits: {
    maxPhotosPerGame: number;
    maxImagesPerCollection: number;
    maxFileSize: number;
    sessionTimeout: number;
  };
};

/**
 * Theme configuration
 */
export type ThemeConfig = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
  };
};