import { X, Edit2, Trash2, Calendar, Tag, Users, Image, Hash, Tv, Gamepad, Globe, Cpu, Wifi, Users2, Building, DollarSign, Code, Info, PlayCircle } from 'lucide-react';
import { Game } from '@/types';

interface GameDetailModalProps {
  game: Game;
  onClose: () => void;
  onEdit: (game: Game) => void;
  onDelete: (gameId: string) => void;
}

// A helper to render detail items consistently
const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value?: string }) => {
    if (!value || value === 'Unknown' || value === 'N/A') return null;
    return (
        <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
                <Icon className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-900">{label}</span>
            </div>
            <p className="text-gray-700 text-base ml-8">{value}</p>
        </div>
    );
};

export default function GameDetailModal({ game, onClose, onEdit, onDelete }: GameDetailModalProps) {
  const getGenreColor = (genre: string) => {
    // ... same color logic as before
    const colors: { [key: string]: string } = {
      Action: 'bg-red-100 text-red-800 border-red-200',
      Adventure: 'bg-blue-100 text-blue-800 border-blue-200',
      Puzzle: 'bg-purple-100 text-purple-800 border-purple-200',
      Strategy: 'bg-green-100 text-green-800 border-green-200',
      Sports: 'bg-orange-100 text-orange-800 border-orange-200',
      Racing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Simulation: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      Arcade: 'bg-pink-100 text-pink-800 border-pink-200',
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
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
            <div className="lg:col-span-2 space-y-6">
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><div className="w-2 h-6 bg-blue-600 rounded mr-3"></div>Developer & Technical Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DetailItem icon={Building} label="Developer" value={game.Developer?.S} />
                        <DetailItem icon={Users2} label="Players" value={(game as any).Players?.S} />
                        <DetailItem icon={Globe} label="Developer Location" value={(game as any).DeveloperLocation?.S} />
                        <DetailItem icon={Cpu} label="Hardware Features" value={(game as any).HardwareFeatures?.S} />
                        <DetailItem icon={Wifi} label="Connectivity" value={(game as any).Connectivity?.S} />
                        <DetailItem icon={Info} label="Purpose" value={(game as any).Purpose?.S} />
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Media */}
              {(game.Photos?.SS?.length > 0) && (
                <div className="academic-card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><div className="w-2 h-6 bg-green-600 rounded mr-3"></div>Media Assets</h3>
                    {game.Photos?.SS?.length > 0 && (
                        <div className="mb-4">
                            <h4 className="font-medium text-gray-800 mb-2">Screenshots</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {game.Photos.SS.map((url, i) => (
                                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="relative group">
                                        <img src={url} alt={`Screenshot ${i + 1}`} className="w-full h-24 object-cover rounded-lg border border-gray-200" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
              )}

              {/* Actions */}
              <div className="academic-card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => { onEdit(game); onClose(); }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-medium"
                  >
                    <Edit2 className="w-5 h-5" />
                    <span>Edit Game</span>
                  </button>
                  <button
                    onClick={() => { onDelete(game.GameID?.S); onClose(); }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-medium"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span>Delete Game</span>
                  </button>
                </div>
              </div>

               {/* Game ID */}
              <div className="academic-card p-4">
                  <div className="flex items-center space-x-2">
                      <Hash className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-900">Game ID</span>
                  </div>
                  <p className="text-gray-700 font-mono text-sm mt-1">{game.GameID?.S}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}