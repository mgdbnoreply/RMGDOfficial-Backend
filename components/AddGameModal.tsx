import { useState } from 'react';
import { X, Save, Plus, Info } from 'lucide-react';
import { NewGame } from '@/types';

interface AddGameModalProps {
  onSubmit: (game: NewGame) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export default function AddGameModal({ onSubmit, onCancel, loading }: AddGameModalProps) {
  const [formData, setFormData] = useState<NewGame>({
    GameTitle: '',
    GameDescription: '',
    Developer: '',
    YearDeveloped: '',
    Genre: '',
    Photos: []
  });

  const [photoInput, setPhotoInput] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async () => {
    if (!formData.GameTitle.trim() || !formData.Developer.trim()) {
      setValidationError('Game Title and Developer are required fields');
      return;
    }
    setValidationError('');
    await onSubmit(formData);
  };

  const handleInputChange = (field: keyof NewGame, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError('');
    }
  };

  const addPhoto = () => {
    if (photoInput.trim()) {
      setFormData(prev => ({
        ...prev,
        Photos: [...prev.Photos, photoInput.trim()]
      }));
      setPhotoInput('');
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      Photos: prev.Photos.filter((_, i) => i !== index)
    }));
  };

  const commonGenres = [
    'Action', 'Adventure', 'Puzzle', 'Strategy', 'Sports', 'Racing',
    'Simulation', 'Arcade', 'RPG', 'Platform', 'Shooter', 'Educational'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Add New Game</h3>
              <p className="text-gray-600 mt-1">Add a new game to the RMGD collection</p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="academic-card p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-2 h-6 bg-red-600 rounded mr-3"></div>
              Basic Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-base font-medium mb-2">
                  Game Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.GameTitle}
                  onChange={(e) => handleInputChange('GameTitle', e.target.value)}
                  className="academic-input w-full text-base"
                  placeholder="Enter the game title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-base font-medium mb-2">
                  Developer <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.Developer}
                  onChange={(e) => handleInputChange('Developer', e.target.value)}
                  className="academic-input w-full text-base"
                  placeholder="Developer or company name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-base font-medium mb-2">Year Developed</label>
                <input
                  type="number"
                  min="1975"
                  max="2008"
                  value={formData.YearDeveloped}
                  onChange={(e) => handleInputChange('YearDeveloped', e.target.value)}
                  className="academic-input w-full text-base"
                  placeholder="1975-2008"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 text-base font-medium mb-2">Genre</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={formData.Genre}
                  onChange={(e) => handleInputChange('Genre', e.target.value)}
                  className="academic-input text-base"
                >
                  <option value="">Select a genre</option>
                  {commonGenres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={formData.Genre}
                  onChange={(e) => handleInputChange('Genre', e.target.value)}
                  className="academic-input text-base"
                  placeholder="Or enter custom genre"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="academic-card p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-2 h-6 bg-blue-600 rounded mr-3"></div>
              Game Description
            </h4>
            <textarea
              value={formData.GameDescription}
              onChange={(e) => handleInputChange('GameDescription', e.target.value)}
              rows={4}
              className="academic-input w-full text-base"
              placeholder="Detailed description of the game, its gameplay, historical significance, and any notable features..."
            />
          </div>

          {/* Photos */}
          <div className="academic-card p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-2 h-6 bg-green-600 rounded mr-3"></div>
              Visual Documentation
            </h4>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={photoInput}
                  onChange={(e) => setPhotoInput(e.target.value)}
                  className="academic-input flex-1 text-base"
                  placeholder="Enter image URL"
                />
                <button
                  type="button"
                  onClick={addPhoto}
                  disabled={!photoInput.trim()}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>

              {formData.Photos.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Added Photos ({formData.Photos.length})</p>
                  <div className="grid grid-cols-1 gap-2">
                    {formData.Photos.map((url, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700 truncate flex-1 mr-3">{url}</span>
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-blue-900 mb-2">RMGD Collection Guidelines</h5>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Games should be from the historical period 1975-2008</li>
                  <li>• Include detailed descriptions for research value</li>
                  <li>• Add visual documentation when available</li>
                  <li>• Verify developer and year information for accuracy</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl">
          {validationError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{validationError}</p>
            </div>
          )}
          <div className="flex justify-end space-x-4">
            <button
              onClick={onCancel}
              className="px-6 py-3 text-gray-700 hover:text-gray-900 transition-colors text-base font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !formData.GameTitle.trim() || !formData.Developer.trim()}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed text-base"
            >
              <Save className="w-5 h-5" />
              <span>{loading ? 'Adding Game...' : 'Add to Collection'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}