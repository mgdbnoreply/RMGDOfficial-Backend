import { ExternalLink, Database, Shield, Download, RefreshCw, Settings, Activity, HardDrive, Network, Users } from 'lucide-react';

export default function AdminTab() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="academic-card-elevated p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center">
            <Settings className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary">System Administration</h2>
            <p className="text-secondary text-lg">Database management and system configuration</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-all text-left">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-green-800">Sync Database</p>
              <p className="text-sm text-green-600">Update from API</p>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-all text-left">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-blue-800">Export Data</p>
              <p className="text-sm text-blue-600">Download CSV</p>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition-all text-left">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <ExternalLink className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-purple-800">Research Tools</p>
              <p className="text-sm text-purple-600">Open external</p>
            </div>
          </button>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="academic-card-elevated p-8">
          <h3 className="text-xl font-bold text-primary mb-6 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-red-600" />
            System Status
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="font-medium text-green-800">API Connection</p>
                  <p className="text-sm text-green-600">Database endpoint responsive</p>
                </div>
              </div>
              <div className="text-green-700 font-medium">Online</div>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-blue-800">Database Sync</p>
                  <p className="text-sm text-blue-600">Last synchronized 2 minutes ago</p>
                </div>
              </div>
              <div className="text-blue-700 font-medium">Active</div>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 border border-purple-200 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-purple-800">Authentication</p>
                  <p className="text-sm text-purple-600">User sessions secured</p>
                </div>
              </div>
              <div className="text-purple-700 font-medium">Secure</div>
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-orange-800">Backup System</p>
                  <p className="text-sm text-orange-600">Auto-backup enabled</p>
                </div>
              </div>
              <div className="text-orange-700 font-medium">Running</div>
            </div>
          </div>
        </div>

        <div className="academic-card-elevated p-8">
          <h3 className="text-xl font-bold text-primary mb-6 flex items-center">
            <Database className="w-6 h-6 mr-2 text-red-600" />
            Database Information
          </h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <HardDrive className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm text-red-600 font-medium">Storage</p>
                <p className="text-lg font-bold text-red-800">2.4 GB</p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Network className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm text-blue-600 font-medium">API Calls</p>
                <p className="text-lg font-bold text-blue-800">1,247</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Database Type</span>
                <span className="text-gray-900 font-semibold">AWS DynamoDB</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">API Endpoint</span>
                <span className="text-gray-900 font-mono text-sm">u3iysopa88...amazonaws.com</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Time Period</span>
                <span className="text-gray-900 font-semibold">1975 - 2008</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Research Focus</span>
                <span className="text-gray-900 font-semibold">Mobile Gaming History</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Management Tools */}
      <div className="academic-card-elevated p-8">
        <h3 className="text-xl font-bold text-primary mb-6 flex items-center">
          <Shield className="w-6 h-6 mr-2 text-red-600" />
          Management Tools
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Database className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Data Management</h4>
            <p className="text-sm text-gray-600 mb-4">Import, export, and backup database records</p>
            <button className="w-full px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors font-medium">
              Manage Data
            </button>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">User Permissions</h4>
            <p className="text-sm text-gray-600 mb-4">Manage user access and role assignments</p>
            <button className="w-full px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors font-medium">
              User Settings
            </button>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">System Monitoring</h4>
            <p className="text-sm text-gray-600 mb-4">View logs, performance metrics, and alerts</p>
            <button className="w-full px-4 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors font-medium">
              View Logs
            </button>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Configuration</h4>
            <p className="text-sm text-gray-600 mb-4">System settings and API configuration</p>
            <button className="w-full px-4 py-2 bg-orange-100 text-orange-800 rounded-lg hover:bg-orange-200 transition-colors font-medium">
              Configure
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="academic-card-elevated p-8">
        <h3 className="text-xl font-bold text-primary mb-6">Recent Activity</h3>
        
        <div className="space-y-4">
          {[
            { action: 'Database sync completed', time: '2 minutes ago', type: 'success' },
            { action: 'New user added: researcher@rmgd.org', time: '15 minutes ago', type: 'info' },
            { action: 'Game record updated: Snake (1997)', time: '1 hour ago', type: 'info' },
            { action: 'Data export generated', time: '3 hours ago', type: 'success' },
            { action: 'User login: admin@rmgd.org', time: '4 hours ago', type: 'info' }
          ].map((activity, idx) => (
            <div key={idx} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${
                activity.type === 'success' ? 'bg-green-500' : 
                activity.type === 'warning' ? 'bg-yellow-500' : 
                'bg-blue-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">{activity.action}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}