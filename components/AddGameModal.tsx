import { useState } from 'react';
import { X, Save, Plus, Info } from 'lucide-react';
import { NewGame } from '@/types';

interface AddGameModalProps {
  onSubmit: (game: NewGame & { [key: string]: any }) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export default function AddGameModal({ onSubmit, onCancel, loading }: AddGameModalProps) {
  const [formData, setFormData] = useState<NewGame & { [key: string]: any }>({
    GameTitle: '',
    GameDescription: '',
    Developer: '',
    YearDeveloped: '',
    Genre: '',
    Photos: [],
    Connectivity: 'N/A',
    ControlMechanisms: 'Unknown',
    DeveloperLocation: 'Unknown',
    DeviceType: 'Unknown',
    GameWebsite: 'N/A',
    HardwareFeatures: 'Unknown',
    MobilityType: 'Unknown',
    MonetizationModel: 'Unknown',
    OpenSource: 'N',
    Players: 'Unknown',
    Purpose: 'Entertainment',
    SiteSpecific: 'Unknown',
    Videos: []
  });

  const [photoInput, setPhotoInput] = useState('');
  const [videoInput, setVideoInput] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async () => {
    if (!formData.GameTitle.trim() || !formData.Developer.trim()) {
      setValidationError('Game Title and Developer are required fields');
      return;
    }
    setValidationError('');
    
    // Filter out empty strings from Photos and Videos
    const finalData = {
        ...formData,
        Photos: formData.Photos.filter((p: string) => p.trim() !== ''),
        Videos: formData.Videos.filter((v: string) => v.trim() !== '')
    };

    await onSubmit(finalData);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      Photos: prev.Photos.filter((_: any, i: number) => i !== index)
    }));
  };

    const addVideo = () => {
    if (videoInput.trim()) {
      setFormData(prev => ({
        ...prev,
        Videos: [...prev.Videos, videoInput.trim()]
      }));
      setVideoInput('');
    }
  };

  const removeVideo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      Videos: prev.Videos.filter((_: any, i: number) => i !== index)
    }));
  };

  const commonGenres = [
    'Action', 'Adventure', 'Puzzle', 'Strategy', 'Sports', 'Racing',
    'Simulation', 'Arcade', 'RPG', 'Platform', 'Shooter', 'Educational'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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
                    <label className="block text-gray-700 text-base font-medium mb-2">Game Title <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.GameTitle} onChange={(e) => handleInputChange('GameTitle', e.target.value)} className="academic-input w-full" required />
                </div>
                <div>
                    <label className="block text-gray-700 text-base font-medium mb-2">Developer <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.Developer} onChange={(e) => handleInputChange('Developer', e.target.value)} className="academic-input w-full" required />
                </div>
                <div>
                    <label className="block text-gray-700 text-base font-medium mb-2">Year Developed</label>
                    <input type="number" min="1975" max="2008" value={formData.YearDeveloped} onChange={(e) => handleInputChange('YearDeveloped', e.target.value)} className="academic-input w-full" />
                </div>
                <div>
                    <label className="block text-gray-700 text-base font-medium mb-2">Genre</label>
                    <select value={formData.Genre} onChange={(e) => handleInputChange('Genre', e.target.value)} className="academic-input w-full">
                        <option value="">Select a genre</option>
                        {commonGenres.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="block text-gray-700 text-base font-medium mb-2">Developer Location</label>
                    <input type="text" value={formData.DeveloperLocation} onChange={(e) => handleInputChange('DeveloperLocation', e.target.value)} className="academic-input w-full" />
                </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="academic-card p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-2 h-6 bg-blue-600 rounded mr-3"></div>
              Detailed Information
            </h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-gray-700 text-base font-medium mb-2">Purpose</label>
                    <input type="text" value={formData.Purpose} onChange={(e) => handleInputChange('Purpose', e.target.value)} className="academic-input w-full" />
                </div>
                 <div>
                    <label className="block text-gray-700 text-base font-medium mb-2">Hardware Features</label>
                    <input type="text" value={formData.HardwareFeatures} onChange={(e) => handleInputChange('HardwareFeatures', e.target.value)} className="academic-input w-full" />
                </div>
                 <div>
                    <label className="block text-gray-700 text-base font-medium mb-2">Connectivity</label>
                    <input type="text" value={formData.Connectivity} onChange={(e) => handleInputChange('Connectivity', e.target.value)} className="academic-input w-full" />
                </div>
                 <div>
                    <label className="block text-gray-700 text-base font-medium mb-2">Players</label>
                    <input type="text" value={formData.Players} onChange={(e) => handleInputChange('Players', e.target.value)} className="academic-input w-full" />
                </div>
             </div>
          </div>

          {/* Description */}
          <div className="academic-card p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-2 h-6 bg-purple-600 rounded mr-3"></div>
              Game Description
            </h4>
            <textarea
              value={formData.GameDescription}
              onChange={(e) => handleInputChange('GameDescription', e.target.value)}
              rows={4}
              className="academic-input w-full"
              placeholder="Detailed description of the game..."
            />
          </div>

          {/* Media */}
          <div className="academic-card p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-2 h-6 bg-green-600 rounded mr-3"></div>
                Visual Documentation
            </h4>
            <div className="space-y-4">
                <div>
                    <label className="block text-gray-700 text-base font-medium mb-2">Photo URLs</label>
                    <div className="flex gap-2">
                        <input type="url" value={photoInput} onChange={(e) => setPhotoInput(e.target.value)} className="academic-input flex-1" placeholder="Enter image URL"/>
                        <button type="button" onClick={addPhoto} disabled={!photoInput.trim()} className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50">
                            <Plus className="w-4 h-4" /><span>Add</span>
                        </button>
                    </div>
                </div>
                {formData.Photos.length > 0 && (
                    <div className="space-y-2">
                        <div className="grid grid-cols-1 gap-2">
                            {formData.Photos.map((url: string, index: number) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-sm text-gray-700 truncate flex-1 mr-3">{url}</span>
                                    <button type="button" onClick={() => removePhoto(index)} className="text-red-600 hover:text-red-800 p-1"><X className="w-4 h-4" /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
             <div className="space-y-4 mt-4">
                <div>
                    <label className="block text-gray-700 text-base font-medium mb-2">Video URLs</label>
                    <div className="flex gap-2">
                        <input type="url" value={videoInput} onChange={(e) => setVideoInput(e.target.value)} className="academic-input flex-1" placeholder="Enter video URL"/>
                        <button type="button" onClick={addVideo} disabled={!videoInput.trim()} className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50">
                            <Plus className="w-4 h-4" /><span>Add</span>
                        </button>
                    </div>
                </div>
                {formData.Videos.length > 0 && (
                    <div className="space-y-2">
                        <div className="grid grid-cols-1 gap-2">
                            {formData.Videos.map((url: string, index: number) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-sm text-gray-700 truncate flex-1 mr-3">{url}</span>
                                    <button type="button" onClick={() => removeVideo(index)} className="text-red-600 hover:text-red-800 p-1"><X className="w-4 h-4" /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
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
            <button onClick={onCancel} className="px-6 py-3 text-gray-700 hover:text-gray-900 transition-colors font-medium">Cancel</button>
            <button onClick={handleSubmit} disabled={loading || !formData.GameTitle.trim() || !formData.Developer.trim()} className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-medium disabled:opacity-50">
              <Save className="w-5 h-5" />
              <span>{loading ? 'Adding Game...' : 'Add to Collection'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
