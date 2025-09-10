"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Check, X, User, Calendar, Loader2 } from 'lucide-react';

// Updated interface for User
interface User {
  id: string;
  email: string;
  role: string;
  name: string;
  createdAt: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export default function AdminApprovalQueue() {
    const { user, users, updateUser } = useAuth(); // Getting users and updateUser from context
    const [pending, setPending] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

    useEffect(() => {
        // Filter for pending users from the users list
        const pendingUsers = users.filter(u => u.status === 'pending');
        setPending(pendingUsers);
        setIsLoading(false);
    }, [users]);

    const handleApprove = async (userId: string) => {
        if (!user) return;
        setActionLoading(prev => ({ ...prev, [userId]: true }));
        
        await updateUser(userId, { Status: 'approved' });

        setActionLoading(prev => ({ ...prev, [userId]: false }));
    };
    
    const handleReject = async (userId: string) => {
        setActionLoading(prev => ({ ...prev, [userId]: true }));

        await updateUser(userId, { Status: 'rejected' });

        setActionLoading(prev => ({ ...prev, [userId]: false }));
    };

    return (
        <div className="academic-card-elevated p-8">
            <h2 className="text-2xl font-bold text-primary mb-6">Pending User Approvals ({pending.length})</h2>
            <div className="space-y-4">
                {isLoading ? <p>Loading...</p> : pending.map(sub => (
                    <div key={sub.id} className="academic-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">{sub.name}</h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                                    <span className="flex items-center"><User className="w-4 h-4 mr-1" />{sub.email}</span>
                                    <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" />{new Date(sub.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button onClick={() => handleReject(sub.id)} disabled={actionLoading[sub.id]} className="p-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50">
                                    {actionLoading[sub.id] ? <Loader2 className="w-5 h-5 animate-spin" /> : <X className="w-5 h-5" />}
                                </button>
                                <button onClick={() => handleApprove(sub.id)} disabled={actionLoading[sub.id]} className="flex items-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50">
                                    {actionLoading[sub.id] ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                                    <span>{actionLoading[sub.id] ? 'Working...' : 'Approve'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {pending.length === 0 && !isLoading && <p className="text-gray-500 text-center py-8">The approval queue is empty. Great job!</p>}
            </div>
        </div>
    );
}