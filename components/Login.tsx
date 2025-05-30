"use client";
import { useState } from 'react';
import { Gamepad2, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 login-bg">
      <div className="login-card w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Gamepad2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">RMGD Admin Portal</h1>
          <p className="text-red-700 text-lg font-medium">Retro Mobile Gaming Database</p>
          <p className="text-gray-600 text-base mt-1">Research & Preservation System</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-base font-medium mb-3">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="academic-input w-full pl-12 pr-4 text-base placeholder-gray-500"
                placeholder="admin@rmgd.org"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-base font-medium mb-3">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="academic-input w-full pl-12 pr-4 text-base placeholder-gray-500"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 text-base">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? 'Signing in...' : 'Sign In to RMGD'}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-amber-800 text-sm font-medium mb-2">Demo Credentials:</p>
          <p className="text-amber-700 text-sm">Email: admin@rmgd.org</p>
          <p className="text-amber-700 text-sm">Password: admin</p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Retro Mobile Gaming Database • 1975-2008
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Academic Research & Digital Preservation
          </p>
        </div>
      </div>
    </div>
  );
}