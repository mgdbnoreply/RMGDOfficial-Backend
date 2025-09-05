// RMGDOfficial-Backend/components/ProfileSettings.tsx

"use client";
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { KeyRound, Loader2 } from 'lucide-react';

export default function ProfileSettings() {
    const { user, updateUser } = useAuth();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }
        if (password.length < 8) {
            setMessage('Password must be at least 8 characters long.');
            return;
        }

        setIsLoading(true);
        setMessage('');
        
        const success = await updateUser(user.id, { password });
        
        if (success) {
            setMessage('Password updated successfully!');
            setPassword('');
            setConfirmPassword('');
        } else {
            setMessage('Failed to update password. Please try again.');
        }
        setIsLoading(false);
    };

    return (
        <div className="academic-card-elevated p-8">
            <h3 className="text-xl font-bold text-primary mb-6">My Profile</h3>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        disabled
                        value={user?.email || ''}
                        className="academic-input w-full bg-gray-100 cursor-not-allowed"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password (min. 8 characters)"
                        className="academic-input w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="academic-input w-full"
                    />
                </div>
                <div className="flex items-center justify-between pt-2">
                    <button
                        type="submit"
                        disabled={isLoading || !password}
                        className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-xl disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <KeyRound className="w-5 h-5" />}
                        <span>{isLoading ? 'Saving...' : 'Change Password'}</span>
                    </button>
                    {message && <p className="text-sm text-gray-600">{message}</p>}
                </div>
            </form>
        </div>
    );
}