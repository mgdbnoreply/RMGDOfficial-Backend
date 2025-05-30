import { Gamepad2, Users, BarChart3, Plus } from 'lucide-react';
import { DashboardStats } from '@/types';

interface StatsCardsProps {
  stats: DashboardStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Games',
      value: stats.totalGames,
      icon: Gamepad2,
      color: 'cyan',
      bgColor: 'bg-white/10',
      borderColor: 'border-cyan-500/30',
      textColor: 'text-cyan-300',
      iconColor: 'text-cyan-400'
    },
    {
      title: 'Developers',
      value: stats.developers,
      icon: Users,
      color: 'purple',
      bgColor: 'bg-white/10',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-300',
      iconColor: 'text-purple-400'
    },
    {
      title: 'Genres',
      value: stats.genres,
      icon: BarChart3,
      color: 'green',
      bgColor: 'bg-white/10',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-300',
      iconColor: 'text-green-400'
    },
    {
      title: 'Recent Games',
      value: stats.recentGames,
      icon: Plus,
      color: 'yellow',
      bgColor: 'bg-white/10',
      borderColor: 'border-yellow-500/30',
      textColor: 'text-yellow-300',
      iconColor: 'text-yellow-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`${card.bgColor} backdrop-blur-md rounded-xl p-6 border ${card.borderColor}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`${card.textColor} text-sm font-medium`}>{card.title}</p>
              <p className="text-3xl font-bold text-white">{card.value}</p>
            </div>
            <card.icon className={`w-8 h-8 ${card.iconColor}`} />
          </div>
        </div>
      ))}
    </div>
  );
}