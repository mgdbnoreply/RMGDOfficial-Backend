"use client";
import { useState } from 'react';
import { X, Loader2, Mail } from 'lucide-react';
import { UserAPI } from '@/services/api';

interface ForgotPasswordModalProps {
  onClose: () => void;
}

export default function ForgotPasswordModal({ onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Please enter your registered email address.');
      return;
    }

    setLoading(true);
    try {
      const result = await UserAPI.forgotPassword(email.trim().toLowerCase());
      if (result) {
        setSuccess('If this account exists, a password reset link has been sent to your email.');
      } else {
        setError('Unable to send password reset request. Please try again later or contact support.');
      }
    } catch (err) {
      setError('Unable to send reset email right now. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Forgot Password</h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
              <X />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-50 text-gray-900"
                  placeholder="admin@rmgd.org"
                  required
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-xl flex items-center justify-center disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Mail className="mr-2" />}
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
