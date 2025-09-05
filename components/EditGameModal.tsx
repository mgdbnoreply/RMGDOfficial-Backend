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
  
  const addMedia = (type: 'Photos', input: string, setInput: (val: string) => void) => {
    if (input.trim()) {
      const currentMedia = editData[type]?.SS || [];
      updateField(type, [...currentMedia, input.trim()]);
      setInput('');
    }
  };

  const removeMedia = (type: 'Photos', index: number) => {
    const currentMedia = editData[type]?.SS || [];
    updateField(type, currentMedia.filter((_, i) => i !== index));
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
                    <div className="flex gap-2">
                        <input type="url" value={photoInput} onChange={e => setPhotoInput(e.target.value)} placeholder="Add photo URL" className="academic-input flex-1"/>
                        <button onClick={() => addMedia('Photos', photoInput, setPhotoInput)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus size={16}/></button>
                    </div>
                    <div className="space-y-1">
                        {(editData.Photos?.SS || []).map((url, index) => (
                            <div key={index} className="flex items-center bg-gray-50 p-2 rounded">
                                <span className="text-xs truncate flex-1">{url}</span>
                                <button onClick={() => removeMedia('Photos', index)} className="ml-2 text-red-500 hover:text-red-700"><X size={14}/></button>
                            </div>
                        ))}
                    </div>
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
              onClick={() => onSave(editData)}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all font-medium disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}