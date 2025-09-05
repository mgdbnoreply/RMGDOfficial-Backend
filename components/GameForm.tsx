import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { NewGame } from '@/types';

interface GameFormProps {
  onSubmit: (game: NewGame) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export default function GameForm({ onSubmit, onCancel, loading }: GameFormProps) {
  const [formData, setFormData] = useState<NewGame>({
    GameTitle: '',
    GameDescription: '',
    Developer: '',
    YearDeveloped: '',
    Genre: '',
    Photos: [],
    Videos: [],
    Connectivity: '',
    ControlMechanisms: '',
    DeveloperLocation: '',
    DeviceType: '',
    GameWebsite: '',
    HardwareFeatures: '',
    MobilityType: '',
    MonetizationModel: '',
    OpenSource: '',
    Players: '',
    Purpose: '',
    SiteSpecific: '',
  });

  const handleSubmit = async () => {
    if (!formData.GameTitle.trim()) return;
    await onSubmit(formData);
  };

  const handleInputChange = (field: keyof NewGame, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Add New Game</h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Game Title"
          value={formData.GameTitle}
          onChange={(e) => handleInputChange('GameTitle', e.target.value)}
          className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <input
          type="text"
          placeholder="Developer"
          value={formData.Developer}
          onChange={(e) => handleInputChange('Developer', e.target.value)}
          className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <input
          type="text"
          placeholder="Year Developed"
          value={formData.YearDeveloped}
          onChange={(e) => handleInputChange('YearDeveloped', e.target.value)}
          className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <input
          type="text"
          placeholder="Genre"
          value={formData.Genre}
          onChange={(e) => handleInputChange('Genre', e.target.value)}
          className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <textarea
          placeholder="Game Description"
          value={formData.GameDescription}
          onChange={(e) => handleInputChange('GameDescription', e.target.value)}
          rows={3}
          className="md:col-span-2 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>
      
      <div className="flex justify-end mt-6 space-x-3">
        <button
          onClick={onCancel}
          className="px-6 py-3 text-gray-300 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all font-medium disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          <span>{loading ? 'Adding...' : 'Add Game'}</span>
        </button>
      </div>
    </div>
  );
}