"use client";
import { useState } from 'react';
import { X, Loader2, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface CreateAccountModalProps {
  onClose: () => void;
}

export default function CreateAccountModal({ onClose }: CreateAccountModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { addUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      const success = await addUser({ Name: name, Email: email, Role: 'user' });
      if (success) {
        setSuccess('Account created successfully! An administrator will review your request.');
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError('Failed to create account. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
              <X />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="academic-input w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="academic-input w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="password-create" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password-create"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="academic-input w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="academic-input w-full"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-xl flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin" /> : <UserPlus className="mr-2" />}
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}