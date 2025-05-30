import { useState, useEffect } from 'react';
import { Search, Plus, Gamepad2, Users, BarChart3, Calendar, Grid, List, AlertCircle } from 'lucide-react';
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
}

export default function GamesTab({ games, loading, error, onRefresh }: GamesTabProps) {
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [operationError, setOperationError] = useState<string | null>(null);

  useEffect(() => {
    filterGames();
  }, [games, searchTerm, selectedGenre, selectedYear]);

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

    setFilteredGames(filtered);
  };

  const handleAddGame = async (newGame: NewGame) => {
    setOperationError(null);
    try {
      const gameData = {
        GameTitle: { S: newGame.GameTitle },
        GameDescription: { S: newGame.GameDescription },
        Developer: { S: newGame.Developer },
        YearDeveloped: { S: newGame.YearDeveloped },
        Genre: { S: newGame.Genre },
        Photos: { SS: newGame.Photos.filter(p => p.trim()) }
      };

      const success = await GameAPI.createGame(gameData);
      
      if (success) {
        await onRefresh();
        setShowAddForm(false);
      } else {
        throw new Error('Failed to add game - API returned false');
      }
    } catch (err: any) {
      setOperationError(`Failed to add game: ${err.message}`);
    }
  };

  const handleUpdateGame = async (game: Game) => {
    setOperationError(null);
    try {
      const success = await GameAPI.updateGame(game.GameID.S, game);
      
      if (success) {
        await onRefresh();
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
        await onRefresh();
        setSelectedGame(null);
      } else {
        throw new Error('Failed to delete game - API returned false');
      }
    } catch (err: any) {
      setOperationError(`Failed to delete game: ${err.message}`);
    }
  };

  const uniqueGenres = Array.from(new Set(games.map(g => g.Genre?.S).filter(Boolean))).sort();
  const uniqueYears = Array.from(new Set(games.map(g => g.YearDeveloped?.S).filter(Boolean))).sort().reverse();

  const stats = {
    totalGames: games.length,
    developers: new Set(games.map(g => g.Developer?.S)).size,
    genres: uniqueGenres.length,
    recentGames: games.filter(g => parseInt(g.YearDeveloped?.S || '0') >= 2000).length
  };

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Games', value: stats.totalGames, icon: Gamepad2, color: 'bg-red-50 border-red-200', iconColor: 'bg-red-600', textColor: 'text-red-800' },
          { title: 'Developers', value: stats.developers, icon: Users, color: 'bg-blue-50 border-blue-200', iconColor: 'bg-blue-600', textColor: 'text-blue-800' },
          { title: 'Genres', value: stats.genres, icon: BarChart3, color: 'bg-green-50 border-green-200', iconColor: 'bg-green-600', textColor: 'text-green-800' },
          { title: 'Modern Era (2000+)', value: stats.recentGames, icon: Calendar, color: 'bg-purple-50 border-purple-200', iconColor: 'bg-purple-600', textColor: 'text-purple-800' }
        ].map((stat, idx) => (
          <div key={idx} className={`academic-card-elevated p-6 ${stat.color}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${stat.textColor} text-sm font-medium mb-1`}>{stat.title}</p>
                <p className="text-gray-900 text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.iconColor} rounded-xl flex items-center justify-center shadow-sm`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="academic-card-elevated p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search games, developers, descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="academic-input w-full pl-12 pr-4 text-base placeholder-gray-500"
              />
            </div>
            
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="academic-input text-base"
            >
              <option value="">All Genres</option>
              {uniqueGenres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="academic-input text-base"
            >
              <option value="">All Years</option>
              {uniqueYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
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
            
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-medium shadow-lg text-base"
            >
              <Plus className="w-5 h-5" />
              <span>Add Game</span>
            </button>
          </div>
        </div>

        {(searchTerm || selectedGenre || selectedYear) && (
          <div className="mt-4 flex items-center space-x-2">
            <span className="text-gray-600 text-sm">Showing {filteredGames.length} of {games.length} games</span>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedGenre('');
                setSelectedYear('');
              }}
              className="text-red-600 hover:text-red-800 text-sm underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Error Display */}
      {(error || operationError) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error || operationError}</p>
          </div>
          <button 
            onClick={() => setOperationError(null)}
            className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
          <p className="text-gray-700 text-lg">Loading retro games...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredGames.length === 0 && !error && (
        <div className="text-center py-16">
          <Gamepad2 className="w-20 h-20 text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No games found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or add a new game to the collection.</p>
        </div>
      )}

      {/* Game Cards/List */}
      {!loading && filteredGames.length > 0 && (
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