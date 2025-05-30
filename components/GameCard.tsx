import { Edit2, Trash2, Eye, Users, Calendar, Tag } from 'lucide-react';
import { Game } from '@/types';

interface GameCardProps {
  game: Game;
  viewMode: 'grid' | 'list';
  onEdit: (game: Game) => void;
  onView: (game: Game) => void;
  onDelete: (gameId: string) => void;
}

export default function GameCard({ game, viewMode, onEdit, onView, onDelete }: GameCardProps) {
  const getGenreColor = (genre: string) => {
    const colors = {
      'Action': 'bg-red-100 text-red-800 border-red-200',
      'Adventure': 'bg-blue-100 text-blue-800 border-blue-200',
      'Puzzle': 'bg-purple-100 text-purple-800 border-purple-200',
      'Strategy': 'bg-green-100 text-green-800 border-green-200',
      'Sports': 'bg-orange-100 text-orange-800 border-orange-200',
      'Racing': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Simulation': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Arcade': 'bg-pink-100 text-pink-800 border-pink-200',
    };
    return colors[genre] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getYearColor = (year: string) => {
    const yearNum = parseInt(year);
    if (yearNum >= 2000) return 'bg-green-100 text-green-800 border-green-200';
    if (yearNum >= 1990) return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-amber-100 text-amber-800 border-amber-200';
  };

  if (viewMode === 'list') {
    return (
      <div className="academic-card-elevated p-6 hover:shadow-lg transition-all duration-200 group">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-700 transition-colors mb-2">
                  {game.GameTitle?.S || 'Unknown Title'}
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getGenreColor(game.Genre?.S || 'Unknown')}`}>
                    <Tag className="w-3 h-3 inline mr-1" />
                    {game.Genre?.S || 'Unknown'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getYearColor(game.YearDeveloped?.S || '0')}`}>
                    <Calendar className="w-3 h-3 inline mr-1" />
                    {game.YearDeveloped?.S || 'Unknown'}
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onView(game)}
                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all"
                  title="View Details"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onEdit(game)}
                  className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all"
                  title="Edit Game"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDelete(game.GameID?.S)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all"
                  title="Delete Game"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <p className="text-gray-600 text-base mb-4 leading-relaxed line-clamp-2">
              {game.GameDescription?.S || 'No description available.'}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-700">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">{game.Developer?.S || 'Unknown Developer'}</span>
                </div>
                {game.Photos?.SS?.length > 0 && (
                  <div className="flex items-center space-x-1 text-gray-500">
                    <div className="w-4 h-4 bg-gray-400 rounded"></div>
                    <span className="text-sm">{game.Photos.SS.length} photo{game.Photos.SS.length !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
              
              <div className="text-xs text-gray-500 font-mono">
                ID: {game.GameID?.S?.substring(0, 8)}...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="academic-card-elevated p-6 hover:shadow-lg transition-all duration-200 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-700 transition-colors leading-tight">
            {game.GameTitle?.S || 'Unknown Title'}
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getGenreColor(game.Genre?.S || 'Unknown')}`}>
              <Tag className="w-3 h-3 inline mr-1" />
              {game.Genre?.S || 'Unknown'}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getYearColor(game.YearDeveloped?.S || '0')}`}>
              <Calendar className="w-3 h-3 inline mr-1" />
              {game.YearDeveloped?.S || 'Unknown'}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onView(game)}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(game)}
            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all"
            title="Edit Game"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(game.GameID?.S)}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all"
            title="Delete Game"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-gray-600 text-base mb-4 leading-relaxed line-clamp-3">
        {game.GameDescription?.S || 'No description available for this game.'}
      </p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{game.Developer?.S || 'Unknown Developer'}</p>
            <p className="text-xs text-gray-500">Developer</p>
          </div>
        </div>
        
        {game.Photos?.SS?.length > 0 && (
          <div className="flex items-center space-x-1 text-gray-500">
            <div className="w-4 h-4 bg-gray-400 rounded"></div>
            <span className="text-sm">{game.Photos.SS.length}</span>
          </div>
        )}
      </div>

      {/* Photo Preview */}
      {game.Photos?.SS?.length > 0 && (
        <div className="border-t border-gray-100 pt-4">
          <div className="flex gap-2 overflow-x-auto">
            {game.Photos.SS.slice(0, 4).map((url, i) => (
              <div key={i} className="flex-shrink-0">
                <img
                  src={url}
                  alt={`${game.GameTitle?.S} screenshot ${i + 1}`}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-200 hover:border-red-300 transition-colors"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyNEwyNCAyMEwyOCAyNEgzNlYzMkgzMkwyOCAzNkwyNCAzMkgyMFYyNFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                  }}
                />
              </div>
            ))}
            {game.Photos.SS.length > 4 && (
              <div className="flex-shrink-0 w-16 h-16 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 text-xs font-medium">+{game.Photos.SS.length - 4}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-100 pt-4 mt-4">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500 font-mono">
            ID: {game.GameID?.S?.substring(0, 12)}...
          </div>
          <button
            onClick={() => onView(game)}
            className="text-sm text-red-600 hover:text-red-800 font-medium hover:underline transition-colors"
          >
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
}