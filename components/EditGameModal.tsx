import { useState } from 'react';
import { X, Save, Plus } from 'lucide-react';
import { Game } from '@/types';
import ImageUpload from './ImageUpload';
import { s3Upload } from '@/services/s3Upload';

interface EditGameModalProps {
  game: Game;
  onSave: (game: Game) => void;
  onCancel: () => void;
  loading: boolean;
}

export default function EditGameModal({ game, onSave, onCancel, loading }: EditGameModalProps) {
  const [editData, setEditData] = useState<Game>(game);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [originalImages] = useState<string[]>(game.Photos?.SS || []);

  const updateField = (field: keyof Game, value: any) => {
    // Handle string set fields
    if (field === 'Photos') {
      setEditData(prev => ({
        ...prev,
        [field]: { SS: value }
      }));
    } else {
      // Handle regular string fields
      setEditData(prev => ({
        ...prev,
        [field]: { S: value }
      }));
    }
  };
  
  const handleImagesUploaded = (urls: string[]) => {
    updateField('Photos', urls);
  };

  const handleImagesDeleted = (deletedUrls: string[]) => {
    setImagesToDelete(deletedUrls);
  };

  const handleSaveWithImageDeletion = async () => {
    setIsDeleting(true);
    
    try {
      // Get current images from the edit data
      const currentImages = editData.Photos?.SS || [];
      
      // Identify which images are new (not in original images)
      const newImages = currentImages.filter(url => !originalImages.includes(url));
      
      // Delete images from S3 if any were marked for deletion
      if (imagesToDelete.length > 0) {
        const deleteResults = await s3Upload.deleteMultipleImages(imagesToDelete);
        const failedDeletes = deleteResults.filter(result => !result.success);
      }
      
      // Note: New images are already uploaded to S3 by the ImageUpload component
      // The ImageUpload component handles the S3 upload when files are selected
      // So we just need to save the updated game data with the current image URLs
      
      onSave(editData);
    } catch (error) {
      // Handle error - maybe show a toast notification
    } finally {
      setIsDeleting(false);
    }
  };


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Edit Game</h3>
              <p className="text-gray-600 mt-1">{editData.GameTitle?.S}</p>
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
            {/* All Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {Object.keys(editData).filter(key => !['GameID', 'Photos', 'Videos', 'GameDescription', 'Articles', 'ControlMechanisms', 'MobilityType', 'MonetizationModel', 'OpenSource', 'DeviceType', 'SiteSpecific'].includes(key)).map(key => (
                    <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                        <input
                            type="text"
                            value={(editData[key] as { S: string })?.S || ''}
                            onChange={(e) => updateField(key as keyof Game, e.target.value)}
                            className="academic-input w-full"
                        />
                    </div>
                ))}
            </div>

            {/* Description */}
            <div className="academic-card p-6">
                <label className="block text-lg font-semibold text-gray-900 mb-4">Game Description</label>
                <textarea
                    value={editData.GameDescription?.S || ''}
                    onChange={(e) => updateField('GameDescription', e.target.value)}
                    rows={5}
                    className="academic-input w-full"
                />
            </div>

            {/* Media */}
            <div className="academic-card p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Media Assets</h4>
                {/* Photos */}
                <div className="space-y-2 mb-4">
                    <label className="block text-sm font-medium text-gray-700">Photos</label>
                    <p className="text-xs text-gray-500 mb-3">
                      Upload new images or keep existing ones.
                    </p>
                    <ImageUpload
                      folder="games"
                      currentImages={editData.Photos?.SS || []}
                      onImagesUploaded={handleImagesUploaded}
                      onImagesDeleted={handleImagesDeleted}
                      maxImages={5}
                    />
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl">
          <div className="flex justify-end space-x-4">
            <button
              onClick={onCancel}
              className="px-6 py-3 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveWithImageDeletion}
              disabled={loading || isDeleting}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all font-medium disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              <span>
                {isDeleting ? 'Deleting images...' : loading ? 'Saving...' : 'Save Changes'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}