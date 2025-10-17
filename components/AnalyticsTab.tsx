import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  Award, 
  Gamepad2,
  Database,
  PieChart,
  Trophy,
  Star,
  Crown,
  Medal,
  Activity,
  Archive
} from 'lucide-react';
import { GameAPI, CollectionsAPI } from '@/services/api'; // Adjust path as needed
import { useAuth } from '@/contexts/AuthContext';

// Type definitions
interface Game {
  Genre?: { S?: string } | string;
  YearDeveloped?: { S?: string } | string;
  Photos?: { SS?: string[] } | string[];
  Developer?: { S?: string } | string;
  GameTitle?: { S?: string } | string;
  GameDescription?: { S?: string } | string;
  genre?: string;
  yearDeveloped?: string;
  year?: string;
  photos?: string[];
  developer?: string;
  creator?: string;
  gameTitle?: string;
  title?: string;
  description?: string;
}

interface Collection {
  id?: string | { S?: string };
  ProductID?: string | { S?: string };
  name?: string | { S?: string };
  category?: string | { S?: string };
  Category?: string | { S?: string };
  type?: string | { S?: string };
  Type?: string | { S?: string };
  description?: string | { S?: string };
  maker?: string | { S?: string };
  Maker?: string | { S?: string };
  creator?: string | { S?: string };
  Creator?: string | { S?: string };
  developer?: string | { S?: string };
  year?: string | { S?: string };
  image?: string | { S?: string };
  Image?: string | { S?: string };
  photo?: string | { S?: string };
  Photo?: string | { S?: string };
}

// Simple Pie Chart Component
const SimplePieChart = ({ data, title }: { data: [string, number][], title: string }) => {
  const total = data.reduce((sum, [, value]) => sum + value, 0);
  const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6366F1', '#F97316'];
  
  return (
    <div className="academic-card-elevated p-6">
      <h4 className="text-lg font-bold text-gray-900 mb-6">{title}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* SVG Pie Chart */}
        <div className="flex justify-center">
          <div className="relative w-64 h-64">
            <svg width="256" height="256" viewBox="0 0 256 256" className="transform -rotate-90">
              {data.map((item, idx) => {
                const [label, value] = item;
                const percentage = (value / total) * 100;
                const angle = (value / total) * 360;
                
                // Calculate path for each segment
                const startAngle = data.slice(0, idx).reduce((sum, [, v]) => sum + (v / total) * 360, 0);
                const endAngle = startAngle + angle;
                
                const startAngleRad = (startAngle * Math.PI) / 180;
                const endAngleRad = (endAngle * Math.PI) / 180;
                
                const radius = 100;
                const centerX = 128;
                const centerY = 128;
                
                const x1 = centerX + radius * Math.cos(startAngleRad);
                const y1 = centerY + radius * Math.sin(startAngleRad);
                const x2 = centerX + radius * Math.cos(endAngleRad);
                const y2 = centerY + radius * Math.sin(endAngleRad);
                
                const largeArc = angle > 180 ? 1 : 0;
                
                const pathData = [
                  `M ${centerX} ${centerY}`,
                  `L ${x1} ${y1}`,
                  `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
                  'Z'
                ].join(' ');
                
                return (
                  <path
                    key={idx}
                    d={pathData}
                    fill={colors[idx % colors.length]}
                    stroke="white"
                    strokeWidth="2"
                    className="hover:opacity-80 transition-opacity"
                  />
                );
              })}
              
              <circle cx="128" cy="128" r="40" fill="white" stroke="#E5E7EB" strokeWidth="2" />
            </svg>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="space-y-3">
          {data.map((item, idx) => {
            const [label, value] = item;
            const percentage = Math.round((value / total) * 100);
            return (
              <div key={label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-5 h-5 rounded-full"
                    style={{ backgroundColor: colors[idx % colors.length] }}
                  />
                  <span className="text-sm font-medium text-gray-900">{label}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">{value}</div>
                  <div className="text-xs text-gray-600">{percentage}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Simple Bar Chart Component
const SimpleBarChart = ({ data, title, color = '#3B82F6' }: { data: [string, number][], title: string, color?: string }) => {
  const maxValue = Math.max(...data.map(([, value]) => value));
  
  return (
    <div className="academic-card-elevated p-6">
      <h4 className="text-lg font-bold text-gray-900 mb-4">{title}</h4>
      <div className="space-y-3">
        {data.map(([label, value], idx) => (
          <div key={label} className="flex items-center space-x-3">
            <div className="w-24 text-sm font-medium text-gray-700 truncate">{label}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
              <div 
                className="h-6 rounded-full transition-all duration-700"
                style={{ 
                  width: `${(value / maxValue) * 100}%`,
                  backgroundColor: color
                }}
              />
              <span className="absolute right-2 top-0 h-6 flex items-center text-sm font-semibold text-white">
                {value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, color, iconColor, textColor }: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  iconColor: string;
  textColor: string;
}) => (
  <div className={`academic-card-elevated p-6 ${color}`}>
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 ${iconColor} rounded-xl flex items-center justify-center shadow-sm`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="text-green-600 text-sm font-medium">
        <TrendingUp className="w-4 h-4 inline mr-1" />
        Live
      </div>
    </div>
    <div>
      <p className={`${textColor} text-sm font-medium mb-1`}>{title}</p>
      <p className="text-gray-900 text-3xl font-bold">{value}</p>
    </div>
  </div>
);

// Remove the interface since we're not accepting props anymore
// interface ResearchDashboardProps {
//   games: Game[];
//   collections?: any[];
// }

export default function ResearchDashboard() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [games, setGames] = useState<Game[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [gamesData, collectionsData] = await Promise.all([
          GameAPI.getAllGames(),
          CollectionsAPI.getAllCollections()
        ]);
        
        // Only approved games should be included in analytics for ALL roles
        // This ensures consistent data across the application
        const filteredGames = Array.isArray(gamesData) ? gamesData.filter(game => {
          // ALL users (including admins) only see approved games in analytics
          // This maintains data consistency with the main collection
          // Legacy games without Status.S field are treated as approved for backward compatibility
          const status = game.Status?.S;
          return status === 'approved' || status === undefined;
        }) : [];
        
        setGames(filteredGames);
        setCollections(Array.isArray(collectionsData) ? collectionsData : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Process collections data safely - handle DynamoDB format
  const processedCollections = collections.map((item: any) => ({
    id: (typeof item?.id === 'object' ? item.id?.S : item?.id) || (typeof item?.ProductID === 'object' ? item.ProductID?.S : item?.ProductID) || Math.random().toString(),
    name: (typeof item?.name === 'object' ? item.name?.S : item?.name) || 'Unknown Device',
    category: (typeof item?.category === 'object' ? item.category?.S : item?.category) || 
              (typeof item?.Category === 'object' ? item.Category?.S : item?.Category) || 
              (typeof item?.type === 'object' ? item.type?.S : item?.type) || 
              (typeof item?.Type === 'object' ? item.Type?.S : item?.Type) || 'other',
    description: (typeof item?.description === 'object' ? item.description?.S : item?.description) || 'No description',
    maker: (typeof item?.maker === 'object' ? item.maker?.S : item?.maker) || 
           (typeof item?.Maker === 'object' ? item.Maker?.S : item?.Maker) || 
           (typeof item?.creator === 'object' ? item.creator?.S : item?.creator) || 
           (typeof item?.Creator === 'object' ? item.Creator?.S : item?.Creator) || 
           (typeof item?.developer === 'object' ? item.developer?.S : item?.developer) || 'Unknown Maker',
    year: (typeof item?.year === 'object' ? item.year?.S : item?.year) || '',
    image: (typeof item?.image === 'object' ? item.image?.S : item?.image) || 
           (typeof item?.Image === 'object' ? item.Image?.S : item?.Image) || 
           (typeof item?.photo === 'object' ? item.photo?.S : item?.photo) || 
           (typeof item?.Photo === 'object' ? item.Photo?.S : item?.Photo) || ''
  }));

  // Data analysis
  const gameGenres = games.reduce((acc: Record<string, number>, game) => {
    const genre = (typeof game.Genre === 'object' ? game.Genre?.S : game.Genre) || game.genre || 'Unknown';
    acc[genre] = (acc[genre] || 0) + 1;
    return acc;
  }, {});

  const collectionCategories = processedCollections.reduce((acc: Record<string, number>, device) => {
    const category = device.category || 'Unknown';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const gameDevelopers = games.reduce((acc: Record<string, number>, game) => {
    const dev = (typeof game.Developer === 'object' ? game.Developer?.S : game.Developer) || game.developer || game.creator || 'Unknown';
    acc[dev] = (acc[dev] || 0) + 1;
    return acc;
  }, {});

  const collectionMakers = processedCollections.reduce((acc: Record<string, number>, device) => {
    const maker = device.maker || 'Unknown';
    acc[maker] = (acc[maker] || 0) + 1;
    return acc;
  }, {});

  const gameYears = games.reduce((acc: Record<string, number>, game) => {
    const year = (typeof game.YearDeveloped === 'object' ? game.YearDeveloped?.S : game.YearDeveloped) || game.yearDeveloped || game.year;
    if (year && year !== 'Unknown') {
      acc[year] = (acc[year] || 0) + 1;
    }
    return acc;
  }, {});

  // Top data
  const topGameGenres = Object.entries(gameGenres).sort(([,a], [,b]) => (b as number) - (a as number)).slice(0, 8) as [string, number][];
  const topCollectionCategories = Object.entries(collectionCategories).sort(([,a], [,b]) => (b as number) - (a as number)).slice(0, 8) as [string, number][];
  const topGameDevelopers = Object.entries(gameDevelopers).sort(([,a], [,b]) => (b as number) - (a as number)).slice(0, 10) as [string, number][];
  const topCollectionMakers = Object.entries(collectionMakers).sort(([,a], [,b]) => (b as number) - (a as number)).slice(0, 10) as [string, number][];
  const topGameYears = Object.entries(gameYears).sort(([,a], [,b]) => (b as number) - (a as number)).slice(0, 10) as [string, number][];

  // Best performers
  const bestGame = games.length > 0 ? games.reduce((best, game) => {
    const getPhotoCount = (gameItem: Game) => {
      if (gameItem.Photos) {
        // Check if it's the DynamoDB format object with SS property
        if (typeof gameItem.Photos === 'object' && !Array.isArray(gameItem.Photos)) {
          const photosObj = gameItem.Photos as { SS?: string[] };
          return photosObj.SS ? photosObj.SS.length : 0;
        }
        // Check if it's a direct array
        if (Array.isArray(gameItem.Photos)) {
          return gameItem.Photos.length;
        }
      }
      // Check alternative photos property
      if (gameItem.photos && Array.isArray(gameItem.photos)) {
        return gameItem.photos.length;
      }
      return 0;
    };
    
    const photos = getPhotoCount(game);
    const bestPhotos = best ? getPhotoCount(best) : 0;
    return photos > bestPhotos ? game : best;
  }, games[0]) : null;

  const bestCollection = processedCollections.find(d => d.image && typeof d.image === 'string' && d.image.trim() !== '') || processedCollections[0];

  // Era analysis
  const gameEras = {
    'Early Era (1975-1989)': games.filter(g => {
      const year = parseInt((typeof g.YearDeveloped === 'object' ? g.YearDeveloped?.S : g.YearDeveloped) || g.yearDeveloped || g.year || '0');
      return year >= 1975 && year <= 1989;
    }).length,
    'Golden Age (1990-1999)': games.filter(g => {
      const year = parseInt((typeof g.YearDeveloped === 'object' ? g.YearDeveloped?.S : g.YearDeveloped) || g.yearDeveloped || g.year || '0');
      return year >= 1990 && year <= 1999;
    }).length,
    'Modern Era (2000-2008)': games.filter(g => {
      const year = parseInt((typeof g.YearDeveloped === 'object' ? g.YearDeveloped?.S : g.YearDeveloped) || g.yearDeveloped || g.year || '0');
      return year >= 2000 && year <= 2008;
    }).length
  };

  const collectionEras = {
    'Early Era (1975-1989)': processedCollections.filter(d => {
      const year = parseInt(d.year || '0');
      return year >= 1975 && year <= 1989;
    }).length,
    'Golden Age (1990-1999)': processedCollections.filter(d => {
      const year = parseInt(d.year || '0');
      return year >= 1990 && year <= 1999;
    }).length,
    'Modern Era (2000-2008)': processedCollections.filter(d => {
      const year = parseInt(d.year || '0');
      return year >= 2000 && year <= 2008;
    }).length
  };

  const combinedEras = {
    'Early Era (1975-1989)': gameEras['Early Era (1975-1989)'] + collectionEras['Early Era (1975-1989)'],
    'Golden Age (1990-1999)': gameEras['Golden Age (1990-1999)'] + collectionEras['Golden Age (1990-1999)'],
    'Modern Era (2000-2008)': gameEras['Modern Era (2000-2008)'] + collectionEras['Modern Era (2000-2008)']
  };

  // Quality metrics
  const stats = {
    totalGames: games.length,
    totalCollections: processedCollections.length,
    totalItems: games.length + processedCollections.length,
    documentedGames: games.filter(g => {
      if (g.Photos) {
        // Check if it's the DynamoDB format object with SS property
        if (typeof g.Photos === 'object' && !Array.isArray(g.Photos)) {
          const photosObj = g.Photos as { SS?: string[] };
          return photosObj.SS && photosObj.SS.length > 0;
        }
        // Check if it's a direct array
        if (Array.isArray(g.Photos)) {
          return g.Photos.length > 0;
        }
      }
      // Check alternative photos property
      if (g.photos && Array.isArray(g.photos)) {
        return g.photos.length > 0;
      }
      return false;
    }).length,
    documentedCollections: processedCollections.filter(d => d.image && typeof d.image === 'string' && d.image.trim() !== '').length,
    uniqueGenres: Object.keys(gameGenres).length,
    uniqueCategories: Object.keys(collectionCategories).length,
    uniqueDevelopers: Object.keys(gameDevelopers).length,
    uniqueMakers: Object.keys(collectionMakers).length
  };

  const overallDocRate = stats.totalItems > 0 ? Math.round(((stats.documentedGames + stats.documentedCollections) / stats.totalItems) * 100) : 0;

  const sections = [
    { id: 'overview', label: 'Overview', icon: Database },
    { id: 'champions', label: 'Champions', icon: Trophy },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'collections', label: 'Collections', icon: Archive },
    { id: 'quality', label: 'Quality', icon: Star }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="academic-card-elevated p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-primary mb-2">RMGD Data Analysis</h2>
              <p className="text-secondary text-lg">Statistical analysis of games and device collections</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center space-x-1">
                  <Database className="w-4 h-4" />
                  <span>{stats.totalItems} Total Items</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Activity className="w-4 h-4" />
                  <span>Live Analysis</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all font-medium text-sm ${
                activeSection === section.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <section.icon className="w-4 h-4" />
              <span>{section.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Games"
              value={stats.totalGames}
              icon={Gamepad2}
              color="bg-red-50 border-red-200"
              iconColor="bg-red-600"
              textColor="text-red-800"
            />
            <StatsCard
              title="Total Collections"
              value={stats.totalCollections}
              icon={Archive}
              color="bg-blue-50 border-blue-200"
              iconColor="bg-blue-600"
              textColor="text-blue-800"
            />
            <StatsCard
              title="Combined Items"
              value={stats.totalItems}
              icon={Database}
              color="bg-green-50 border-green-200"
              iconColor="bg-green-600"
              textColor="text-green-800"
            />
            <StatsCard
              title="Documentation Rate"
              value={`${overallDocRate}%`}
              icon={Star}
              color="bg-purple-50 border-purple-200"
              iconColor="bg-purple-600"
              textColor="text-purple-800"
            />
          </div>

          <SimplePieChart 
            data={Object.entries(combinedEras) as [string, number][]} 
            title="Combined Era Distribution (Games + Collections)" 
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="academic-card-elevated p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Total Coverage</h4>
              <p className="text-3xl font-bold text-amber-600 mb-1">34</p>
              <p className="text-gray-600">years of gaming history</p>
            </div>

            <div className="academic-card-elevated p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Content Creators</h4>
              <p className="text-3xl font-bold text-green-600 mb-1">{stats.uniqueDevelopers + stats.uniqueMakers}</p>
              <p className="text-gray-600">developers + makers</p>
            </div>

            <div className="academic-card-elevated p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <PieChart className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Content Variety</h4>
              <p className="text-3xl font-bold text-blue-600 mb-1">{stats.uniqueGenres + stats.uniqueCategories}</p>
              <p className="text-gray-600">genres + categories</p>
            </div>
          </div>
        </div>
      )}

      {/* Champions Section */}
      {activeSection === 'champions' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="academic-card-elevated p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Best Documented Game</h3>
              </div>
              
              <div className="text-center">
                <h4 className="text-2xl font-bold text-yellow-600 mb-2">
                  {(typeof bestGame?.GameTitle === 'object' ? bestGame?.GameTitle?.S : bestGame?.GameTitle) || bestGame?.gameTitle || bestGame?.title || 'N/A'}
                </h4>
                <p className="text-gray-700 mb-4 line-clamp-2">
                  {(typeof bestGame?.GameDescription === 'object' ? bestGame?.GameDescription?.S : bestGame?.GameDescription) || bestGame?.description || 'No description'}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Developer:</span>
                    <p className="font-semibold">
                      {(typeof bestGame?.Developer === 'object' ? bestGame?.Developer?.S : bestGame?.Developer) || bestGame?.developer || bestGame?.creator || 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Year:</span>
                    <p className="font-semibold">
                      {(typeof bestGame?.YearDeveloped === 'object' ? bestGame?.YearDeveloped?.S : bestGame?.YearDeveloped) || bestGame?.yearDeveloped || bestGame?.year || 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Genre:</span>
                    <p className="font-semibold">
                      {(typeof bestGame?.Genre === 'object' ? bestGame?.Genre?.S : bestGame?.Genre) || bestGame?.genre || 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Photos:</span>
                    <p className="font-semibold text-yellow-600">
                      {bestGame ? (() => {
                        if (bestGame.Photos) {
                          // Check if it's the DynamoDB format object with SS property
                          if (typeof bestGame.Photos === 'object' && !Array.isArray(bestGame.Photos)) {
                            const photosObj = bestGame.Photos as { SS?: string[] };
                            return photosObj.SS ? photosObj.SS.length : 0;
                          }
                          // Check if it's a direct array
                          if (Array.isArray(bestGame.Photos)) {
                            return bestGame.Photos.length;
                          }
                        }
                        // Check alternative photos property
                        if (bestGame.photos && Array.isArray(bestGame.photos)) {
                          return bestGame.photos.length;
                        }
                        return 0;
                      })() : 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="academic-card-elevated p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                  <Medal className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Featured Collection Item</h3>
              </div>
              
              <div className="text-center">
                <h4 className="text-2xl font-bold text-blue-600 mb-2">
                  {bestCollection?.name || 'N/A'}
                </h4>
                <p className="text-gray-700 mb-4 line-clamp-2">{bestCollection?.description || 'No description'}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Maker:</span>
                    <p className="font-semibold">{bestCollection?.maker || 'Unknown'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Year:</span>
                    <p className="font-semibold">{bestCollection?.year || 'Unknown'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Category:</span>
                    <p className="font-semibold capitalize">{bestCollection?.category || 'Unknown'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <p className="font-semibold text-blue-600">
                      {bestCollection?.image ? 'Documented' : 'Basic'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="academic-card-elevated p-8">
              <h4 className="text-xl font-bold text-gray-900 mb-6">Games Champions</h4>
              <div className="space-y-3">
                {topGameYears.slice(0, 3).map(([year, count], idx) => (
                  <div key={year} className={`flex items-center justify-between p-4 rounded-xl ${
                    idx === 0 ? 'bg-yellow-50 border border-yellow-200' :
                    idx === 1 ? 'bg-gray-50 border border-gray-200' :
                    'bg-orange-50 border border-orange-200'
                  }`}>
                    <div>
                      <h5 className={`font-semibold ${
                        idx === 0 ? 'text-yellow-800' :
                        idx === 1 ? 'text-gray-800' :
                        'text-orange-800'
                      }`}>{year}</h5>
                      <p className={`${
                        idx === 0 ? 'text-yellow-700' :
                        idx === 1 ? 'text-gray-700' :
                        'text-orange-700'
                      }`}>{count} games</p>
                    </div>
                    <div className={`text-2xl font-bold ${
                      idx === 0 ? 'text-yellow-600' :
                      idx === 1 ? 'text-gray-600' :
                      'text-orange-600'
                    }`}>#{idx + 1}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="academic-card-elevated p-8">
              <h4 className="text-xl font-bold text-gray-900 mb-6">Collections Champions</h4>
              <div className="space-y-3">
                {topCollectionCategories.slice(0, 3).map(([category, count], idx) => (
                  <div key={category} className={`flex items-center justify-between p-4 rounded-xl ${
                    idx === 0 ? 'bg-purple-50 border border-purple-200' :
                    idx === 1 ? 'bg-blue-50 border border-blue-200' :
                    'bg-green-50 border border-green-200'
                  }`}>
                    <div>
                      <h5 className={`font-semibold capitalize ${
                        idx === 0 ? 'text-purple-800' :
                        idx === 1 ? 'text-blue-800' :
                        'text-green-800'
                      }`}>{category}</h5>
                      <p className={`${
                        idx === 0 ? 'text-purple-700' :
                        idx === 1 ? 'text-blue-700' :
                        'text-green-700'
                      }`}>{count} devices</p>
                    </div>
                    <div className={`text-2xl font-bold ${
                      idx === 0 ? 'text-purple-600' :
                      idx === 1 ? 'text-blue-600' :
                      'text-green-600'
                    }`}>#{idx + 1}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Games Analysis */}
      {activeSection === 'games' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SimplePieChart data={topGameGenres} title="Game Genre Distribution" />
            <SimpleBarChart data={topGameGenres} title="Games by Genre" color="#10B981" />
          </div>
          <SimpleBarChart data={topGameDevelopers} title="Top Game Developers" color="#EF4444" />
        </div>
      )}

      {/* Collections Analysis */}
      {activeSection === 'collections' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SimplePieChart data={topCollectionCategories} title="Collection Category Distribution" />
            <SimpleBarChart data={topCollectionCategories} title="Collections by Category" color="#3B82F6" />
          </div>
          <SimpleBarChart data={topCollectionMakers} title="Top Collection Makers" color="#8B5CF6" />
        </div>
      )}

      {/* Quality Analysis */}
      {activeSection === 'quality' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="academic-card-elevated p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Games Documentation</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 font-medium">Games with Photos</span>
                    <span className="text-gray-900 font-bold">
                      {stats.totalGames > 0 ? Math.round((stats.documentedGames / stats.totalGames) * 100) : 0}%
                    </span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full"
                      style={{ width: `${stats.totalGames > 0 ? (stats.documentedGames / stats.totalGames) * 100 : 0}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {stats.documentedGames} of {stats.totalGames} games
                  </p>
                </div>
              </div>
            </div>

            <div className="academic-card-elevated p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Collections Documentation</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 font-medium">Collections with Images</span>
                    <span className="text-gray-900 font-bold">
                      {stats.totalCollections > 0 ? Math.round((stats.documentedCollections / stats.totalCollections) * 100) : 0}%
                    </span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-4 rounded-full"
                      style={{ width: `${stats.totalCollections > 0 ? (stats.documentedCollections / stats.totalCollections) * 100 : 0}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {stats.documentedCollections} of {stats.totalCollections} collections
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="academic-card-elevated p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Overall Quality Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center bg-green-50 border border-green-200 rounded-xl p-6">
                <h4 className="font-semibold text-green-800 mb-1">Overall Documentation</h4>
                <div className="text-3xl font-bold text-green-600 mb-1">{overallDocRate}%</div>
                <p className="text-green-700 text-sm">items with visuals</p>
              </div>
              
              <div className="text-center bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h4 className="font-semibold text-blue-800 mb-1">Content Variety</h4>
                <div className="text-3xl font-bold text-blue-600 mb-1">{stats.uniqueGenres + stats.uniqueCategories}</div>
                <p className="text-blue-700 text-sm">types covered</p>
              </div>
              
              <div className="text-center bg-purple-50 border border-purple-200 rounded-xl p-6">
                <h4 className="font-semibold text-purple-800 mb-1">Creator Diversity</h4>
                <div className="text-3xl font-bold text-purple-600 mb-1">{stats.uniqueDevelopers + stats.uniqueMakers}</div>
                <p className="text-purple-700 text-sm">unique creators</p>
              </div>

              <div className="text-center bg-orange-50 border border-orange-200 rounded-xl p-6">
                <h4 className="font-semibold text-orange-800 mb-1">Collection Size</h4>
                <div className="text-3xl font-bold text-orange-600 mb-1">{stats.totalItems}</div>
                <p className="text-orange-700 text-sm">total items</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}