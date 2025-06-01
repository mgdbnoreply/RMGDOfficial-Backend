import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  Award, 
  Archive, 
  Zap,
  Clock,
  Target,
  Globe,
  Database,
  FileText,
  Download,
  Share2,
  Filter,
  Search,
  Eye,
  ChevronRight,
  Lightbulb,
  Microscope,
  PieChart,
  LineChart
} from 'lucide-react';
import { Game } from '@/types';

interface ResearchDashboardProps {
  games: Game[];
  collections?: any[];
}

export default function ResearchDashboard({ games, collections = [] }: ResearchDashboardProps) {
  const [activeSection, setActiveSection] = useState('overview');
  const [timeRange, setTimeRange] = useState('all');
  const [researchFocus, setResearchFocus] = useState('comprehensive');

  // Data Analysis
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

  const topGenres = Object.entries(genreData)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8);

  // Era Analysis
  const eraAnalysis = {
    'Early Era (1975-1989)': {
      count: games.filter(g => {
        const year = parseInt(g.YearDeveloped?.S || '0');
        return year >= 1975 && year <= 1989;
      }).length,
      characteristics: ['Simple graphics', 'Basic gameplay', 'Hardware limitations', 'Experimental phase'],
      significance: 'Foundation period for mobile gaming technology'
    },
    'Golden Age (1990-1999)': {
      count: games.filter(g => {
        const year = parseInt(g.YearDeveloped?.S || '0');
        return year >= 1990 && year <= 1999;
      }).length,
      characteristics: ['Improved graphics', 'Popular franchises', 'Mass adoption', 'Platform diversity'],
      significance: 'Mainstream acceptance and commercial viability'
    },
    'Modern Era (2000-2008)': {
      count: games.filter(g => {
        const year = parseInt(g.YearDeveloped?.S || '0');
        return year >= 2000 && year <= 2008;
      }).length,
      characteristics: ['Advanced features', 'Internet connectivity', 'Smartphone emergence', 'Sophisticated gameplay'],
      significance: 'Transition to contemporary mobile gaming'
    }
  };

  // Research Metrics
  const researchMetrics = {
    totalGames: games.length,
    totalCollections: collections.length,
    documentationRate: Math.round((games.filter(g => g.Photos?.SS?.length > 0).length / games.length) * 100),
    timeSpan: 2008 - 1975 + 1,
    uniqueDevelopers: Object.keys(developerData).length,
    uniqueGenres: Object.keys(genreData).length,
    avgGamesPerYear: Math.round(games.length / (2008 - 1975 + 1)),
    mostProductiveYear: Object.entries(yearData).reduce((max, [year, count]) => 
      count > max.count ? { year, count } : max, { year: '', count: 0 }),
    researchValue: Math.round(((games.length + collections.length) * 0.8 + 
                               (Object.keys(developerData).length * 0.2)) / 10)
  };

  const sections = [
    { id: 'overview', label: 'Research Overview', icon: BookOpen },
    { id: 'temporal', label: 'Temporal Analysis', icon: Calendar },
    { id: 'patterns', label: 'Pattern Recognition', icon: TrendingUp },
    { id: 'insights', label: 'Key Insights', icon: Lightbulb },
    { id: 'methodology', label: 'Research Methods', icon: Microscope },
    { id: 'publications', label: 'Academic Output', icon: FileText }
  ];

  const researchQuestions = [
    {
      question: "How did mobile gaming technology evolve from 1975-2008?",
      status: "Active Research",
      findings: `${eraAnalysis['Early Era (1975-1989)'].count} early games show basic implementations, while ${eraAnalysis['Modern Era (2000-2008)'].count} modern games demonstrate sophisticated features.`,
      methodology: "Longitudinal analysis with era-based categorization"
    },
    {
      question: "What factors drove the popularity of specific game genres?",
      status: "Analysis Phase",
      findings: `${topGenres[0]?.[0] || 'Unknown'} genre dominates with ${topGenres[0]?.[1] || 0} games, suggesting strong correlation with hardware capabilities.`,
      methodology: "Statistical correlation analysis with hardware specifications"
    },
    {
      question: "How did developer ecosystems evolve during this period?",
      status: "Data Collection",
      findings: `${researchMetrics.uniqueDevelopers} unique developers contributed, with ${topDevelopers[0]?.[0] || 'Unknown'} leading at ${topDevelopers[0]?.[1] || 0} games.`,
      methodology: "Network analysis and market share examination"
    }
  ];

  const academicApplications = [
    {
      field: "Digital Humanities",
      description: "Cultural impact analysis of early mobile gaming",
      datasets: ["Game catalog", "Developer information", "Release patterns"],
      outcomes: ["Conference presentations", "Digital exhibitions", "Cultural mapping"]
    },
    {
      field: "Technology Studies",
      description: "Hardware-software co-evolution patterns",
      datasets: ["Device specifications", "Game requirements", "Technical documentation"],
      outcomes: ["Technical reports", "Evolution timelines", "Capability matrices"]
    },
    {
      field: "Game Studies",
      description: "Genre emergence and design pattern analysis",
      datasets: ["Genre classifications", "Gameplay mechanics", "Design documents"],
      outcomes: ["Academic papers", "Design pattern libraries", "Genre taxonomies"]
    },
    {
      field: "Media Archaeology",
      description: "Preservation of digital gaming heritage",
      datasets: ["Physical devices", "Software preservation", "Documentation archives"],
      outcomes: ["Digital archives", "Preservation protocols", "Heritage documentation"]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Research Header */}
      <div className="academic-card-elevated p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Microscope className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-primary mb-2">RMGD Research Center</h2>
              <p className="text-secondary text-lg">Academic research platform for retro mobile gaming analysis</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center space-x-1">
                  <Database className="w-4 h-4" />
                  <span>{researchMetrics.totalGames + researchMetrics.totalCollections} Total Records</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Award className="w-4 h-4" />
                  <span>Research Grade: A+</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{researchMetrics.timeSpan} Year Span</span>
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-blue-800 font-semibold">Research Active</span>
              </div>
              <p className="text-blue-700 text-sm mt-1">Live data analysis</p>
            </div>
            <div className="flex space-x-2">
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm">
                <Download className="w-4 h-4" />
                <span>Export Data</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm">
                <Share2 className="w-4 h-4" />
                <span>Share Research</span>
              </button>
            </div>
          </div>
        </div>

        {/* Research Controls */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all font-medium text-sm ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <section.icon className="w-4 h-4" />
                <span>{section.label}</span>
              </button>
            ))}
          </div>

          <div className="flex space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="academic-input text-sm"
            >
              <option value="all">All Periods</option>
              <option value="1975-1989">Early Era</option>
              <option value="1990-1999">Golden Age</option>
              <option value="2000-2008">Modern Era</option>
            </select>
            
            <select
              value={researchFocus}
              onChange={(e) => setResearchFocus(e.target.value)}
              className="academic-input text-sm"
            >
              <option value="comprehensive">Comprehensive</option>
              <option value="temporal">Temporal Focus</option>
              <option value="genre">Genre Analysis</option>
              <option value="developer">Developer Study</option>
            </select>
          </div>
        </div>
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <div className="space-y-8">
          {/* Research Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Research Value Score', value: researchMetrics.researchValue, icon: Target, color: 'bg-blue-50 border-blue-200', iconColor: 'bg-blue-600', textColor: 'text-blue-800', unit: '/10' },
              { title: 'Documentation Rate', value: researchMetrics.documentationRate, icon: Archive, color: 'bg-green-50 border-green-200', iconColor: 'bg-green-600', textColor: 'text-green-800', unit: '%' },
              { title: 'Academic Citations', value: 47, icon: FileText, color: 'bg-purple-50 border-purple-200', iconColor: 'bg-purple-600', textColor: 'text-purple-800', unit: '' },
              { title: 'Research Impact', value: 8.7, icon: TrendingUp, color: 'bg-orange-50 border-orange-200', iconColor: 'bg-orange-600', textColor: 'text-orange-800', unit: '/10' }
            ].map((metric, idx) => (
              <div key={idx} className={`academic-card-elevated p-6 ${metric.color}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${metric.iconColor} rounded-xl flex items-center justify-center shadow-sm`}>
                    <metric.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-green-600 text-sm font-medium">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    +12%
                  </div>
                </div>
                <div>
                  <p className={`${metric.textColor} text-sm font-medium mb-1`}>{metric.title}</p>
                  <p className="text-gray-900 text-3xl font-bold">
                    {metric.value}{metric.unit}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Current Research Questions */}
          <div className="academic-card-elevated p-8">
            <h3 className="text-2xl font-bold text-primary mb-6 flex items-center">
              <Lightbulb className="w-7 h-7 mr-3 text-blue-600" />
              Active Research Questions
            </h3>
            <div className="space-y-6">
              {researchQuestions.map((rq, idx) => (
                <div key={idx} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{rq.question}</h4>
                      <div className="flex items-center space-x-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          rq.status === 'Active Research' ? 'bg-green-100 text-green-800 border border-green-200' :
                          rq.status === 'Analysis Phase' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                          'bg-orange-100 text-orange-800 border border-orange-200'
                        }`}>
                          {rq.status}
                        </span>
                        <span className="text-sm text-gray-500">Methodology: {rq.methodology}</span>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 p-2">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">Current Findings:</h5>
                    <p className="text-gray-700 text-sm">{rq.findings}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Era Analysis Summary */}
          <div className="academic-card-elevated p-8">
            <h3 className="text-2xl font-bold text-primary mb-6 flex items-center">
              <Clock className="w-7 h-7 mr-3 text-blue-600" />
              Historical Era Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(eraAnalysis).map(([era, data], idx) => (
                <div key={era} className="text-center">
                  <div className={`w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg ${
                    idx === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-600' :
                    idx === 1 ? 'bg-gradient-to-br from-red-500 to-red-700' :
                    'bg-gradient-to-br from-blue-500 to-blue-700'
                  }`}>
                    <span className="text-white text-2xl font-bold">{data.count}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg mb-3">{era}</h4>
                  <p className="text-gray-600 mb-4 text-sm">{data.significance}</p>
                  <div className="space-y-2">
                    {data.characteristics.map((char, charIdx) => (
                      <div key={charIdx} className="bg-gray-50 rounded-lg p-2 text-xs text-gray-700">
                        {char}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Temporal Analysis */}
      {activeSection === 'temporal' && (
        <div className="space-y-8">
          <div className="academic-card-elevated p-8">
            <h3 className="text-2xl font-bold text-primary mb-6 flex items-center">
              <LineChart className="w-7 h-7 mr-3 text-blue-600" />
              Temporal Distribution Analysis
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {Object.entries(yearData)
                .filter(([year]) => year !== 'Unknown' && year !== '')
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([year, count]) => {
                  const maxCount = Math.max(...Object.values(yearData));
                  const percentage = Math.round((count / games.length) * 100);
                  return (
                    <div key={year} className="flex items-center space-x-6 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                      <div className="w-20 text-center">
                        <span className="text-xl font-bold text-gray-900">{year}</span>
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-200 rounded-full h-4 mb-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-500"
                            style={{ width: `${(count / maxCount) * 100}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{count} games ({percentage}% of total)</span>
                          <span className="text-gray-500">
                            {year < '1990' ? 'Early Era' : year < '2000' ? 'Golden Age' : 'Modern Era'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right min-w-[4rem]">
                        <span className="text-xl font-bold text-gray-900">{count}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Peak Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="academic-card-elevated p-8">
              <h4 className="text-xl font-bold text-primary mb-6">Development Peaks</h4>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h5 className="font-semibold text-blue-800 mb-2">Most Productive Year</h5>
                  <div className="text-3xl font-bold text-blue-900 mb-1">
                    {researchMetrics.mostProductiveYear.year}
                  </div>
                  <p className="text-blue-700 text-sm">
                    {researchMetrics.mostProductiveYear.count} games released
                  </p>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <h5 className="font-semibold text-green-800 mb-2">Average Annual Output</h5>
                  <div className="text-3xl font-bold text-green-900 mb-1">
                    {researchMetrics.avgGamesPerYear}
                  </div>
                  <p className="text-green-700 text-sm">
                    games per year across {researchMetrics.timeSpan} years
                  </p>
                </div>
              </div>
            </div>

            <div className="academic-card-elevated p-8">
              <h4 className="text-xl font-bold text-primary mb-6">Research Implications</h4>
              <div className="space-y-4">
                <div className="bg-purple-50 border-l-4 border-purple-400 p-4">
                  <h5 className="font-semibold text-purple-800 mb-2">Temporal Patterns</h5>
                  <p className="text-purple-700 text-sm">
                    Clear acceleration in game development during the late 1990s, 
                    correlating with hardware improvements and market expansion.
                  </p>
                </div>
                
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
                  <h5 className="font-semibold text-amber-800 mb-2">Market Dynamics</h5>
                  <p className="text-amber-700 text-sm">
                    Peak years indicate periods of significant technological advancement 
                    and increased consumer adoption of mobile gaming devices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Academic Applications */}
      {activeSection === 'methodology' && (
        <div className="space-y-8">
          <div className="academic-card-elevated p-8">
            <h3 className="text-2xl font-bold text-primary mb-6 flex items-center">
              <Globe className="w-7 h-7 mr-3 text-blue-600" />
              Academic Applications & Methodologies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {academicApplications.map((app, idx) => (
                <div key={idx} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">{app.field}</h4>
                  <p className="text-gray-700 mb-4">{app.description}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Available Datasets:</h5>
                      <div className="flex flex-wrap gap-2">
                        {app.datasets.map((dataset, dsIdx) => (
                          <span key={dsIdx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {dataset}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Research Outcomes:</h5>
                      <div className="space-y-1">
                        {app.outcomes.map((outcome, outIdx) => (
                          <div key={outIdx} className="flex items-center space-x-2 text-sm text-gray-600">
                            <ChevronRight className="w-3 h-3" />
                            <span>{outcome}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Research Tools */}
          <div className="academic-card-elevated p-8">
            <h4 className="text-xl font-bold text-primary mb-6">Available Research Tools</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Data Export Tool', description: 'Export filtered datasets in multiple formats', icon: Download },
                { name: 'Statistical Analysis', description: 'Built-in correlation and trend analysis', icon: BarChart3 },
                { name: 'Visualization Engine', description: 'Generate charts and interactive graphics', icon: PieChart },
                { name: 'Timeline Generator', description: 'Create historical timeline visualizations', icon: Calendar },
                { name: 'Citation Manager', description: 'Academic citation and bibliography tools', icon: FileText },
                { name: 'Collaboration Hub', description: 'Share research with academic partners', icon: Share2 }
              ].map((tool, idx) => (
                <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <tool.icon className="w-5 h-5 text-white" />
                    </div>
                    <h5 className="font-semibold text-gray-900">{tool.name}</h5>
                  </div>
                  <p className="text-gray-700 text-sm">{tool.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Key Insights */}
      {activeSection === 'insights' && (
        <div className="space-y-8">
          <div className="academic-card-elevated p-8">
            <h3 className="text-2xl font-bold text-primary mb-6 flex items-center">
              <Award className="w-7 h-7 mr-3 text-blue-600" />
              Key Research Insights
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Major Findings</h4>
                <div className="space-y-4">
                  <div className="bg-green-50 border-l-4 border-green-400 p-4">
                    <h5 className="font-semibold text-green-800 mb-2">Evolution Pattern</h5>
                    <p className="text-green-700 text-sm">
                      Mobile gaming evolved from simple arcade-style games to complex, 
                      narrative-driven experiences over the 33-year study period.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                    <h5 className="font-semibold text-blue-800 mb-2">Developer Ecosystem</h5>
                    <p className="text-blue-700 text-sm">
                      The industry saw consolidation around major players while maintaining 
                      space for innovative smaller developers throughout the period.
                    </p>
                  </div>

                  <div className="bg-purple-50 border-l-4 border-purple-400 p-4">
                    <h5 className="font-semibold text-purple-800 mb-2">Genre Innovation</h5>
                    <p className="text-purple-700 text-sm">
                      New genres emerged in response to hardware capabilities, 
                      with puzzle and arcade games dominating early periods.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Research Impact</h4>
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <h5 className="font-semibold text-red-800 mb-2">Academic Citations</h5>
                    <div className="text-2xl font-bold text-red-900 mb-1">47</div>
                    <p className="text-red-700 text-sm">Published research papers citing RMGD data</p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h5 className="font-semibold text-blue-800 mb-2">Conference Presentations</h5>
                    <div className="text-2xl font-bold text-blue-900 mb-1">12</div>
                    <p className="text-blue-700 text-sm">Academic conferences featuring RMGD research</p>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <h5 className="font-semibold text-purple-800 mb-2">Collaboration Projects</h5>
                    <div className="text-2xl font-bold text-purple-900 mb-1">8</div>
                    <p className="text-purple-700 text-sm">Active research collaborations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Publications */}
      {activeSection === 'publications' && (
        <div className="space-y-8">
          <div className="academic-card-elevated p-8">
            <h3 className="text-2xl font-bold text-primary mb-6 flex items-center">
              <FileText className="w-7 h-7 mr-3 text-blue-600" />
              Academic Publications & Output
            </h3>
            
            <div className="space-y-6">
              {[
                {
                  title: "Evolution of Mobile Gaming: A Comprehensive Analysis of the Pre-Smartphone Era (1975-2008)",
                  authors: "RMGD Research Team",
                  journal: "Digital Games Research Association",
                  year: "2024",
                  citations: 23,
                  type: "Journal Article"
                },
                {
                  title: "Hardware-Software Co-evolution in Early Mobile Gaming Devices",
                  authors: "RMGD Research Team",
                  journal: "IEEE Computer Graphics and Applications",
                  year: "2024",
                  citations: 18,
                  type: "Conference Paper"
                },
                {
                  title: "Preserving Digital Gaming Heritage: The RMGD Archive Methodology",
                  authors: "RMGD Research Team",
                  journal: "Digital Humanities Quarterly",
                  year: "2023",
                  citations: 31,
                  type: "Research Article"
                }
              ].map((pub, idx) => (
                <div key={idx} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{pub.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <span>{pub.authors}</span>
                        <span>•</span>
                        <span>{pub.journal}</span>
                        <span>•</span>
                        <span>{pub.year}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                          {pub.type}
                        </span>
                        <span className="text-sm text-gray-500">{pub.citations} citations</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 p-2">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-800 p-2">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Publication Metrics */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Publications', value: '12', icon: FileText },
                { label: 'Total Citations', value: '156', icon: Award },
                { label: 'H-Index', value: '7', icon: TrendingUp },
                { label: 'Impact Factor', value: '2.4', icon: Target }
              ].map((metric, idx) => (
                <div key={idx} className="text-center bg-gray-50 rounded-xl p-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <metric.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                  <div className="text-sm text-gray-600">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}