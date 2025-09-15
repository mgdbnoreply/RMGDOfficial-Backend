import { useState, useRef } from 'react';
import { X, Save, Plus, Info, Smartphone } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface NewCollectionData {
  name: string;
  type: string;
  description: string;
  manufacturer: string;
  year: string;
  status: string;
  images: string[];
  specifications: Record<string, string>;
}

interface AddCollectionModalProps {
  onSubmit: (collection: NewCollectionData) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export default function AddCollectionModal({ onSubmit, onCancel, loading }: AddCollectionModalProps) {
  const [formData, setFormData] = useState<NewCollectionData>({
    name: '',
    type: '',
    description: '',
    manufacturer: '',
    year: '',
    status: 'active',
    images: [],
    specifications: {}
  });

  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
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
    if (!formData.name.trim()) return;
    
    setIsUploading(true);
    try {
      // Upload new files to S3
      let uploadedImageUrls: string[] = [];
      if (imageData.newFiles.length > 0 && imageUploadRef.current) {
        uploadedImageUrls = await imageUploadRef.current.uploadPendingFiles();
      }
      
      // Create final collection data with uploaded image URLs
      const finalCollectionData = {
        ...formData,
        images: uploadedImageUrls
      };
      
      await onSubmit(finalCollectionData);
    } catch (error) {
      console.error('Error creating collection:', error);
      alert('Failed to create collection. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (field: keyof NewCollectionData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImagesChanged = (data: { currentImages: string[], newFiles: File[], deletedImages: string[] }) => {
    console.log('📸 AddCollectionModal: Images changed:', data);
    setImageData(data);
  };

  const addSpecification = () => {
    if (specKey.trim() && specValue.trim()) {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specKey.trim()]: specValue.trim()
        }
      }));
      setSpecKey('');
      setSpecValue('');
    }
  };

  const removeSpecification = (key: string) => {
    setFormData(prev => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return { ...prev, specifications: newSpecs };
    });
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Add New Device</h3>
                <p className="text-gray-600 mt-1">Add a device to the RMGD console collection</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Basic Information */}
          <div className="academic-card p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-2 h-6 bg-red-600 rounded mr-3"></div>
              Basic Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-base font-medium mb-2">
                  Device Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="academic-input w-full text-base"
                  placeholder="Enter the device name (e.g., Game Boy, Nokia 3310, Tamagotchi)"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-base font-medium mb-2">Device Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
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
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
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
                    value={formData.manufacturer}
                    onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                    className="academic-input text-base"
                  >
                    <option value="">Select manufacturer</option>
                    {commonManufacturers.map(manufacturer => (
                      <option key={manufacturer} value={manufacturer}>{manufacturer}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={formData.manufacturer}
                    onChange={(e) => handleInputChange('manufacturer', e.target.value)}
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
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
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
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="academic-input w-full text-base"
              placeholder="Detailed description of the device, its specifications, historical significance, notable games, and any unique features..."
            />
          </div>

          {/* Technical Specifications */}
          <div className="academic-card p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-2 h-6 bg-purple-600 rounded mr-3"></div>
              Technical Specifications
            </h4>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={specKey}
                  onChange={(e) => setSpecKey(e.target.value)}
                  className="academic-input text-base"
                  placeholder="Specification name (e.g., Display, CPU, Memory)"
                />
                <input
                  type="text"
                  value={specValue}
                  onChange={(e) => setSpecValue(e.target.value)}
                  className="academic-input text-base"
                  placeholder="Specification value"
                />
                <button
                  type="button"
                  onClick={addSpecification}
                  disabled={!specKey.trim() || !specValue.trim()}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Spec</span>
                </button>
              </div>

              {Object.keys(formData.specifications).length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Added Specifications ({Object.keys(formData.specifications).length})</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(formData.specifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{key}</p>
                          <p className="text-gray-600 text-sm">{value}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSpecification(key)}
                          className="text-red-600 hover:text-red-800 p-1 ml-2"
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

          {/* Visual Documentation */}
          <div className="academic-card p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-2 h-6 bg-green-600 rounded mr-3"></div>
              Visual Documentation
            </h4>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-3">
                Upload high-quality images of your collection item. Images will be stored securely in S3.
              </p>
              <ImageUpload
                ref={imageUploadRef}
                folder="consoles"
                currentImages={imageData.currentImages}
                onImagesChanged={handleImagesChanged}
                maxImages={3}
              />

            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-blue-900 mb-2">RMGD Collection Guidelines</h5>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Devices should be from the historical period 1975-2008</li>
                  <li>• Include detailed descriptions and technical specifications for research value</li>
                  <li>• Add visual documentation when available</li>
                  <li>• Verify manufacturer and year information for accuracy</li>
                  <li>• Include notable games or software available for the device</li>
                </ul>
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
              onClick={handleSubmit}
              disabled={loading || isUploading || !formData.name.trim()}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed text-base"
            >
              <Save className="w-5 h-5" />
              <span>
                {isUploading ? 'Uploading images...' : loading ? 'Adding Device...' : 'Add to Collection'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}