import { useState } from 'react';
import { X, Save } from 'lucide-react';

interface Collection {
  id: string;
  name: string;
  type: string;
  description: string;
  manufacturer?: string;
  year?: string;
  status: string;
  images?: string[];
  specifications?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

interface EditCollectionModalProps {
  collection: Collection;
  onSave: (collection: Collection) => void;
  onCancel: () => void;
  loading: boolean;
}

export default function EditCollectionModal({ collection, onSave, onCancel, loading }: EditCollectionModalProps) {
  const [editData, setEditData] = useState<Collection>({
    ...collection,
    specifications: collection.specifications || {}
  });

  const updateField = (field: keyof Collection, value: any) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const deviceTypes = [
    'Handheld Console',
    'Mobile Phone', 
    'PDA Device',
    'Dedicated Game Device',
    'Calculator Game',
    'Watch Game',
    'Arcade Cabinet',
    'Mini Console',
    'Educational Device',
    'Other'
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'archived', label: 'Archived' },
    { value: 'maintenance', label: 'Under Maintenance' },
    { value: 'missing', label: 'Missing' },
    { value: 'on_loan', label: 'On Loan' },
    { value: 'damaged', label: 'Damaged' }
  ];

  const commonManufacturers = [
    'Nintendo',
    'Nokia',
    'Sony',
    'Sega',
    'Atari',
    'Tiger Electronics',
    'Casio',
    'Game & Watch',
    'Bandai',
    'Tamagotchi',
    'Milton Bradley',
    'Mattel'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Edit Device</h3>
              <p className="text-gray-600 mt-1">Update device information in the RMGD collection</p>
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
                <label className="block text-gray-700 text-base font-medium mb-2">Device Name</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="academic-input w-full text-base"
                  placeholder="Enter device name"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-base font-medium mb-2">Device Type</label>
                <select
                  value={editData.type}
                  onChange={(e) => updateField('type', e.target.value)}
                  className="academic-input w-full text-base"
                >
                  <option value="">Select device type</option>
                  {deviceTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 text-base font-medium mb-2">Status</label>
                <select
                  value={editData.status}
                  onChange={(e) => updateField('status', e.target.value)}
                  className="academic-input w-full text-base"
                >
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-base font-medium mb-2">Manufacturer</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <select
                    value={editData.manufacturer}
                    onChange={(e) => updateField('manufacturer', e.target.value)}
                    className="academic-input text-base"
                  >
                    <option value="">Select manufacturer</option>
                    {commonManufacturers.map(manufacturer => (
                      <option key={manufacturer} value={manufacturer}>{manufacturer}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={editData.manufacturer || ''}
                    onChange={(e) => updateField('manufacturer', e.target.value)}
                    className="academic-input text-base"
                    placeholder="Or enter custom"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 text-base font-medium mb-2">Year Released</label>
                <input
                  type="number"
                  min="1975"
                  max="2008"
                  value={editData.year || ''}
                  onChange={(e) => updateField('year', e.target.value)}
                  className="academic-input w-full text-base"
                  placeholder="1975-2008"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="academic-card p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-2 h-6 bg-blue-600 rounded mr-3"></div>
              Device Description
            </h4>
            <textarea
              value={editData.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={4}
              className="academic-input w-full text-base"
              placeholder="Detailed description of the device..."
            />
          </div>

          {/* Technical Specifications */}
          {editData.specifications && Object.keys(editData.specifications).length > 0 && (
            <div className="academic-card p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-2 h-6 bg-purple-600 rounded mr-3"></div>
                Technical Specifications
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(editData.specifications).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-gray-700 text-sm font-medium mb-2 capitalize">
                      {key.replace('_', ' ')}
                    </label>
                    <input
                      type="text"
                      value={String(value)}
                      onChange={(e) => updateField('specifications', {
                        ...editData.specifications,
                        [key]: e.target.value
                      })}
                      className="academic-input w-full text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Current Images Display */}
          {editData.images && editData.images.length > 0 && (
            <div className="academic-card p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-2 h-6 bg-green-600 rounded mr-3"></div>
                Current Images ({editData.images.length})
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {editData.images.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`${editData.name} image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCA0MEw0NSAzNUw1MCA0MEg2MFY1MEg1NUw1MCA1NUw0NSA1MEg0MFY0MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-medium">
                        Image {index + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Note: Image editing will be available in a future update. Contact an administrator to modify images.
              </p>
            </div>
          )}

          {/* Device ID (Read-only) */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Device ID</p>
                <p className="text-xs text-gray-500 font-mono">{editData.id}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">Last Updated</p>
                <p className="text-xs text-gray-500">
                  {editData.updatedAt ? new Date(editData.updatedAt).toLocaleDateString() : 'Never'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl">
          <div className="flex justify-end space-x-4">
            <button
              onClick={onCancel}
              className="px-6 py-3 text-gray-700 hover:text-gray-900 transition-colors text-base font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(editData)}
              disabled={loading || !editData.name.trim()}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed text-base"
            >
              <Save className="w-5 h-5" />
              <span>{loading ? 'Saving Changes...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}