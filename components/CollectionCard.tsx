import { Edit2, Trash2, Eye, Wrench, Calendar, Tag, Smartphone } from 'lucide-react';

interface Collection {
  id: string;
  name: string;
  category: string;
  description: string;
  maker: string;
  year: string;
  image: string;
  productId: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CollectionCardProps {
  collection: Collection;
  viewMode: 'grid' | 'list';
  onEdit: (collection: Collection) => void;
  onView: (collection: Collection) => void;
  onDelete: (collectionId: string) => void;
}

export default function CollectionCard({ collection, viewMode, onEdit, onView, onDelete }: CollectionCardProps) {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'phone': 'bg-blue-100 text-blue-800 border-blue-200',
      'console': 'bg-red-100 text-red-800 border-red-200',
      'handheld': 'bg-green-100 text-green-800 border-green-200',
      'pda': 'bg-purple-100 text-purple-800 border-purple-200',
      'calculator': 'bg-orange-100 text-orange-800 border-orange-200',
      'watch': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'tablet': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'gaming': 'bg-pink-100 text-pink-800 border-pink-200',
      'other': 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[category.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getYearColor = (year: string) => {
    const yearNum = parseInt(year);
    if (yearNum >= 2000) return 'bg-green-100 text-green-800 border-green-200';
    if (yearNum >= 1995) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (yearNum >= 1985) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      'active': 'bg-green-100 text-green-800 border-green-200',
      'archived': 'bg-blue-100 text-blue-800 border-blue-200',
      'maintenance': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'missing': 'bg-red-100 text-red-800 border-red-200',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (viewMode === 'list') {
    return (
      <div className="academic-card-elevated p-6 hover:shadow-lg transition-all duration-200 group">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            {/* Device Image */}
            <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
              {collection.image ? (
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center bg-gray-50">
                          <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                      `;
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <Smartphone className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-700 transition-colors mb-2 truncate">
                {collection.name}
              </h3>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(collection.category)}`}>
                  <Tag className="w-3 h-3 inline mr-1" />
                  {collection.category.charAt(0).toUpperCase() + collection.category.slice(1)}
                </span>
                {collection.year && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getYearColor(collection.year)}`}>
                    <Calendar className="w-3 h-3 inline mr-1" />
                    {collection.year}
                  </span>
                )}
                {collection.status && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(collection.status)}`}>
                    {collection.status.charAt(0).toUpperCase() + collection.status.slice(1)}
                  </span>
                )}
              </div>
              
              <p className="text-gray-600 text-base mb-2 line-clamp-1">
                {collection.description}
              </p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Wrench className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{collection.maker}</span>
                </div>
                <span>•</span>
                <span className="font-mono text-xs">ID: {collection.productId}</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
            <button
              onClick={() => onView(collection)}
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all"
              title="View Details"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={() => onEdit(collection)}
              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all"
              title="Edit Device"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(collection.id)}
              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all"
              title="Delete Device"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="academic-card-elevated p-6 hover:shadow-lg transition-all duration-200 group">
      {/* Header with Actions */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-700 transition-colors leading-tight">
            {collection.name}
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(collection.category)}`}>
              <Tag className="w-3 h-3 inline mr-1" />
              {collection.category.charAt(0).toUpperCase() + collection.category.slice(1)}
            </span>
            {collection.year && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getYearColor(collection.year)}`}>
                <Calendar className="w-3 h-3 inline mr-1" />
                {collection.year}
              </span>
            )}
            {collection.status && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(collection.status)}`}>
                {collection.status.charAt(0).toUpperCase() + collection.status.slice(1)}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onView(collection)}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(collection)}
            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all"
            title="Edit Device"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(collection.id)}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all"
            title="Delete Device"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Device Image */}
      <div className="mb-4">
        <div className="w-full h-48 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
          {collection.image ? (
            <img
              src={collection.image}
              alt={collection.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="w-full h-full flex items-center justify-center bg-gray-50">
                      <div class="text-center">
                        <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                        </svg>
                        <p class="text-gray-500 text-sm">Image not available</p>
                      </div>
                    </div>
                  `;
                }
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <Smartphone className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No image available</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-base mb-4 leading-relaxed line-clamp-3">
        {collection.description}
      </p>

      {/* Manufacturer Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{collection.maker}</p>
            <p className="text-xs text-gray-500">Manufacturer</p>
          </div>
        </div>
        
        {collection.year && (
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900">{collection.year}</p>
            <p className="text-xs text-gray-500">Release Year</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500 font-mono">
            Product ID: {collection.productId}
          </div>
          <button
            onClick={() => onView(collection)}
            className="text-sm text-red-600 hover:text-red-800 font-medium hover:underline transition-colors"
          >
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
}