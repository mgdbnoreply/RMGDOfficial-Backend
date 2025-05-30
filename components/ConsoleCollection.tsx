"use client";
import { useState, useEffect } from 'react';
import { 
  Database, 
  Clock, 
  Wrench, 
  Smartphone, 
  Calendar, 
  MapPin, 
  Archive,
  Plus,
  Search,
  Grid,
  List,
  AlertCircle,
  RefreshCw,
  Download,
  Filter,
  Edit2, 
  Trash2, 
  Eye,
  Tag
} from 'lucide-react';
import { CollectionsAPI } from '@/services/api';

// Updated interface to match your API format
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

// Helper function to safely extract string from DynamoDB format
const extractString = (value: any): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (value.S) return value.S;
  return String(value);
};

// Helper function to convert your API format to display format
const convertToDisplay = (item: any): Collection => {
  try {
    return {
      id: extractString(item.id || item.ProductID || ''),
      name: extractString(item.name || 'Unknown Device'),
      category: extractString(item.category || 'other'),
      description: extractString(item.description || 'No description available'),
      maker: extractString(item.maker || 'Unknown Maker'),
      year: extractString(item.year || ''),
      image: extractString(item.image || ''),
      productId: extractString(item.ProductID || item.id || ''),
      status: 'active', // default since not in your data
    };
  } catch (error) {
    console.error('Error converting item:', error, item);
    return {
      id: Math.random().toString(36),
      name: 'Unknown Device',
      category: 'other',
      description: 'Error loading device data',
      maker: 'Unknown',
      year: '',
      image: '',
      productId: '',
      status: 'active',
    };
  }
};

// Inline CollectionCard Component (to fix the import issue)
interface CollectionCardProps {
  collection: Collection;
  viewMode: 'grid' | 'list';
  onEdit: (collection: Collection) => void;
  onView: (collection: Collection) => void;
  onDelete: (collectionId: string) => void;
}

function CollectionCard({ collection, viewMode, onEdit, onView, onDelete }: CollectionCardProps) {
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

export default function ConsoleCollection() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [operationError, setOperationError] = useState<string | null>(null);
  
  // UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMaker, setSelectedMaker] = useState('');
  const [selectedDecade, setSelectedDecade] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Modal State
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

  // Fetch collections on component mount
  useEffect(() => {
    fetchCollections();
  }, []);

  // Filter collections when search/filter changes
  useEffect(() => {
    filterCollections();
  }, [collections, searchTerm, selectedCategory, selectedMaker, selectedDecade]);

  const fetchCollections = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const rawData = await CollectionsAPI.getAllCollections();
      console.log('📱 Raw collections data received:', rawData);
      
      // Convert all items to display format
      const convertedData = rawData.map((item: any) => convertToDisplay(item));
      
      console.log('📱 Converted collections data:', convertedData);
      setCollections(convertedData);
    } catch (err: any) {
      console.error('❌ Error loading collections:', err);
      setError(`Failed to load collections: ${err.message}`);
      setCollections([]);
    } finally {
      setLoading(false);
    }
  };

  const filterCollections = () => {
    let filtered = collections;

    if (searchTerm) {
      filtered = filtered.filter(collection =>
        collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collection.maker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collection.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collection.productId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(collection => collection.category === selectedCategory);
    }

    if (selectedMaker) {
      filtered = filtered.filter(collection => collection.maker === selectedMaker);
    }

    if (selectedDecade) {
      const startYear = parseInt(selectedDecade);
      const endYear = startYear + 9;
      filtered = filtered.filter(collection => {
        const year = parseInt(collection.year);
        return year >= startYear && year <= endYear;
      });
    }

    setFilteredCollections(filtered);
  };

  const handleAddCollection = async (collectionData: any) => {
    setOperationError(null);
    try {
      // Generate product ID
      const productId = `${collectionData.maker.toLowerCase().replace(/\s+/g, '-')}-${collectionData.name.toLowerCase().replace(/\s+/g, '-')}`;
      
      // Convert to your DynamoDB format
      const dynamoData = {
        ProductID: { S: productId },
        category: { S: collectionData.category },
        description: { S: collectionData.description },
        id: { S: productId },
        image: { S: collectionData.image || '' },
        maker: { S: collectionData.maker },
        name: { S: collectionData.name },
        year: { S: collectionData.year }
      };

      const success = await CollectionsAPI.createCollection(dynamoData);
      if (success) {
        await fetchCollections();
        setShowAddForm(false);
      } else {
        throw new Error('Failed to add collection - API returned false');
      }
    } catch (err: any) {
      setOperationError(`Failed to add collection: ${err.message}`);
    }
  };

  const handleUpdateCollection = async (collection: Collection) => {
    setOperationError(null);
    try {
      // Convert to your DynamoDB format
      const dynamoData = {
        ProductID: { S: collection.productId },
        category: { S: collection.category },
        description: { S: collection.description },
        id: { S: collection.id },
        image: { S: collection.image },
        maker: { S: collection.maker },
        name: { S: collection.name },
        year: { S: collection.year }
      };

      const success = await CollectionsAPI.updateCollection(collection.id, dynamoData);
      if (success) {
        await fetchCollections();
        setEditingCollection(null);
      } else {
        throw new Error('Failed to update collection - API returned false');
      }
    } catch (err: any) {
      setOperationError(`Failed to update collection: ${err.message}`);
    }
  };

  const handleDeleteCollection = async (collectionId: string) => {
    if (!confirm('Are you sure you want to delete this device? This action cannot be undone.')) return;
    
    setOperationError(null);
    try {
      const success = await CollectionsAPI.deleteCollection(collectionId);
      if (success) {
        await fetchCollections();
        setSelectedCollection(null);
      } else {
        throw new Error('Failed to delete collection - API returned false');
      }
    } catch (err: any) {
      setOperationError(`Failed to delete collection: ${err.message}`);
    }
  };

  // Get unique filter options from your data
  const uniqueCategories = Array.from(new Set(collections.map(c => c.category).filter(Boolean))).sort();
  const uniqueMakers = Array.from(new Set(collections.map(c => c.maker).filter(Boolean))).sort();
  const uniqueDecades = Array.from(new Set(
    collections.map(c => {
      const year = parseInt(c.year);
      if (year) {
        return Math.floor(year / 10) * 10;
      }
      return null;
    })
    .filter((decade): decade is number => decade !== null && decade !== undefined)
  )).sort().reverse();

  // Stats for dashboard
  const stats = {
    totalCollections: collections.length,
    categories: uniqueCategories.length,
    makers: uniqueMakers.length,
    vintageItems: collections.filter(c => {
      const year = parseInt(c.year || '0');
      return year > 0 && year < 2000;
    }).length,
    phones: collections.filter(c => c.category.toLowerCase() === 'phone').length,
    recentItems: collections.filter(c => {
      const year = parseInt(c.year || '0');
      return year >= 2000;
    }).length
  };

  // Loading State
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="academic-card-elevated p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
          <p className="text-gray-700 text-lg">Loading device collection...</p>
          <p className="text-gray-500 text-base mt-2">Fetching devices from RMGD database...</p>
        </div>
      </div>
    );
  }

  // If collections exist, show the active interface
  if (collections.length > 0) {
    return (
      <div className="space-y-8">
        {/* Header with Stats */}
        <div className="academic-card-elevated p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center">
                <Database className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-primary">Console & Device Collection</h2>
                <p className="text-secondary text-lg">Physical gaming device preservation and documentation system</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchCollections}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
                title="Refresh Collection"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Refresh</span>
              </button>
              
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-medium shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>Add Device</span>
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { title: 'Total Devices', value: stats.totalCollections, icon: Smartphone, color: 'bg-red-50 border-red-200', iconColor: 'bg-red-600', textColor: 'text-red-800' },
              { title: 'Categories', value: stats.categories, icon: Archive, color: 'bg-blue-50 border-blue-200', iconColor: 'bg-blue-600', textColor: 'text-blue-800' },
              { title: 'Makers', value: stats.makers, icon: Wrench, color: 'bg-green-50 border-green-200', iconColor: 'bg-green-600', textColor: 'text-green-800' },
              { title: 'Vintage Items', value: stats.vintageItems, icon: Clock, color: 'bg-purple-50 border-purple-200', iconColor: 'bg-purple-600', textColor: 'text-purple-800' },
              { title: 'Phones', value: stats.phones, icon: Smartphone, color: 'bg-emerald-50 border-emerald-200', iconColor: 'bg-emerald-600', textColor: 'text-emerald-800' },
              { title: 'Modern Era', value: stats.recentItems, icon: Calendar, color: 'bg-amber-50 border-amber-200', iconColor: 'bg-amber-600', textColor: 'text-amber-800' }
            ].map((stat, idx) => (
              <div key={idx} className={`academic-card p-4 ${stat.color}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${stat.textColor} text-xs font-medium mb-1`}>{stat.title}</p>
                    <p className="text-gray-900 text-xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`w-8 h-8 ${stat.iconColor} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advanced Search and Filters */}
        <div className="academic-card-elevated p-6">
          <div className="flex flex-col space-y-4">
            {/* Search Bar */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search devices, makers, IDs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="academic-input w-full pl-12 pr-4 text-base placeholder-gray-500"
                />
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Row */}
            <div className="flex flex-wrap gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="academic-input text-sm min-w-[120px]"
              >
                <option value="">All Categories</option>
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>

              <select
                value={selectedMaker}
                onChange={(e) => setSelectedMaker(e.target.value)}
                className="academic-input text-sm min-w-[140px]"
              >
                <option value="">All Makers</option>
                {uniqueMakers.map(maker => (
                  <option key={maker} value={maker}>{maker}</option>
                ))}
              </select>

              <select
                value={selectedDecade}
                onChange={(e) => setSelectedDecade(e.target.value)}
                className="academic-input text-sm min-w-[120px]"
              >
                <option value="">All Decades</option>
                {uniqueDecades.map(decade => (
                  <option key={decade} value={decade.toString()}>
                    {decade}s
                  </option>
                ))}
              </select>

              {(searchTerm || selectedCategory || selectedMaker || selectedDecade) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                    setSelectedMaker('');
                    setSelectedDecade('');
                  }}
                  className="px-3 py-2 text-red-600 hover:text-red-800 text-sm underline"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Filter Summary */}
            {(searchTerm || selectedCategory || selectedMaker || selectedDecade) && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Filter className="w-4 h-4" />
                <span>Showing {filteredCollections.length} of {collections.length} devices</span>
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {(error || operationError) && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error || operationError}</p>
            </div>
            <button 
              onClick={() => {
                setError(null);
                setOperationError(null);
              }}
              className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Collections Grid/List */}
        {filteredCollections.length > 0 && (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredCollections.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                viewMode={viewMode}
                onEdit={setEditingCollection}
                onView={setSelectedCollection}
                onDelete={handleDeleteCollection}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredCollections.length === 0 && (
          <div className="text-center py-16">
            <Database className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No devices found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search criteria or filters.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSelectedMaker('');
                setSelectedDecade('');
              }}
              className="text-red-600 hover:text-red-800 underline"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Simple Add Modal Placeholder */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Add New Device</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>
              <p className="text-gray-600 text-center py-8">
                Add Device Modal - To be implemented
              </p>
            </div>
          </div>
        )}

        {/* Simple View Modal Placeholder */}
        {selectedCollection && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{selectedCollection.name}</h3>
                <button
                  onClick={() => setSelectedCollection(null)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>
              
              {selectedCollection.image && (
                <div className="mb-6">
                  <img
                    src={selectedCollection.image}
                    alt={selectedCollection.name}
                    className="w-full h-64 object-cover rounded-xl border border-gray-200"
                  />
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700">{selectedCollection.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Maker</h4>
                    <p className="text-gray-700">{selectedCollection.maker}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Year</h4>
                    <p className="text-gray-700">{selectedCollection.year}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Category</h4>
                    <p className="text-gray-700 capitalize">{selectedCollection.category}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Product ID</h4>
                    <p className="text-gray-700 font-mono text-sm">{selectedCollection.productId}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // No collections state
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="academic-card-elevated p-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Smartphone className="w-10 h-10 text-white" />
        </div>
        
        <h2 className="text-3xl font-bold text-primary mb-4">Console & Device Collection</h2>
        <p className="text-secondary text-lg mb-6 max-w-2xl mx-auto">
          Physical gaming device preservation and documentation system for retro mobile gaming hardware
        </p>
        
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-center space-x-4">
            <div className="inline-flex items-center space-x-2 px-6 py-3 bg-amber-100 text-amber-800 rounded-full border border-amber-200">
              <Clock className="w-5 h-5" />
              <span className="font-medium text-lg">No Data Available</span>
            </div>
            <button
              onClick={fetchCollections}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-100 text-blue-800 rounded-full border border-blue-200 hover:bg-blue-200 transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              <span className="font-medium">Check for Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}