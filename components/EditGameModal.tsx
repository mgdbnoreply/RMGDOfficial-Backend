import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { Game } from '@/types';

interface EditGameModalProps {
  game: Game;
  onSave: (game: Game) => void;
  onCancel: () => void;
  loading: boolean;
}

export default function EditGameModal({ game, onSave, onCancel, loading }: EditGameModalProps) {
  const [editData, setEditData] = useState<Game>(game);

  const updateField = (field: string, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: { S: value }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl p-8 border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">Edit Game</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Game Title</label>
            <input
              type="text"
              value={editData.GameTitle?.S || ''}
              onChange={(e) => updateField('GameTitle', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Developer</label>
            <input
              type="text"
              value={editData.Developer?.S || ''}
              onChange={(e) => updateField('Developer', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Year Developed</label>
            <input
              type="number"
              min="1975"
              max="2008"
              value={editData.YearDeveloped?.S || ''}
              onChange={(e) => updateField('YearDeveloped', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Genre</label>
            <input
              type="text"
              value={editData.Genre?.S || ''}
              onChange={(e) => updateField('Genre', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
          <textarea
            value={editData.GameDescription?.S || ''}
            onChange={(e) => updateField('GameDescription', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        
        <div className="flex justify-end mt-8 space-x-4">
          <button
            onClick={onCancel}
            className="px-6 py-3 text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(editData)}
            disabled={loading || !editData.GameTitle?.S?.trim()}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all font-medium disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

