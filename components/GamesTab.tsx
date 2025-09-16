import { useState, useEffect } from 'react';
import { Search, Plus, Gamepad2, Users, BarChart3, Calendar, Grid, List, AlertCircle, Filter, Download, BookOpen, Clock, Trophy, Zap, Star, Archive, TrendingUp } from 'lucide-react';
import { Game, NewGame } from '@/types';
import { GameAPI } from '@/services/api';
import GameCard from './GameCard';
import AddGameModal from './AddGameModal';
import GameDetailModal from './GameDetailModal';
import EditGameModal from './EditGameModal';

interface GamesTabProps {
  games: Game[];
  loading: boolean;
  error: string | null;
  onRefresh: () => Promise<void>;
  onUpdateGame: (updatedGame: Game) => void; // Add local update function
  onAddGame: (newGame: Game) => void; // Add local add function
  onDeleteGame: (gameId: string) => void; // Add local delete function
}

export default function ImprovedGamesTab({ games, loading, error, onRefresh, onUpdateGame, onAddGame, onDeleteGame }: GamesTabProps) {
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedEra, setSelectedEra] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [operationError, setOperationError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState('catalog');

  useEffect(() => {
    filterGames();
  }, [games, searchTerm, selectedGenre, selectedYear, selectedEra]);

  const filterGames = () => {
    let filtered = games;

    if (searchTerm) {
      filtered = filtered.filter(game =>
        game.GameTitle?.S?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.Developer?.S?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.GameDescription?.S?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedGenre) {
      filtered = filtered.filter(game => game.Genre?.S === selectedGenre);
    }

    if (selectedYear) {
      filtered = filtered.filter(game => game.YearDeveloped?.S === selectedYear);
    }

    if (selectedEra) {
      const [start, end] = selectedEra.split('-').map(Number);
      filtered = filtered.filter(game => {
        const year = parseInt(game.YearDeveloped?.S || '0');
        return year >= start && year <= end;
      });
    }

    setFilteredGames(filtered);
  };

  const handleAddGame = async (gameData: NewGame & { [key: string]: any }) => {
    setOperationError(null);
    try {
      const createdGame = await GameAPI.createGame(gameData);
      
      if (createdGame) {
        // Add to local state instead of full refresh
        onAddGame(createdGame);
        setShowAddForm(false);
      } else {
        throw new Error('Failed to add game - API returned null');
      }
    } catch (err: any) {
      setOperationError(`Failed to add game: ${err.message}`);
    }
  };

  const handleUpdateGame = async (game: Game) => {
    setOperationError(null);
    try {
      // Convert DynamoDB format to simple JavaScript objects
      const gameData = {
        GameTitle: game.GameTitle?.S || '',
        GameDescription: game.GameDescription?.S || '',
        Developer: game.Developer?.S || '',
        YearDeveloped: game.YearDeveloped?.S || '',
        Genre: game.Genre?.S || '',
        Photos: game.Photos?.SS || [],
        Connectivity: (game as any).Connectivity?.S || '',
        DeveloperLocation: (game as any).DeveloperLocation?.S || '',
        GameWebsite: (game as any).GameWebsite?.S || '',
        HardwareFeatures: (game as any).HardwareFeatures?.S || '',
        Players: (game as any).Players?.S || '',
        Purpose: (game as any).Purpose?.S || '',
      };

      const success = await GameAPI.updateGame(game.GameID.S, gameData);
      
      if (success) {
        // Create updated game object with new data but preserve GameID
        const updatedGame: Game = {
          ...game, // Keep existing DynamoDB structure
          GameTitle: { S: gameData.GameTitle },
          GameDescription: { S: gameData.GameDescription },
          Developer: { S: gameData.Developer },
          YearDeveloped: { S: gameData.YearDeveloped },
          Genre: { S: gameData.Genre },
          Photos: { SS: gameData.Photos },
          // Update other fields if they exist
          ...(gameData.Connectivity && { Connectivity: { S: gameData.Connectivity } }),
          ...(gameData.DeveloperLocation && { DeveloperLocation: { S: gameData.DeveloperLocation } }),
          ...(gameData.GameWebsite && { GameWebsite: { S: gameData.GameWebsite } }),
          ...(gameData.HardwareFeatures && { HardwareFeatures: { S: gameData.HardwareFeatures } }),
          ...(gameData.Players && { Players: { S: gameData.Players } }),
          ...(gameData.Purpose && { Purpose: { S: gameData.Purpose } }),
        };
        
        // Update local state instead of full refresh
        onUpdateGame(updatedGame);
        setEditingGame(null);
      } else {
        throw new Error('Failed to update game - API returned false');
      }
    } catch (err: any) {
      setOperationError(`Failed to update game: ${err.message}`);
    }
  };

  const handleDeleteGame = async (gameId: string) => {
    if (!confirm('Are you sure you want to delete this game? This action cannot be undone.')) return;
    
    setOperationError(null);
    try {
      const success = await GameAPI.deleteGame(gameId);
      
      if (success) {
        // Remove from local state instead of full refresh
        onDeleteGame(gameId);
        setSelectedGame(null);
      } else {
        throw new Error('Failed to delete game - API returned false');
      }
    } catch (err: any) {
      setOperationError(`Failed to delete game: ${err.message}`);
    }
  };

  // Data processing for research insights
  const uniqueGenres = Array.from(new Set(games.map(g => g.Genre?.S).filter(Boolean))).sort();
  const uniqueYears = Array.from(new Set(games.map(g => g.YearDeveloped?.S).filter(Boolean))).sort().reverse();
  const uniqueDevelopers = Array.from(new Set(games.map(g => g.Developer?.S).filter(Boolean))).sort();

  const eraData = {
    'Early Era': games.filter(g => {
      const year = parseInt(g.YearDeveloped?.S || '0');
      return year >= 1975 && year <= 1989;
    }),
    'Golden Age': games.filter(g => {
      const year = parseInt(g.YearDeveloped?.S || '0');
      return year >= 1990 && year <= 1999;
    }),
    'Modern Era': games.filter(g => {
      const year = parseInt(g.YearDeveloped?.S || '0');
      return year >= 2000 && year <= 2008;
    })
  };

  const stats = {
    totalGames: games.length,
    developers: uniqueDevelopers.length,
    genres: uniqueGenres.length,
    recentGames: games.filter(g => parseInt(g.YearDeveloped?.S || '0') >= 2000).length,
    documentedGames: games.filter(g => g.Photos?.SS?.length > 0).length,
    avgYear: Math.round(games.reduce((sum, g) => sum + parseInt(g.YearDeveloped?.S || '0'), 0) / games.length),
    topGenre: uniqueGenres.reduce((max, genre) => {
      const count = games.filter(g => g.Genre?.S === genre).length;
      return count > max.count ? { name: genre, count } : max;
    }, { name: '', count: 0 }),
    topDeveloper: uniqueDevelopers.reduce((max, dev) => {
      const count = games.filter(g => g.Developer?.S === dev).length;
      return count > max.count ? { name: dev, count } : max;
    }, { name: '', count: 0 })
  };

  const tabs = [
    { id: 'catalog', label: 'Game Catalog', icon: Archive },
    { id: 'overview', label: 'Collection Overview', icon: Gamepad2 },
    { id: 'timeline', label: 'Historical Timeline', icon: Clock },
    { id: 'research', label: 'Research Insights', icon: BookOpen }
  ];

  // Loading State
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="academic-card-elevated p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Loading Game Collection</h3>
          <p className="text-gray-600 text-lg">Retrieving retro mobile games from RMGD database...</p>
          <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-500">
            <span>• Historical Period: 1975-2008</span>
            <span>• Research Database</span>
            <span>• Academic Collection</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Research Header */}
      <div className="academic-card-elevated p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center shadow-lg">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-primary mb-2">Retro Mobile Gaming Collection</h2>
              <p className="text-secondary text-lg">Comprehensive historical archive spanning 1975-2008</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center space-x-1">
                  <Trophy className="w-4 h-4" />
                  <span>{stats.totalGames} Games Catalogued</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span>{stats.totalGames > 0 ? Math.round((stats.documentedGames / stats.totalGames) * 100) : 0}% Documented</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Research Active</span>
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-800 font-semibold">Database Active</span>
              </div>
              <p className="text-green-700 text-sm mt-1">Last sync: 2 minutes ago</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-medium shadow-lg text-base"
            >
              <Plus className="w-5 h-5" />
              <span>Add Game</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all font-medium text-base ${
                activeView === tab.id
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {(error || operationError) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <h4 className="text-red-800 font-semibold">Operation Error</h4>
              <p className="text-red-700">{error || operationError}</p>
            </div>
          </div>
          <button 
            onClick={() => setOperationError(null)}
            className="mt-3 text-red-600 hover:text-red-800 text-sm underline"
          >
            Dismiss Error
          </button>
        </div>
      )}

      {/* Overview Tab */}
      {activeView === 'overview' && (
        <div className="space-y-8">
          {/* Key Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Total Games', value: stats.totalGames, icon: Gamepad2, color: 'bg-red-50 border-red-200', iconColor: 'bg-red-600', textColor: 'text-red-800', change: '+12%' },
              { title: 'Unique Developers', value: stats.developers, icon: Users, color: 'bg-blue-50 border-blue-200', iconColor: 'bg-blue-600', textColor: 'text-blue-800', change: '+8%' },
              { title: 'Game Genres', value: stats.genres, icon: BarChart3, color: 'bg-green-50 border-green-200', iconColor: 'bg-green-600', textColor: 'text-green-800', change: '+3%' },
              { title: 'Documentation Rate', value: `${stats.totalGames > 0 ? Math.round((stats.documentedGames / stats.totalGames) * 100) : 0}%`, icon: BookOpen, color: 'bg-purple-50 border-purple-200', iconColor: 'bg-purple-600', textColor: 'text-purple-800', change: '+15%' }
            ].map((stat, idx) => (
              <div key={idx} className={`academic-card-elevated p-6 ${stat.color}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.iconColor} rounded-xl flex items-center justify-center shadow-sm`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-1 text-green-600 text-sm font-medium">
                    <TrendingUp className="w-4 h-4" />
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div>
                  <p className={`${stat.textColor} text-sm font-medium mb-1`}>{stat.title}</p>
                  <p className="text-gray-900 text-3xl font-bold">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Era Distribution */}
          <div className="academic-card-elevated p-8">
            <h3 className="text-2xl font-bold text-primary mb-6 flex items-center">
              <Clock className="w-7 h-7 mr-3 text-red-600" />
              Historical Era Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Object.entries(eraData).map(([era, gamesInEra], idx) => (
                <div key={era} className="text-center">
                  <div className={`w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg ${
                    idx === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-600' :
                    idx === 1 ? 'bg-gradient-to-br from-red-500 to-red-700' :
                    'bg-gradient-to-br from-blue-500 to-blue-700'
                  }`}>
                    <span className="text-white text-2xl font-bold">{gamesInEra.length}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg mb-2">{era}</h4>
                  <p className="text-gray-600 mb-3">
                    {stats.totalGames > 0 ? Math.round((gamesInEra.length / games.length) * 100) : 0}% of collection
                  </p>
                  <div className="bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full ${
                        idx === 0 ? 'bg-amber-500' :
                        idx === 1 ? 'bg-red-500' :
                        'bg-blue-500'
                      }`}
                      style={{ width: `${stats.totalGames > 0 ? (gamesInEra.length / games.length) * 100 : 0}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    {idx === 0 ? '1975-1989' : idx === 1 ? '1990-1999' : '2000-2008'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Research Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="academic-card-elevated p-8">
              <h4 className="text-xl font-bold text-primary mb-6">Top Performing Metrics</h4>
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-red-800 font-medium">Most Productive Developer</span>
                    <span className="text-red-900 font-bold">{stats.topDeveloper.name}</span>
                  </div>
                  <div className="text-sm text-red-700 mt-1">{stats.topDeveloper.count} games contributed</div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-800 font-medium">Dominant Genre</span>
                    <span className="text-blue-900 font-bold">{stats.topGenre.name}</span>
                  </div>
                  <div className="text-sm text-blue-700 mt-1">{stats.topGenre.count} games in category</div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-green-800 font-medium">Average Release Year</span>
                    <span className="text-green-900 font-bold">{stats.avgYear || 'N/A'}</span>
                  </div>
                  <div className="text-sm text-green-700 mt-1">Collection timeline midpoint</div>
                </div>
              </div>
            </div>

            <div className="academic-card-elevated p-8">
              <h4 className="text-xl font-bold text-primary mb-6">Collection Quality</h4>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 font-medium">Visual Documentation</span>
                    <span className="text-gray-900 font-bold">{stats.totalGames > 0 ? Math.round((stats.documentedGames / stats.totalGames) * 100) : 0}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full"
                      style={{ width: `${stats.totalGames > 0 ? (stats.documentedGames / stats.totalGames) * 100 : 0}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{stats.documentedGames} of {stats.totalGames} games have images</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 font-medium">Genre Diversity</span>
                    <span className="text-gray-900 font-bold">{stats.genres}</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full w-4/5" />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">High diversity across game categories</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 font-medium">Developer Coverage</span>
                    <span className="text-gray-900 font-bold">{stats.developers}</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full w-3/4" />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Comprehensive developer ecosystem</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timeline Tab */}
      {activeView === 'timeline' && (
        <div className="academic-card-elevated p-8">
          <h3 className="text-2xl font-bold text-primary mb-8 flex items-center">
            <Calendar className="w-7 h-7 mr-3 text-red-600" />
            Historical Development Timeline
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {uniqueYears.map((year) => {
              const yearGames = games.filter(g => g.YearDeveloped?.S === year);
              const maxCount = Math.max(...uniqueYears.map(y => games.filter(g => g.YearDeveloped?.S === y).length));
              return (
                <div key={year} className="flex items-center space-x-6 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                  <div className="w-20 text-center">
                    <span className="text-2xl font-bold text-gray-900">{year}</span>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-200 rounded-full h-4 mb-2">
                      <div 
                        className="bg-gradient-to-r from-red-500 to-red-600 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${(yearGames.length / maxCount) * 100}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{yearGames.length} games released</span>
                      <span className="text-gray-500">
                        Top: {
                          Object.entries(
                            yearGames.reduce((genres, game) => {
                              const genre = game.Genre?.S || 'Unknown';
                              genres[genre] = (genres[genre] || 0) + 1;
                              return genres;
                            }, {} as Record<string, number>)
                          )
                          .map(([genre, count]) => `${genre} (${count})`)
                          .join(', ')
                        }
                      </span>
                    </div>
                  </div>
                  <div className="text-right min-w-[4rem]">
                    <span className="text-2xl font-bold text-gray-900">{yearGames.length}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Research Tab */}
      {activeView === 'research' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="academic-card-elevated p-8">
              <h4 className="text-xl font-bold text-primary mb-6 flex items-center">
                <BookOpen className="w-6 h-6 mr-2 text-red-600" />
                Research Findings
              </h4>
              <div className="space-y-4">
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
                  <h5 className="font-semibold text-amber-800 mb-2">Historical Evolution</h5>
                  <p className="text-amber-700 text-sm">
                    The collection demonstrates clear technological evolution from simple 8-bit games 
                    in the 1970s to sophisticated mobile experiences by 2008.
                  </p>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                  <h5 className="font-semibold text-blue-800 mb-2">Genre Development</h5>
                  <p className="text-blue-700 text-sm">
                    {stats.topGenre.name} emerged as the dominant genre with {stats.topGenre.count} games, 
                    reflecting the technical constraints and user preferences of the era.
                  </p>
                </div>

                <div className="bg-green-50 border-l-4 border-green-400 p-4">
                  <h5 className="font-semibold text-green-800 mb-2">Developer Impact</h5>
                  <p className="text-green-700 text-sm">
                    {stats.topDeveloper.name} leads with {stats.topDeveloper.count} games, showing significant 
                    influence on mobile gaming evolution during this period.
                  </p>
                </div>
              </div>
            </div>

            <div className="academic-card-elevated p-8">
              <h4 className="text-xl font-bold text-primary mb-6">Academic Applications</h4>
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <h5 className="font-semibold text-red-800 mb-2">Digital Humanities</h5>
                  <p className="text-red-700 text-sm">Cultural impact analysis of early mobile gaming</p>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <h5 className="font-semibold text-purple-800 mb-2">Technology Studies</h5>
                  <p className="text-purple-700 text-sm">Hardware-software co-evolution patterns</p>
                </div>

                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                  <h5 className="font-semibold text-indigo-800 mb-2">Game Studies</h5>
                  <p className="text-indigo-700 text-sm">Genre emergence and design pattern analysis</p>
                </div>

                <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                  <h5 className="font-semibold text-teal-800 mb-2">Media Archaeology</h5>
                  <p className="text-teal-700 text-sm">Preservation of digital gaming heritage</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Catalog Tab */}
      {activeView === 'catalog' && (
        <div className="space-y-6">
          {/* Advanced Search and Filters */}
          <div className="academic-card-elevated p-6">
            <div className="flex flex-col space-y-4">
              {/* Search Bar */}
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  {/* <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /> */}
                  <input
                    type="text"
                    placeholder="Search games, developers, descriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="academic-input w-full pl-12 pr-4 text-base placeholder-gray-500"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 bg-gray-100 rounded-xl p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Filter Row */}
              <div className="flex flex-wrap gap-3">
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="academic-input text-sm min-w-[120px]"
                >
                  <option value="">All Genres</option>
                  {uniqueGenres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>

                <select
                  value={selectedEra}
                  onChange={(e) => setSelectedEra(e.target.value)}
                  className="academic-input text-sm min-w-[120px]"
                >
                  <option value="">All Eras</option>
                  <option value="1975-1989">Early Era (1975-1989)</option>
                  <option value="1990-1999">Golden Age (1990-1999)</option>
                  <option value="2000-2008">Modern Era (2000-2008)</option>
                </select>

                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="academic-input text-sm min-w-[120px]"
                >
                  <option value="">All Years</option>
                  {uniqueYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>

                {(searchTerm || selectedGenre || selectedYear || selectedEra) && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedGenre('');
                      setSelectedYear('');
                      setSelectedEra('');
                    }}
                    className="px-3 py-2 text-red-600 hover:text-red-800 text-sm underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              {/* Filter Summary */}
              {(searchTerm || selectedGenre || selectedYear || selectedEra) && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Filter className="w-4 h-4" />
                  <span>Showing {filteredGames.length} of {games.length} games</span>
                </div>
              )}
            </div>
          </div>

          {/* Game Cards/List */}
          {filteredGames.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredGames.map((game) => (
                <GameCard
                  key={game.GameID?.S}
                  game={game}
                  viewMode={viewMode}
                  onEdit={setEditingGame}
                  onView={setSelectedGame}
                  onDelete={handleDeleteGame}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Gamepad2 className="w-20 h-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No games found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search criteria or filters.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedGenre('');
                  setSelectedYear('');
                  setSelectedEra('');
                }}
                className="text-red-600 hover:text-red-800 underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {showAddForm && (
        <AddGameModal
          onSubmit={handleAddGame}
          onCancel={() => setShowAddForm(false)}
          loading={loading}
        />
      )}

      {selectedGame && (
        <GameDetailModal 
          game={selectedGame} 
          onClose={() => setSelectedGame(null)}
          onEdit={setEditingGame}
          onDelete={handleDeleteGame}
        />
      )}

      {editingGame && (
        <EditGameModal
          game={editingGame}
          onSave={handleUpdateGame}
          onCancel={() => setEditingGame(null)}
          loading={loading}
        />
      )}
    </div>
  );
}