import { X, Edit2, Trash2, Calendar, Tag, Users, Image, Hash, Smartphone, Wrench } from 'lucide-react';

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

interface CollectionDetailModalProps {
  collection: Collection;
  onClose: () => void;
  onEdit: (collection: Collection) => void;
  onDelete: (collectionId: string) => void;
}

export default function CollectionDetailModal({ collection, onClose, onEdit, onDelete }: CollectionDetailModalProps) {
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
  ] as const;
  type DeviceType = typeof deviceTypes[number];

  const getTypeColor = (type: string) => {
    const colors: Record<DeviceType, string> = {
      'Handheld Console': 'bg-red-100 text-red-800 border-red-200',
      'Mobile Phone': 'bg-blue-100 text-blue-800 border-blue-200',
      'PDA Device': 'bg-purple-100 text-purple-800 border-purple-200',
      'Dedicated Game Device': 'bg-green-100 text-green-800 border-green-200',
      'Calculator Game': 'bg-orange-100 text-orange-800 border-orange-200',
      'Watch Game': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Arcade Cabinet': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Mini Console': 'bg-pink-100 text-pink-800 border-pink-200',
      'Educational Device': 'bg-teal-100 text-teal-800 border-teal-200',
      'Other': 'bg-gray-100 text-gray-800 border-gray-200',
    };
    if ((deviceTypes as readonly string[]).includes(type)) {
      return colors[type as DeviceType];
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      'active': 'bg-green-100 text-green-800 border-green-200',
      'archived': 'bg-blue-100 text-blue-800 border-blue-200',
      'maintenance': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'missing': 'bg-red-100 text-red-800 border-red-200',
      'on_loan': 'bg-purple-100 text-purple-800 border-purple-200',
      'damaged': 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getYearColor = (year: string) => {
    const yearNum = parseInt(year);
    if (yearNum >= 2000) return 'bg-green-100 text-green-800 border-green-200';
    if (yearNum >= 1990) return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-amber-100 text-amber-800 border-amber-200';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">{collection.name}</h2>
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(collection.type)}`}>
                  <Smartphone className="w-3 h-3 inline mr-1" />
                  {collection.type}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(collection.status)}`}>
                  <Tag className="w-3 h-3 inline mr-1" />
                  {collection.status.charAt(0).toUpperCase() + collection.status.slice(1).replace('_', ' ')}
                </span>
                {collection.year && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getYearColor(collection.year)}`}>
                    <Calendar className="w-3 h-3 inline mr-1" />
                    {collection.year}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all ml-4"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Description */}
                <div className="academic-card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-2 h-6 bg-red-600 rounded mr-3"></div>
                    Device Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-base">
                    {collection.description || 'No description available for this device.'}
                  </p>
                </div>

                {/* Manufacturer Information */}
                {collection.manufacturer && (
                  <div className="academic-card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <div className="w-2 h-6 bg-blue-600 rounded mr-3"></div>
                      Manufacturer Information
                    </h3>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <Wrench className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-lg">{collection.manufacturer}</p>
                        <p className="text-gray-600">Device Manufacturer</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Specifications */}
                {collection.specifications && Object.keys(collection.specifications).length > 0 && (
                  <div className="academic-card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <div className="w-2 h-6 bg-purple-600 rounded mr-3"></div>
                      Technical Specifications
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(collection.specifications).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Hash className="w-4 h-4 text-gray-600" />
                            <span className="font-medium text-gray-900 capitalize">{key.replace('_', ' ')}</span>
                          </div>
                          <p className="text-gray-700 text-sm">{String(value)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technical Details */}
                <div className="academic-card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-2 h-6 bg-green-600 rounded mr-3"></div>
                    Collection Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Hash className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-900">Collection ID</span>
                      </div>
                      <p className="text-gray-700 font-mono text-sm">{collection.id}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Image className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-900">Documentation</span>
                      </div>
                      <p className="text-gray-700">
                        {collection.images?.length || 0} visual asset{(collection.images?.length || 0) !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Images */}
              {collection.images && collection.images.length > 0 && (
                <div className="academic-card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-2 h-6 bg-green-600 rounded mr-3"></div>
                    Device Images
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {collection.images.map((url, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={url}
                          alt={`${collection.name} image ${i + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200 hover:border-red-300 transition-colors"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDIwMCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCA2NEw5MCA1NEwxMDAgNjRIMTIwVjg0SDExMEwxMDAgOTRMOTAgODRIODBWNjRaIiBmaWxsPSIjOUNBM0FGIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUNBM0FGIiBmb250LXNpemU9IjEyIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pgo8L3N2Zz4=';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-medium">
                            Image {i + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="academic-card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      onEdit(collection);
                      onClose();
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-medium"
                  >
                    <Edit2 className="w-5 h-5" />
                    <span>Edit Device</span>
                  </button>
                  <button
                    onClick={() => {
                      onDelete(collection.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-medium"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span>Delete Device</span>
                  </button>
                </div>
              </div>

              {/* Research Notes */}
              <div className="academic-card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Research Context</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-amber-800 font-medium">Historical Period</p>
                    <p className="text-amber-700">Part of RMGD collection (1975-2008)</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-blue-800 font-medium">Academic Value</p>
                    <p className="text-blue-700">Mobile gaming hardware evolution research</p>
                  </div>
                  {collection.images && collection.images.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-green-800 font-medium">Documentation</p>
                      <p className="text-green-700">Visual assets preserved</p>
                    </div>
                  )}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <p className="text-purple-800 font-medium">Status</p>
                    <p className="text-purple-700">
                      {collection.status === 'active' ? 'Available for research' :
                       collection.status === 'archived' ? 'Archived for preservation' :
                       collection.status === 'maintenance' ? 'Under maintenance' :
                       collection.status === 'missing' ? 'Location unknown' :
                       collection.status === 'on_loan' ? 'Currently on loan' :
                       collection.status === 'damaged' ? 'Requires restoration' :
                       'Status unknown'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              {(collection.createdAt || collection.updatedAt) && (
                <div className="academic-card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
                  <div className="space-y-3 text-sm">
                    {collection.createdAt && (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-gray-900">Added to Collection</p>
                          <p className="text-gray-600">{new Date(collection.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</p>
                        </div>
                      </div>
                    )}
                    {collection.updatedAt && collection.updatedAt !== collection.createdAt && (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-gray-900">Last Updated</p>
                          <p className="text-gray-600">{new Date(collection.updatedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}