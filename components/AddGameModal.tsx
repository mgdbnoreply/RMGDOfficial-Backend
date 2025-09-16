import { useState, useRef } from 'react';
import { X, Save, Plus, Info } from 'lucide-react';
import { NewGame } from '@/types';
import ImageUpload from './ImageUpload';

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
    Connectivity: '',
    DeveloperLocation: '',
    GameWebsite: '',
    HardwareFeatures: '',
    Players: '',
    Purpose: '',
  });

  const [validationError, setValidationError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [imageData, setImageData] = useState<{
    currentImages: string[];
    newFiles: File[];
    deletedImages: string[];
  }>({
    currentImages: [],
    newFiles: [],
    deletedImages: []
  });

  const imageUploadRef = useRef<{ uploadPendingFiles: () => Promise<string[]> }>(null);

  const handleSubmit = async () => {
    if (!formData.GameTitle.trim() || !formData.Developer.trim()) {
      setValidationError('Game Title and Developer are required fields');
      return;
    }
    
    setValidationError('');
    setIsUploading(true);
    
    try {
      // Step 1: Upload new files to S3
      let uploadedImageUrls: string[] = [];
      if (imageData.newFiles.length > 0 && imageUploadRef.current) {
        uploadedImageUrls = await imageUploadRef.current.uploadPendingFiles();
      }
      
      // Step 2: Create final game data with uploaded image URLs
      const finalGameData = {
        ...formData,
        Photos: uploadedImageUrls
      };
      
      await onSubmit(finalGameData);
      
    } catch (error) {
      console.error('❌ AddGameModal: Error during game creation:', error);
      alert('Failed to create game. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (field: keyof NewGame, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationError) {
      setValidationError('');
    }
  };

  const handleImagesChanged = (data: { currentImages: string[], newFiles: File[], deletedImages: string[] }) => {
    console.log('📸 AddGameModal: Images changed:', data);
    setImageData(data);
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                      <input type="text" value={formData.Purpose} onChange={(e) => handleInputChange('Purpose', e.target.value)} className="academic-input w-full" placeholder="e.g., Entertainment" />
                  </div>
              </div>
          </div>

          {/* Technical Details */}
          <div className="academic-card p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Technical Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hardware Features</label>
                      <input type="text" value={formData.HardwareFeatures} onChange={(e) => handleInputChange('HardwareFeatures', e.target.value)} className="academic-input w-full" placeholder="e.g., Monochrome display" />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Connectivity</label>
                      <input type="text" value={formData.Connectivity} onChange={(e) => handleInputChange('Connectivity', e.target.value)} className="academic-input w-full" placeholder="e.g., N/A" />
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
                <ImageUpload
                  ref={imageUploadRef}
                  folder="games"
                  currentImages={imageData.currentImages}
                  onImagesChanged={handleImagesChanged}
                  maxImages={5}
                />
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
              disabled={loading || isUploading || !formData.GameTitle.trim() || !formData.Developer.trim()}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed text-base"
            >
              <Save className="w-5 h-5" />
              <span>
                {isUploading ? 'Uploading images...' : loading ? 'Adding Game...' : 'Add to Collection'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}