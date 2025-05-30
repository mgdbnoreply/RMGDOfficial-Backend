import { useState } from 'react';
import { BarChart3, Calendar, Users, TrendingUp, PieChart, Activity, BookOpen, Globe, Clock, Award } from 'lucide-react';
import { Game } from '@/types';

interface AnalyticsTabProps {
  games: Game[];
}

export default function AnalyticsTab({ games }: AnalyticsTabProps) {
  const [activeSection, setActiveSection] = useState('overview');

  // Data Processing
  const genreData = games.reduce((acc, game) => {
    const genre = game.Genre?.S || 'Unknown';
    acc[genre] = (acc[genre] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const yearData = games.reduce((acc, game) => {
    const year = game.YearDeveloped?.S || 'Unknown';
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const developerData = games.reduce((acc, game) => {
    const dev = game.Developer?.S || 'Unknown';
    acc[dev] = (acc[dev] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topDevelopers = Object.entries(developerData)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);

  const sortedYearData = Object.entries(yearData)
    .filter(([year]) => year !== 'Unknown' && year !== '')
    .sort(([a], [b]) => a.localeCompare(b));

  const topGenres = Object.entries(genreData)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8);

  // Era Analysis
  const eraData = {
    'Early Era (1975-1989)': games.filter(g => {
      const year = parseInt(g.YearDeveloped?.S || '0');
      return year >= 1975 && year <= 1989;
    }).length,
    'Golden Age (1990-1999)': games.filter(g => {
      const year = parseInt(g.YearDeveloped?.S || '0');
      return year >= 1990 && year <= 1999;
    }).length,
    'Modern Era (2000-2008)': games.filter(g => {
      const year = parseInt(g.YearDeveloped?.S || '0');
      return year >= 2000 && year <= 2008;
    }).length
  };

  // Research Insights
  const insights = {
    totalGames: games.length,
    totalDevelopers: Object.keys(developerData).length,
    totalGenres: Object.keys(genreData).length,
    avgGamesPerYear: Math.round(games.length / (2008 - 1975 + 1)),
    mostProductiveYear: sortedYearData.reduce((max, [year, count]) => 
      count > max.count ? { year, count } : max, { year: '', count: 0 }),
    dominantGenre: topGenres[0] || ['Unknown', 0],
    topDeveloper: topDevelopers[0] || ['Unknown', 0],
    documentationRate: Math.round((games.filter(g => g.Photos?.SS?.length > 0).length / games.length) * 100)
  };

  const sections = [
    { id: 'overview', label: 'Research Overview', icon: BarChart3 },
    { id: 'temporal', label: 'Temporal Analysis', icon: Calendar },
    { id: 'genres', label: 'Genre Distribution', icon: PieChart },
    { id: 'developers', label: 'Developer Insights', icon: Users },
    { id: 'insights', label: 'Research Findings', icon: BookOpen }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="academic-card-elevated p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary">Research Analytics Center</h2>
            <p className="text-secondary text-lg">Comprehensive analysis of retro mobile gaming data (1975-2008)</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all font-medium text-base ${
                activeSection === section.id
                  ? 'bg-red-600 text-white shadow-sm'
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
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Total Games Catalogued', value: insights.totalGames, icon: Activity, color: 'bg-blue-50 border-blue-200 text-blue-800', iconBg: 'bg-blue-600' },
              { title: 'Unique Developers', value: insights.totalDevelopers, icon: Users, color: 'bg-green-50 border-green-200 text-green-800', iconBg: 'bg-green-600' },
              { title: 'Game Genres', value: insights.totalGenres, icon: PieChart, color: 'bg-purple-50 border-purple-200 text-purple-800', iconBg: 'bg-purple-600' },
              { title: 'Documentation Rate', value: `${insights.documentationRate}%`, icon: BookOpen, color: 'bg-orange-50 border-orange-200 text-orange-800', iconBg: 'bg-orange-600' }
            ].map((metric, idx) => (
              <div key={idx} className={`academic-card p-6 ${metric.color}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium mb-1">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  </div>
                  <div className={`w-10 h-10 ${metric.iconBg} rounded-lg flex items-center justify-center`}>
                    <metric.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Era Distribution */}
          <div className="academic-card-elevated p-8">
            <h3 className="text-xl font-bold text-primary mb-6 flex items-center">
              <Clock className="w-6 h-6 mr-2 text-red-600" />
              Historical Era Distribution
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(eraData).map(([era, count], idx) => (
                <div key={era} className="text-center">
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    idx === 0 ? 'bg-amber-100 border-4 border-amber-300' :
                    idx === 1 ? 'bg-red-100 border-4 border-red-300' :
                    'bg-blue-100 border-4 border-blue-300'
                  }`}>
                    <span className={`text-2xl font-bold ${
                      idx === 0 ? 'text-amber-800' :
                      idx === 1 ? 'text-red-800' :
                      'text-blue-800'
                    }`}>
                      {count}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{era}</h4>
                  <p className="text-sm text-gray-600">
                    {Math.round((count / games.length) * 100)}% of collection
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Temporal Analysis */}
      {activeSection === 'temporal' && (
        <div className="space-y-6">
          <div className="academic-card-elevated p-8">
            <h3 className="text-xl font-bold text-primary mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-red-600" />
              Games by Year (1975-2008)
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {sortedYearData.map(([year, count]) => (
                <div key={year} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold text-gray-900 w-16">{year}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 min-w-[200px]">
                      <div 
                        className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(count / Math.max(...Object.values(yearData))) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-lg font-bold text-gray-900 min-w-[3rem] text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Peak Years Analysis */}
          <div className="academic-card-elevated p-8">
            <h3 className="text-xl font-bold text-primary mb-6">Peak Development Years</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Most Productive Year</h4>
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-red-800 mb-2">{insights.mostProductiveYear.year}</div>
                  <div className="text-lg text-red-700">{insights.mostProductiveYear.count} games</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Average Games Per Year</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-blue-800 mb-2">{insights.avgGamesPerYear}</div>
                  <div className="text-lg text-blue-700">games/year</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Genre Analysis */}
      {activeSection === 'genres' && (
        <div className="space-y-6">
          <div className="academic-card-elevated p-8">
            <h3 className="text-xl font-bold text-primary mb-6 flex items-center">
              <PieChart className="w-6 h-6 mr-2 text-red-600" />
              Genre Distribution Analysis
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Top Genres</h4>
                <div className="space-y-3">
                  {topGenres.map(([genre, count], idx) => (
                    <div key={genre} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${
                          idx === 0 ? 'bg-red-500' :
                          idx === 1 ? 'bg-blue-500' :
                          idx === 2 ? 'bg-green-500' :
                          idx === 3 ? 'bg-purple-500' :
                          idx === 4 ? 'bg-orange-500' :
                          idx === 5 ? 'bg-pink-500' :
                          idx === 6 ? 'bg-indigo-500' :
                          'bg-gray-500'
                        }`}></div>
                        <span className="font-medium text-gray-900">{genre}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              idx === 0 ? 'bg-red-500' :
                              idx === 1 ? 'bg-blue-500' :
                              idx === 2 ? 'bg-green-500' :
                              idx === 3 ? 'bg-purple-500' :
                              idx === 4 ? 'bg-orange-500' :
                              idx === 5 ? 'bg-pink-500' :
                              idx === 6 ? 'bg-indigo-500' :
                              'bg-gray-500'
                            }`}
                            style={{ width: `${(count / Math.max(...Object.values(genreData))) * 100}%` }}
                          />
                        </div>
                        <span className="font-bold text-gray-900 min-w-[2rem] text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Genre Statistics</h4>
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-red-800 font-medium">Dominant Genre</span>
                      <span className="text-red-900 font-bold">{insights.dominantGenre[0]}</span>
                    </div>
                    <div className="text-sm text-red-700 mt-1">
                      {insights.dominantGenre[1]} games ({Math.round((insights.dominantGenre[1] / games.length) * 100)}%)
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-800 font-medium">Genre Diversity</span>
                      <span className="text-blue-900 font-bold">{insights.totalGenres}</span>
                    </div>
                    <div className="text-sm text-blue-700 mt-1">
                      Unique game categories identified
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-green-800 font-medium">Average per Genre</span>
                      <span className="text-green-900 font-bold">{Math.round(games.length / insights.totalGenres)}</span>
                    </div>
                    <div className="text-sm text-green-700 mt-1">
                      Games per genre category
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Developer Analysis */}
      {activeSection === 'developers' && (
        <div className="space-y-6">
          <div className="academic-card-elevated p-8">
            <h3 className="text-xl font-bold text-primary mb-6 flex items-center">
              <Users className="w-6 h-6 mr-2 text-red-600" />
              Developer Ecosystem Analysis
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Top 10 Developers</h4>
                <div className="space-y-3">
                  {topDevelopers.map(([developer, count], idx) => (
                    <div key={developer} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          idx < 3 ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gray-500'
                        }`}>
                          {idx + 1}
                        </div>
                        <span className="font-medium text-gray-900 truncate max-w-xs">{developer}</span>
                      </div>
                      <span className="font-bold text-gray-900">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Developer Insights</h4>
                <div className="space-y-4">
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-purple-800 font-medium">Leading Developer</span>
                      <span className="text-purple-900 font-bold truncate max-w-xs">{insights.topDeveloper[0]}</span>
                    </div>
                    <div className="text-sm text-purple-700 mt-1">
                      {insights.topDeveloper[1]} games in collection
                    </div>
                  </div>

                  <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-indigo-800 font-medium">Total Developers</span>
                      <span className="text-indigo-900 font-bold">{insights.totalDevelopers}</span>
                    </div>
                    <div className="text-sm text-indigo-700 mt-1">
                      Unique development entities
                    </div>
                  </div>

                  <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-teal-800 font-medium">Avg Games per Dev</span>
                      <span className="text-teal-900 font-bold">{Math.round(games.length / insights.totalDevelopers * 10) / 10}</span>
                    </div>
                    <div className="text-sm text-teal-700 mt-1">
                      Developer productivity metric
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Research Findings */}
      {activeSection === 'insights' && (
        <div className="space-y-6">
          <div className="academic-card-elevated p-8">
            <h3 className="text-xl font-bold text-primary mb-6 flex items-center">
              <BookOpen className="w-6 h-6 mr-2 text-red-600" />
              Key Research Findings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Historical Insights</h4>
                <div className="space-y-4">
                  <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
                    <h5 className="font-medium text-amber-800 mb-2">Era Evolution</h5>
                    <p className="text-amber-700 text-sm">
                      The collection spans {2008 - 1975 + 1} years of mobile gaming history, 
                      showing clear evolution from simple handheld devices to sophisticated mobile games.
                    </p>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                    <h5 className="font-medium text-blue-800 mb-2">Development Peaks</h5>
                    <p className="text-blue-700 text-sm">
                      {insights.mostProductiveYear.year} was the most productive year with {insights.mostProductiveYear.count} games, 
                      indicating significant industry growth during this period.
                    </p>
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-400 p-4">
                    <h5 className="font-medium text-green-800 mb-2">Genre Diversity</h5>
                    <p className="text-green-700 text-sm">
                      With {insights.totalGenres} distinct genres, the collection demonstrates 
                      rich diversity in mobile gaming experiences across the retro era.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Collection Quality</h4>
                <div className="space-y-4">
                  <div className="bg-purple-50 border-l-4 border-purple-400 p-4">
                    <h5 className="font-medium text-purple-800 mb-2">Documentation Rate</h5>
                    <p className="text-purple-700 text-sm">
                      {insights.documentationRate}% of games have visual documentation, 
                      providing strong research value for historical analysis.
                    </p>
                  </div>

                  <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <h5 className="font-medium text-red-800 mb-2">Developer Ecosystem</h5>
                    <p className="text-red-700 text-sm">
                      {insights.totalDevelopers} unique developers contributed to the collection, 
                      with {insights.topDeveloper[0]} leading with {insights.topDeveloper[1]} games.
                    </p>
                  </div>

                  <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4">
                    <h5 className="font-medium text-indigo-800 mb-2">Research Impact</h5>
                    <p className="text-indigo-700 text-sm">
                      This comprehensive database enables longitudinal studies of mobile gaming 
                      evolution and cultural impact across three decades.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Research Recommendations */}
          <div className="academic-card-elevated p-8">
            <h3 className="text-xl font-bold text-primary mb-6 flex items-center">
              <Award className="w-6 h-6 mr-2 text-red-600" />
              Research Recommendations
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
                <h4 className="font-semibold text-red-800 mb-3">Temporal Studies</h4>
                <p className="text-red-700 text-sm">
                  Investigate gaming technology evolution patterns and cultural shifts 
                  across the documented timeline.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                <h4 className="font-semibold text-blue-800 mb-3">Genre Analysis</h4>
                <p className="text-blue-700 text-sm">
                  Examine genre emergence, popularity cycles, and their relationship 
                  to technological capabilities of each era.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
                <h4 className="font-semibold text-green-800 mb-3">Developer Impact</h4>
                <p className="text-green-700 text-sm">
                  Study the influence of key developers on industry direction 
                  and innovation patterns in mobile gaming.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}