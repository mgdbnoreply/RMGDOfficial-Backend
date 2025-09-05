import { useState } from 'react';
import { X, Save, Plus, Info } from 'lucide-react';
import { NewGame } from '@/types';

interface AddGameModalProps {
  onSubmit: (game: NewGame & { [key: string]: any }) => Promise<void>;
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

  const [photoInput, setPhotoInput] = useState('');
  const [videoInput, setVideoInput] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async () => {
    if (!formData.GameTitle.trim() || !formData.Developer.trim()) {
      setValidationError('Game Title and Developer are required fields');
      return;
    }
    setValidationError('');
    await onSubmit(formData);
  };

  const handleInputChange = (field: keyof NewGame, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationError) {
      setValidationError('');
    }
  };

  const addPhoto = () => {
    if (photoInput.trim()) {
      handleInputChange('Photos', [...formData.Photos, photoInput.trim()]);
      setPhotoInput('');
    }
  };

  const removePhoto = (index: number) => {
    handleInputChange('Photos', formData.Photos.filter((_, i) => i !== index));
  };
  
  const addVideo = () => {
    if (videoInput.trim()) {
      handleInputChange('Videos', [...formData.Videos, videoInput.trim()]);
      setVideoInput('');
    }
  };

  const removeVideo = (index: number) => {
    handleInputChange('Videos', formData.Videos.filter((_, i) => i !== index));
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
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Game Title <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.GameTitle} onChange={(e) => handleInputChange('GameTitle', e.target.value)} className="academic-input w-full" placeholder="e.g., Snake" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Developer <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.Developer} onChange={(e) => handleInputChange('Developer', e.target.value)} className="academic-input w-full" placeholder="e.g., Nokia" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year Developed</label>
                    <input type="number" value={formData.YearDeveloped} onChange={(e) => handleInputChange('YearDeveloped', e.target.value)} className="academic-input w-full" placeholder="e.g., 1997" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                    <input type="text" value={formData.Genre} onChange={(e) => handleInputChange('Genre', e.target.value)} className="academic-input w-full" placeholder="e.g., Puzzle" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Developer Location</label>
                    <input type="text" value={formData.DeveloperLocation} onChange={(e) => handleInputChange('DeveloperLocation', e.target.value)} className="academic-input w-full" placeholder="e.g., Finland" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Game Website</label>
                    <input type="url" value={formData.GameWebsite} onChange={(e) => handleInputChange('GameWebsite', e.target.value)} className="academic-input w-full" placeholder="https://example.com" />
                </div>
            </div>
          </div>
          
          {/* Gameplay Details */}
          <div className="academic-card p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Gameplay Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Players</label>
                      <input type="text" value={formData.Players} onChange={(e) => handleInputChange('Players', e.target.value)} className="academic-input w-full" placeholder="e.g., Single-player" />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Control Mechanisms</label>
                      <input type="text" value={formData.ControlMechanisms} onChange={(e) => handleInputChange('ControlMechanisms', e.target.value)} className="academic-input w-full" placeholder="e.g., Keypad" />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                      <input type="text" value={formData.Purpose} onChange={(e) => handleInputChange('Purpose', e.target.value)} className="academic-input w-full" placeholder="e.g., Entertainment" />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Monetization Model</label>
                      <input type="text" value={formData.MonetizationModel} onChange={(e) => handleInputChange('MonetizationModel', e.target.value)} className="academic-input w-full" placeholder="e.g., Pre-installed" />
                  </div>
              </div>
          </div>

          {/* Technical Details */}
          <div className="academic-card p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Technical Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Device Type</label>
                      <input type="text" value={formData.DeviceType} onChange={(e) => handleInputChange('DeviceType', e.target.value)} className="academic-input w-full" placeholder="e.g., Mobile Phone" />
                  </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hardware Features</label>
                      <input type="text" value={formData.HardwareFeatures} onChange={(e) => handleInputChange('HardwareFeatures', e.target.value)} className="academic-input w-full" placeholder="e.g., Monochrome display" />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Connectivity</label>
                      <input type="text" value={formData.Connectivity} onChange={(e) => handleInputChange('Connectivity', e.target.value)} className="academic-input w-full" placeholder="e.g., N/A" />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mobility Type</label>
                      <input type="text" value={formData.MobilityType} onChange={(e) => handleInputChange('MobilityType', e.target.value)} className="academic-input w-full" placeholder="e.g., Portable" />
                  </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Open Source</label>
                      <input type="text" value={formData.OpenSource} onChange={(e) => handleInputChange('OpenSource', e.target.value)} className="academic-input w-full" placeholder="e.g., N" />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Site Specific</label>
                      <input type="text" value={formData.SiteSpecific} onChange={(e) => handleInputChange('SiteSpecific', e.target.value)} className="academic-input w-full" placeholder="e.g., Not site-specific" />
                  </div>
              </div>
          </div>

          {/* Description */}
          <div className="academic-card p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Game Description</h4>
            <textarea value={formData.GameDescription} onChange={(e) => handleInputChange('GameDescription', e.target.value)} rows={4} className="academic-input w-full" />
          </div>

          {/* Media */}
          <div className="academic-card p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Media Assets</h4>
            {/* Photos */}
            <div className="space-y-2 mb-4">
                <label className="block text-sm font-medium text-gray-700">Photos</label>
                <div className="flex gap-2">
                    <input type="url" value={photoInput} onChange={e => setPhotoInput(e.target.value)} placeholder="Add photo URL" className="academic-input flex-1"/>
                    <button onClick={addPhoto} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus size={16}/></button>
                </div>
                <div className="space-y-1">
                    {formData.Photos.map((url, index) => (
                        <div key={index} className="flex items-center bg-gray-50 p-2 rounded">
                            <span className="text-xs truncate flex-1">{url}</span>
                            <button onClick={() => removePhoto(index)} className="ml-2 text-red-500 hover:text-red-700"><X size={14}/></button>
                        </div>
                    ))}
                </div>
            </div>
            {/* Videos */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Videos</label>
                <div className="flex gap-2">
                    <input type="url" value={videoInput} onChange={e => setVideoInput(e.target.value)} placeholder="Add video URL" className="academic-input flex-1"/>
                    <button onClick={addVideo} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus size={16}/></button>
                </div>
                 <div className="space-y-1">
                    {formData.Videos.map((url, index) => (
                        <div key={index} className="flex items-center bg-gray-50 p-2 rounded">
                            <span className="text-xs truncate flex-1">{url}</span>
                            <button onClick={() => removeVideo(index)} className="ml-2 text-red-500 hover:text-red-700"><X size={14}/></button>
                        </div>
                    ))}
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
