"use client";
import { Database, Clock, Wrench, Smartphone, Calendar, MapPin, Archive } from 'lucide-react';

export default function ConsoleCollection() {
  const upcomingFeatures = [
    {
      title: 'Physical Console Catalog',
      description: 'Comprehensive database of mobile gaming devices and consoles',
      icon: Database,
      status: 'In Development',
      color: 'bg-blue-50 border-blue-200 text-blue-800'
    },
    {
      title: 'Device Specifications',
      description: 'Technical specifications, release dates, and historical context',
      icon: Smartphone,
      status: 'Planned',
      color: 'bg-purple-50 border-purple-200 text-purple-800'
    },
    {
      title: 'Digital Preservation',
      description: 'Digital archival of console firmware and software',
      icon: Archive,
      status: 'Research Phase',
      color: 'bg-orange-50 border-orange-200 text-orange-800'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="academic-card-elevated p-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Smartphone className="w-10 h-10 text-white" />
        </div>
        
        <h2 className="text-3xl font-bold text-primary mb-4">Console & Device Collection</h2>
        <p className="text-secondary text-lg mb-6 max-w-2xl mx-auto">
          Physical gaming device preservation and documentation system for retro mobile gaming hardware from the foundational era of portable entertainment
        </p>
        
        <div className="inline-flex items-center space-x-2 px-6 py-3 bg-amber-100 text-amber-800 rounded-full border border-amber-200">
          <Clock className="w-5 h-5" />
          <span className="font-medium text-lg">Coming Soon</span>
        </div>
      </div>

      {/* Upcoming Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {upcomingFeatures.map((feature, index) => (
          <div
            key={index}
            className={`academic-card-elevated p-6 ${feature.color} hover:shadow-lg transition-all`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                <feature.icon className="w-6 h-6 text-gray-700" />
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                feature.status === 'In Development' 
                  ? 'bg-blue-100 text-blue-800 border-blue-300' 
                  : feature.status === 'Planned'
                  ? 'bg-purple-100 text-purple-800 border-purple-300'
                  : 'bg-orange-100 text-orange-800 border-orange-300'
              }`}>
                {feature.status}
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Research Goals */}
      <div className="academic-card-elevated p-8">
        <h3 className="text-xl font-bold text-primary mb-6 flex items-center">
          <MapPin className="w-6 h-6 mr-2 text-red-600" />
          Research & Preservation Goals
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold text-red-700 mb-4">Hardware Documentation</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg border border-red-100">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Device Cataloging</p>
                  <p className="text-gray-600 text-sm">Comprehensive inventory of physical gaming devices from 1975-2008</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg border border-red-100">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Technical Specifications</p>
                  <p className="text-gray-600 text-sm">Document hardware capabilities, limitations, and innovations</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg border border-red-100">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Historical Context</p>
                  <p className="text-gray-600 text-sm">Preserve original packaging, manuals, and documentation</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-blue-700 mb-4">Digital Preservation</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Firmware Archival</p>
                  <p className="text-gray-600 text-sm">Archive and preserve original system software and firmware</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Digital Twins</p>
                  <p className="text-gray-600 text-sm">Create accurate digital representations of physical devices</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Future Research</p>
                  <p className="text-gray-600 text-sm">Enable emulation and continued research accessibility</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="academic-card-elevated p-8">
        <h3 className="text-xl font-bold text-primary mb-6 flex items-center">
          <Calendar className="w-6 h-6 mr-2 text-red-600" />
          Development Timeline
        </h3>
        
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <div className="w-0.5 h-16 bg-blue-200 mt-2"></div>
            </div>
            <div className="flex-1 pb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-blue-800">Q2 2025 - Phase 1</h4>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Foundation</span>
                </div>
                <p className="text-blue-700 mb-2">Basic Console Catalog & Specifications Database</p>
                <p className="text-blue-600 text-sm">Establish core infrastructure and begin device documentation</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
              <div className="w-0.5 h-16 bg-purple-200 mt-2"></div>
            </div>
            <div className="flex-1 pb-8">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-purple-800">Q3 2025 - Phase 2</h4>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Expansion</span>
                </div>
                <p className="text-purple-700 mb-2">Visual Documentation & Archive System</p>
                <p className="text-purple-600 text-sm">Implement image archival and comprehensive visual documentation</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex-1">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-green-800">Q4 2025 - Phase 3</h4>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Integration</span>
                </div>
                <p className="text-green-700 mb-2">Advanced Research Tools & Public Access</p>
                <p className="text-green-600 text-sm">Launch research interface and integrate with main RMGD platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notable Devices Preview */}
      <div className="academic-card-elevated p-8">
        <h3 className="text-xl font-bold text-primary mb-6 flex items-center">
          <Archive className="w-6 h-6 mr-2 text-red-600" />
          Notable Devices in Scope
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Nintendo Game & Watch', era: '1980-1991', category: 'Handheld LCD', impact: 'Foundational' },
            { name: 'Tamagotchi', era: '1996-2008', category: 'Virtual Pet', impact: 'Cultural Phenomenon' },
            { name: 'Nokia Mobile Games', era: '1997-2008', category: 'Mobile Phone', impact: 'Mass Market' },
            { name: 'Game Boy Series', era: '1989-2008', category: 'Portable Console', impact: 'Industry Standard' }
          ].map((device, idx) => (
            <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all">
              <div className="text-center">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                  idx === 0 ? 'bg-red-100 text-red-600' :
                  idx === 1 ? 'bg-blue-100 text-blue-600' :
                  idx === 2 ? 'bg-green-100 text-green-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  <Wrench className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{device.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{device.era}</p>
                <div className="space-y-1">
                  <span className="inline-block px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">
                    {device.category}
                  </span>
                  <p className="text-xs text-gray-500">{device.impact}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-base mb-4">
            The Console Collection will document over 200 unique devices and their impact on mobile gaming evolution.
          </p>
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">
            <Database className="w-4 h-4" />
            <span className="text-sm font-medium">Full catalog available in Q2 2025</span>
          </div>
        </div>
      </div>
    </div>
  );
}