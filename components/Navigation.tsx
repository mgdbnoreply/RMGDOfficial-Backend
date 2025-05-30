import { Gamepad2, BarChart3, Settings } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const tabs = [
    { id: 'games', label: 'Game Collection', icon: Gamepad2 },
    { id: 'analytics', label: 'Research Analytics', icon: BarChart3 },
    { id: 'admin', label: 'System Admin', icon: Settings }
  ];

  return (
    <div className="flex space-x-1 mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center space-x-3 px-8 py-4 rounded-t-xl font-medium transition-all duration-200 ${
            activeTab === tab.id
              ? 'bg-white/10 text-white border-b-2 border-cyan-400 shadow-lg'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <tab.icon className="w-5 h-5" />
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}