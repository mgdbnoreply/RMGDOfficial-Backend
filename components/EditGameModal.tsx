import { useState } from 'react';
import { X, Save, Plus } from 'lucide-react';
import { Game } from '@/types';

interface EditGameModalProps {
  game: Game;
  onSave: (game: Game) => void;
  onCancel: () => void;
  loading: boolean;
}

export default function EditGameModal({ game, onSave, onCancel, loading }: EditGameModalProps) {
  const [editData, setEditData] = useState<Game>(game);
  const [photoInput, setPhotoInput] = useState('');
  const [videoInput, setVideoInput] = useState('');

  const updateField = (field: keyof Game, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: { S: value }
    }));
  };

  const addPhoto = () => {
    if (photoInput.trim()) {
      const currentPhotos = editData.Photos?.SS || [];
      setEditData(prev => ({
        ...prev,
        Photos: { SS: [...currentPhotos, photoInput.trim()] }
      }));
      setPhotoInput('');
    }
  };

  const removePhoto = (index: number) => {
    const currentPhotos = editData.Photos?.SS || [];
    setEditData(prev => ({
      ...prev,
      Photos: { SS: currentPhotos.filter((_, i) => i !== index) }
    }));
  };

  const addVideo = () => {
    if (videoInput.trim()) {
      const currentVideos = (editData as any).Videos?.SS || [];
      setEditData(prev => ({
        ...prev,
        Videos: { SS: [...currentVideos, videoInput.trim()] }
      }));
      setVideoInput('');
    }
  };

  const removeVideo = (index: number) => {
    const currentVideos = (editData as any).Videos?.SS || [];
    setEditData(prev => ({
      ...prev,
      Videos: { SS: currentVideos.filter((_, i) => i !== index) }
    }));
  };

  const handleSave = () => {
    // Filter out empty strings from Photos and Videos before saving
    const finalData = { ...editData };
    if (finalData.Photos?.SS) {
        finalData.Photos.SS = finalData.Photos.SS.filter(p => p.trim() !== '');
    }
    if ((finalData as any).Videos?.SS) {
        (finalData as any).Videos.SS = (finalData as any).Videos.SS.filter((v: string) => v.trim() !== '');
    }
    onSave(finalData);
  };


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Edit Game</h3>
              <p className="text-gray-600 mt-1">Update details for: {game.GameTitle?.S}</p>
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
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Game Title</label>
                        <input type="text" value={editData.GameTitle?.S || ''} onChange={(e) => updateField('GameTitle', e.target.value)} className="academic-input w-full" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Developer</label>
                        <input type="text" value={editData.Developer?.S || ''} onChange={(e) => updateField('Developer', e.target.value)} className="academic-input w-full" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year Developed</label>
                        <input type="number" value={editData.YearDeveloped?.S || ''} onChange={(e) => updateField('YearDeveloped', e.target.value)} className="academic-input w-full" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                        <input type="text" value={editData.Genre?.S || ''} onChange={(e) => updateField('Genre', e.target.value)} className="academic-input w-full" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Developer Location</label>
                        <input type="text" value={(editData as any).DeveloperLocation?.S || ''} onChange={(e) => updateField('DeveloperLocation', e.target.value)} className="academic-input w-full" />
                    </div>
                </div>
            </div>
            
            {/* Detailed Info */}
            <div className="academic-card p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Detailed Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                    <input type="text" value={(editData as any).Purpose?.S || ''} onChange={(e) => updateField('Purpose', e.target.value)} className="academic-input w-full" />
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hardware Features</label>
                    <input type="text" value={(editData as any).HardwareFeatures?.S || ''} onChange={(e) => updateField('HardwareFeatures', e.target.value)} className="academic-input w-full" />
                    <label className="block text-sm font-medium text-gray-700 mb-1">Connectivity</label>
                    <input type="text" value={(editData as any).Connectivity?.S || ''} onChange={(e) => updateField('Connectivity', e.target.value)} className="academic-input w-full" />
                    <label className="block text-sm font-medium text-gray-700 mb-1">Players</label>
                    <input type="text" value={(editData as any).Players?.S || ''} onChange={(e) => updateField('Players', e.target.value)} className="academic-input w-full" />
                </div>
            </div>

            {/* Description */}
            <div className="academic-card p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Game Description</h4>
                <textarea value={editData.GameDescription?.S || ''} onChange={(e) => updateField('GameDescription', e.target.value)} rows={5} className="academic-input w-full" />
            </div>

            {/* Media */}
            <div className="academic-card p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Media Assets</h4>
                {/* Photos */}
                <div className="space-y-2 mb-4">
                    <label className="block text-sm font-medium text-gray-700">Photos</label>
                    <div className="flex gap-2">
                        <input type="url" value={photoInput} onChange={e => setPhotoInput(e.target.value)} placeholder="Add new photo URL" className="academic-input flex-1"/>
                        <button onClick={addPhoto} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus/></button>
                    </div>
                    <div className="space-y-2">
                        {editData.Photos?.SS?.map((url, index) => (
                            <div key={index} className="flex items-center bg-gray-50 p-2 rounded-lg">
                                <span className="text-sm truncate flex-1">{url}</span>
                                <button onClick={() => removePhoto(index)} className="ml-2 text-red-500 hover:text-red-700"><X size={16}/></button>
                            </div>
                        ))}
                    </div>
                </div>
                 {/* Videos */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Videos</label>
                    <div className="flex gap-2">
                        <input type="url" value={videoInput} onChange={e => setVideoInput(e.target.value)} placeholder="Add new video URL" className="academic-input flex-1"/>
                        <button onClick={addVideo} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus/></button>
                    </div>
                    <div className="space-y-2">
                        {(editData as any).Videos?.SS?.map((url: string, index: number) => (
                            <div key={index} className="flex items-center bg-gray-50 p-2 rounded-lg">
                                <span className="text-sm truncate flex-1">{url}</span>
                                <button onClick={() => removeVideo(index)} className="ml-2 text-red-500 hover:text-red-700"><X size={16}/></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl">
          <div className="flex justify-end space-x-4">
            <button onClick={onCancel} className="px-6 py-3 text-gray-700 hover:text-gray-900 transition-colors font-medium">Cancel</button>
            <button onClick={handleSave} disabled={loading} className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-medium disabled:opacity-50">
              <Save className="w-5 h-5" />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
