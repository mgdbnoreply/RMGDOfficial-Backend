import { X, Edit2, Trash2, Calendar, Tag, Users, Image, Hash } from 'lucide-react';
import { Game } from '@/types';

interface GameDetailModalProps {
  game: Game;
  onClose: () => void;
  onEdit: (game: Game) => void;
  onDelete: (gameId: string) => void;
}

export default function GameDetailModal({ game, onClose, onEdit, onDelete }: GameDetailModalProps) {
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">{game.GameTitle?.S || 'Unknown Title'}</h2>
              <div className="flex flex-wrap gap-2">
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
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all ml-4"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Description */}
                <div className="academic-card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-2 h-6 bg-red-600 rounded mr-3"></div>
                    Game Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-base">
                    {game.GameDescription?.S || 'No description available for this game.'}
                  </p>
                </div>

                {/* Developer Information */}
                <div className="academic-card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-2 h-6 bg-blue-600 rounded mr-3"></div>
                    Developer Information
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">{game.Developer?.S || 'Unknown Developer'}</p>
                      <p className="text-gray-600">Game Developer</p>
                    </div>
                  </div>
                </div>

                {/* Technical Details */}
                <div className="academic-card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-2 h-6 bg-purple-600 rounded mr-3"></div>
                    Technical Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Hash className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-900">Game ID</span>
                      </div>
                      <p className="text-gray-700 font-mono text-sm">{game.GameID?.S}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Image className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-900">Documentation</span>
                      </div>
                      <p className="text-gray-700">
                        {game.Photos?.SS?.length || 0} visual asset{(game.Photos?.SS?.length || 0) !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Screenshots */}
              {game.Photos?.SS?.length > 0 && (
                <div className="academic-card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-2 h-6 bg-green-600 rounded mr-3"></div>
                    Screenshots
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {game.Photos.SS.map((url, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={url}
                          alt={`${game.GameTitle?.S} screenshot ${i + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200 hover:border-red-300 transition-colors"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDIwMCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCA2NEw5MCA1NEwxMDAgNjRIMTIwVjg0SDExMEwxMDAgOTRMOTAgODRIODBWNjRaIiBmaWxsPSIjOUNBM0FGIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUNBM0FGIiBmb250LXNpemU9IjEyIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pgo8L3N2Zz4=';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-medium">
                            Screenshot {i + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="academic-card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      onEdit(game);
                      onClose();
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-medium"
                  >
                    <Edit2 className="w-5 h-5" />
                    <span>Edit Game</span>
                  </button>
                  <button
                    onClick={() => {
                      onDelete(game.GameID?.S);
                      onClose();
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-medium"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span>Delete Game</span>
                  </button>
                </div>
              </div>

              {/* Research Notes */}
              <div className="academic-card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Research Context</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-amber-800 font-medium">Historical Period</p>
                    <p className="text-amber-700">Part of RMGD collection (1975-2008)</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-blue-800 font-medium">Academic Value</p>
                    <p className="text-blue-700">Mobile gaming evolution research</p>
                  </div>
                  {game.Photos?.SS?.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-green-800 font-medium">Documentation</p>
                      <p className="text-green-700">Visual assets preserved</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}