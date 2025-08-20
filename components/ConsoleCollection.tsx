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
  Tag,
  Zap,
  Award,
  TrendingUp,
  BarChart3,
  Users,
  BookOpen,
  Settings
} from 'lucide-react';
import { CollectionsAPI } from '@/services/api';
import AddCollectionModal from './AddCollectionModal';
import EditCollectionModal from './EditCollectionModal';
import CollectionDetailModal from './CollectionDetailModal';

// Collection interface for ConsoleCollection display
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

// Collection interface for modals (matching EditCollectionModal and CollectionDetailModal)
interface ModalCollection {
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

// Helper functions from your existing code
const extractString = (value: any): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (value.S) return value.S;
  return String(value);
};

const convertToDisplay = (item: any): Collection => {
  try {
    // Handle both old format (simple fields) and new format (DynamoDB format)
    const getId = () => extractString(item.id || item.ProductID || '');
    const getName = () => extractString(item.name || item["Name of Product"] || 'Unknown Device');
    const getCategory = () => extractString(item.category || item.Type || 'other');
    const getDescription = () => extractString(item.description || item.Description || 'No description available');
    const getMaker = () => extractString(item.maker || item.Maker || 'Unknown Maker');
    const getYear = () => extractString(item.year || item["Year of Fabrication"] || '');
    const getImage = () => extractString(item.image || '');
    const getProductId = () => extractString(item.ProductID || item.id || '');

    return {
      id: getId(),
      name: getName(),
      category: getCategory(),
      description: getDescription(),
      maker: getMaker(),
      year: getYear(),
      image: getImage(),
      productId: getProductId(),
      status: 'active',
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

// Conversion functions between Collection types
const collectionToModal = (collection: Collection): ModalCollection => ({
  id: collection.id,
  name: collection.name,
  type: collection.category, // category maps to type
  description: collection.description,
  manufacturer: collection.maker, // maker maps to manufacturer
  year: collection.year,
  status: collection.status || 'active',
  images: collection.image ? [collection.image] : [],
  specifications: {},
  createdAt: collection.createdAt,
  updatedAt: collection.updatedAt
});

const modalToCollection = (modal: ModalCollection): Collection => ({
  id: modal.id,
  name: modal.name,
  category: modal.type, // type maps to category
  description: modal.description,
  maker: modal.manufacturer || '', // manufacturer maps to maker
  year: modal.year || '',
  image: modal.images?.[0] || '',
  productId: modal.id, // use id as productId
  status: modal.status,
  createdAt: modal.createdAt,
  updatedAt: modal.updatedAt
});

// CollectionCard Component
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

      <p className="text-gray-600 text-base mb-4 leading-relaxed line-clamp-3">
        {collection.description}
      </p>

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

export default function ImprovedConsoleCollection() {
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
  const [activeView, setActiveView] = useState('catalog');
  
  // Modal State
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCollection, setEditingCollection] = useState<ModalCollection | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<ModalCollection | null>(null);

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    filterCollections();
  }, [collections, searchTerm, selectedCategory, selectedMaker, selectedDecade]);

  const fetchCollections = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const rawData = await CollectionsAPI.getAllCollections();
      const convertedData = rawData.map((item: any) => convertToDisplay(item));
      setCollections(convertedData);
    } catch (err: any) {
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

  const handleDeleteCollection = async (collectionId: string) => {
    if (!confirm('Are you sure you want to delete this device? This action cannot be undone.')) return;
    
    setOperationError(null);
    try {
      // Find the collection to get the correct ProductID
      const collectionToDelete = collections.find(c => c.id === collectionId || c.productId === collectionId);
      const productId = collectionToDelete?.productId || collectionId;
      
      const success = await CollectionsAPI.deleteCollection(productId);
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

  const handleAddCollection = async (newCollection: any) => {
    setOperationError(null);
    try {      
      // Convert to the format expected by the Lambda function (matching actual DB schema)
      const collectionData = {
        name: newCollection.name,
        category: newCollection.type,
        description: newCollection.description,
        maker: newCollection.manufacturer || '',
        year: newCollection.year || '',
        image: newCollection.images?.[0] || ''
      };

      const success = await CollectionsAPI.createCollection(collectionData);
      
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

  const handleUpdateCollection = async (updatedCollection: any) => {
    setOperationError(null);
    try {
      
      // Get the original collection to preserve existing data
      const originalCollection = collections.find(c => c.id === updatedCollection.id);
      
      // Convert to the format expected by the Lambda function (matching actual DB schema)
      const collectionData = {
        id: originalCollection?.id || updatedCollection.id, // Preserve original id field
        name: updatedCollection.name || originalCollection?.name || '',
        category: updatedCollection.type || originalCollection?.category || 'other',
        description: updatedCollection.description || originalCollection?.description || '',
        maker: updatedCollection.manufacturer || originalCollection?.maker || '',
        year: updatedCollection.year || originalCollection?.year || '',
        image: updatedCollection.images?.[0] || originalCollection?.image || ''
      };

      // Use ProductID (productId) for the API call, not the secondary id field
      const productId = originalCollection?.productId || updatedCollection.id;
      const success = await CollectionsAPI.updateCollection(productId, collectionData);
      
      if (success) {
        await fetchCollections();
        setEditingCollection(null);
      } else {
        throw new Error('Failed to update collection - API returned false');
      }
    } catch (err: any) {
      console.error('❌ Update Collection Error:', err);
      setOperationError(`Failed to update collection: ${err.message}`);
    }
  };

  // Get unique filter options
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

  // Stats calculation
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
    }).length,
    documentsWithImages: collections.filter(c => c.image && c.image.trim()).length,
    topCategory: uniqueCategories.reduce((max, cat) => {
      const count = collections.filter(c => c.category === cat).length;
      return count > max.count ? { name: cat, count } : max;
    }, { name: '', count: 0 }),
    topMaker: uniqueMakers.reduce((max, maker) => {
      const count = collections.filter(c => c.maker === maker).length;
      return count > max.count ? { name: maker, count } : max;
    }, { name: '', count: 0 })
  };

  const tabs = [
    { id: 'catalog', label: 'Device Catalog', icon: Archive },
    { id: 'overview', label: 'Collection Overview', icon: Database },
    { id: 'timeline', label: 'Historical Timeline', icon: Clock },
    { id: 'research', label: 'Research Analysis', icon: BookOpen }
    
  ];

  // Loading State
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="academic-card-elevated p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Loading Device Collection</h3>
          <p className="text-gray-600 text-lg">Retrieving physical gaming devices from RMGD database...</p>
          <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-500">
            <span>• Hardware Preservation</span>
            <span>• Research Archive</span>
            <span>• Academic Collection</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Research Header */}
      <div className="academic-card-elevated p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center shadow-lg">
              <Database className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-primary mb-2">Physical Device Collection</h2>
              <p className="text-secondary text-lg">Hardware preservation and documentation archive</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center space-x-1">
                  <Award className="w-4 h-4" />
                  <span>{stats.totalCollections} Devices Preserved</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Zap className="w-4 h-4" />
                  <span>{stats.categories} Categories</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Active Archive</span>
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-800 font-semibold">Archive Active</span>
              </div>
              <p className="text-green-700 text-sm mt-1">Collection synchronized</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-medium shadow-lg text-base"
            >
              <Plus className="w-5 h-5" />
              <span>Add Device</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all font-medium text-base ${
                activeView === tab.id
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {(error || operationError) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <h4 className="text-red-800 font-semibold">Operation Error</h4>
              <p className="text-red-700">{error || operationError}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setError(null);
              setOperationError(null);
            }}
            className="mt-3 text-red-600 hover:text-red-800 text-sm underline"
          >
            Dismiss Error
          </button>
        </div>
      )}

      {/* Overview Tab */}
      {activeView === 'overview' && (
        <div className="space-y-8">
          {/* Key Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Total Devices', value: stats.totalCollections, icon: Smartphone, color: 'bg-red-50 border-red-200', iconColor: 'bg-red-600', textColor: 'text-red-800', change: '+5%' },
              { title: 'Device Categories', value: stats.categories, icon: Archive, color: 'bg-blue-50 border-blue-200', iconColor: 'bg-blue-600', textColor: 'text-blue-800', change: '+2%' },
              { title: 'Manufacturers', value: stats.makers, icon: Wrench, color: 'bg-green-50 border-green-200', iconColor: 'bg-green-600', textColor: 'text-green-800', change: '+7%' },
              { title: 'Vintage Items', value: stats.vintageItems, icon: Clock, color: 'bg-purple-50 border-purple-200', iconColor: 'bg-purple-600', textColor: 'text-purple-800', change: '+3%' }
            ].map((stat, idx) => (
              <div key={idx} className={`academic-card-elevated p-6 ${stat.color}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.iconColor} rounded-xl flex items-center justify-center shadow-sm`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-1 text-green-600 text-sm font-medium">
                    <TrendingUp className="w-4 h-4" />
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div>
                  <p className={`${stat.textColor} text-sm font-medium mb-1`}>{stat.title}</p>
                  <p className="text-gray-900 text-3xl font-bold">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Device Categories Distribution */}
          <div className="academic-card-elevated p-8">
            <h3 className="text-2xl font-bold text-primary mb-6 flex items-center">
              <BarChart3 className="w-7 h-7 mr-3 text-red-600" />
              Device Category Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uniqueCategories.slice(0, 6).map((category, idx) => {
                const count = collections.filter(c => c.category === category).length;
                const percentage = Math.round((count / collections.length) * 100);
                return (
                  <div key={category} className="text-center">
                    <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg ${
                      idx === 0 ? 'bg-gradient-to-br from-blue-500 to-blue-700' :
                      idx === 1 ? 'bg-gradient-to-br from-red-500 to-red-700' :
                      idx === 2 ? 'bg-gradient-to-br from-green-500 to-green-700' :
                      idx === 3 ? 'bg-gradient-to-br from-purple-500 to-purple-700' :
                      idx === 4 ? 'bg-gradient-to-br from-orange-500 to-orange-700' :
                      'bg-gradient-to-br from-gray-500 to-gray-700'
                    }`}>
                      <span className="text-white text-2xl font-bold">{count}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg mb-2 capitalize">{category}</h4>
                    <p className="text-gray-600 mb-3">{percentage}% of collection</p>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          idx === 0 ? 'bg-blue-500' :
                          idx === 1 ? 'bg-red-500' :
                          idx === 2 ? 'bg-green-500' :
                          idx === 3 ? 'bg-purple-500' :
                          idx === 4 ? 'bg-orange-500' :
                          'bg-gray-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Research Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="academic-card-elevated p-8">
              <h4 className="text-xl font-bold text-primary mb-6">Collection Highlights</h4>
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-red-800 font-medium">Leading Category</span>
                    <span className="text-red-900 font-bold capitalize">{stats.topCategory.name}</span>
                  </div>
                  <div className="text-sm text-red-700 mt-1">{stats.topCategory.count} devices in collection</div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-800 font-medium">Top Manufacturer</span>
                    <span className="text-blue-900 font-bold">{stats.topMaker.name}</span>
                  </div>
                  <div className="text-sm text-blue-700 mt-1">{stats.topMaker.count} devices manufactured</div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-green-800 font-medium">Documentation Rate</span>
                    <span className="text-green-900 font-bold">{Math.round((stats.documentsWithImages / stats.totalCollections) * 100)}%</span>
                  </div>
                  <div className="text-sm text-green-700 mt-1">Devices with visual documentation</div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-800 font-medium">Vintage Ratio</span>
                    <span className="text-purple-900 font-bold">{Math.round((stats.vintageItems / stats.totalCollections) * 100)}%</span>
                  </div>
                  <div className="text-sm text-purple-700 mt-1">Pre-2000 historical devices</div>
                </div>
              </div>
            </div>

            <div className="academic-card-elevated p-8">
              <h4 className="text-xl font-bold text-primary mb-6">Preservation Metrics</h4>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 font-medium">Physical Documentation</span>
                    <span className="text-gray-900 font-bold">{Math.round((stats.documentsWithImages / stats.totalCollections) * 100)}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full"
                      style={{ width: `${(stats.documentsWithImages / stats.totalCollections) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{stats.documentsWithImages} devices have visual records</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 font-medium">Category Coverage</span>
                    <span className="text-gray-900 font-bold">{stats.categories}</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full w-5/6" />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Comprehensive device type coverage</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 font-medium">Manufacturer Diversity</span>
                    <span className="text-gray-900 font-bold">{stats.makers}</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full w-4/5" />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Wide representation of manufacturers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timeline Tab */}
      {activeView === 'timeline' && (
        <div className="academic-card-elevated p-8">
          <h3 className="text-2xl font-bold text-primary mb-8 flex items-center">
            <Calendar className="w-7 h-7 mr-3 text-red-600" />
            Device Release Timeline
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {uniqueDecades.map((decade) => {
              const decadeDevices = collections.filter(c => {
                const year = parseInt(c.year);
                return year >= decade && year < decade + 10;
              });
              const maxCount = Math.max(...uniqueDecades.map(d => collections.filter(c => {
                const year = parseInt(c.year);
                return year >= d && year < d + 10;
              }).length));
              
              return (
                <div key={decade} className="flex items-center space-x-6 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                  <div className="w-24 text-center">
                    <span className="text-2xl font-bold text-gray-900">{decade}s</span>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-200 rounded-full h-4 mb-2">
                      <div 
                        className="bg-gradient-to-r from-red-500 to-red-600 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${(decadeDevices.length / maxCount) * 100}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{decadeDevices.length} devices released</span>
                      <span className="text-gray-500">
                        Era: {decade < 1990 ? 'Early Computing' : decade < 2000 ? 'Digital Revolution' : 'Mobile Age'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right min-w-[4rem]">
                    <span className="text-2xl font-bold text-gray-900">{decadeDevices.length}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Research Tab */}
      {activeView === 'research' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="academic-card-elevated p-8">
              <h4 className="text-xl font-bold text-primary mb-6 flex items-center">
                <BookOpen className="w-6 h-6 mr-2 text-red-600" />
                Hardware Evolution Research
              </h4>
              <div className="space-y-4">
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
                  <h5 className="font-semibold text-amber-800 mb-2">Technological Progression</h5>
                  <p className="text-amber-700 text-sm">
                    The collection showcases the evolution from basic calculators and early handhelds 
                    to sophisticated mobile devices with gaming capabilities.
                  </p>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                  <h5 className="font-semibold text-blue-800 mb-2">Manufacturing Trends</h5>
                  <p className="text-blue-700 text-sm">
                    {stats.topMaker.name} dominates with {stats.topMaker.count} devices, representing 
                    {Math.round((stats.topMaker.count / stats.totalCollections) * 100)}% of the collection.
                  </p>
                </div>

                <div className="bg-green-50 border-l-4 border-green-400 p-4">
                  <h5 className="font-semibold text-green-800 mb-2">Category Analysis</h5>
                  <p className="text-green-700 text-sm">
                    {stats.topCategory.name} devices lead the collection, indicating their historical 
                    significance in mobile gaming development.
                  </p>
                </div>
              </div>
            </div>

            <div className="academic-card-elevated p-8">
              <h4 className="text-xl font-bold text-primary mb-6">Research Applications</h4>
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <h5 className="font-semibold text-red-800 mb-2">Hardware Archaeology</h5>
                  <p className="text-red-700 text-sm">Physical device preservation for technical analysis</p>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <h5 className="font-semibold text-purple-800 mb-2">Design Evolution</h5>
                  <p className="text-purple-700 text-sm">User interface and form factor development</p>
                </div>

                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                  <h5 className="font-semibold text-indigo-800 mb-2">Technical Documentation</h5>
                  <p className="text-indigo-700 text-sm">Specifications and capability preservation</p>
                </div>

                <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                  <h5 className="font-semibold text-teal-800 mb-2">Cultural Impact</h5>
                  <p className="text-teal-700 text-sm">Social adoption patterns and gaming culture</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Catalog Tab */}
      {activeView === 'catalog' && (
        <div className="space-y-6">
          {/* Advanced Search and Filters */}
          <div className="academic-card-elevated p-6">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search devices, makers, specifications..."
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

              {(searchTerm || selectedCategory || selectedMaker || selectedDecade) && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Filter className="w-4 h-4" />
                  <span>Showing {filteredCollections.length} of {collections.length} devices</span>
                </div>
              )}
            </div>
          </div>

          {/* Collections Grid/List */}
          {filteredCollections.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredCollections.map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  viewMode={viewMode}
                  onEdit={(collection) => setEditingCollection(collectionToModal(collection))}
                  onView={(collection) => setSelectedCollection(collectionToModal(collection))}
                  onDelete={handleDeleteCollection}
                />
              ))}
            </div>
          ) : (
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
        </div>
      )}

      {/* Modals */}
      {showAddForm && (
        <AddCollectionModal
          onSubmit={handleAddCollection}
          onCancel={() => setShowAddForm(false)}
          loading={loading}
        />
      )}

      {selectedCollection && (
        <CollectionDetailModal 
          collection={selectedCollection} 
          onClose={() => setSelectedCollection(null)}
          onEdit={setEditingCollection}
          onDelete={handleDeleteCollection}
        />
      )}

      {editingCollection && (
        <EditCollectionModal
          collection={editingCollection}
          onSave={handleUpdateCollection}
          onCancel={() => setEditingCollection(null)}
          loading={loading}
        />
      )}
    </div>
  );
}