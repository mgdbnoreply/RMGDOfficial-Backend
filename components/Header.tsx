import { Gamepad2 } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white/5 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-400 rounded-xl flex items-center justify-center shadow-lg">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">RMGD Dashboard</h1>
              <p className="text-blue-300 text-sm font-medium">Retro Mobile Gaming Database • 1975-2008</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-white text-lg font-semibold">Admin Portal</p>
              <p className="text-cyan-300 text-sm">Research & Preservation</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}