"use client";
import { useState, useEffect } from 'react';
// import { SubmissionsAPI } from '@/services/api'; // Commented out for now
import { useAuth } from '@/contexts/AuthContext';
import { Check, X, User, Calendar, Loader2 } from 'lucide-react';

interface GameSubmission {
    submissionId: string;
    GameTitle: string;
    Developer: string;
    submittedAt: string;
    submittedBy: string;
}

export default function AdminApprovalQueue() {
    const { user } = useAuth();
    const [pending, setPending] = useState<GameSubmission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

    useEffect(() => {
        // MOCK DATA for pending submissions
        const mockPending: GameSubmission[] = [
            { submissionId: 'sub2', GameTitle: 'Space Impact', Developer: 'Nokia', submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(), submittedBy: 'user-001' },
            { submissionId: 'sub4', GameTitle: 'Tetris (Mobile)', Developer: 'EA Mobile', submittedAt: new Date(Date.now() - 86400000 * 1).toISOString(), submittedBy: 'user-002' },
            { submissionId: 'sub5', GameTitle: 'Bounce', Developer: 'Nokia', submittedAt: new Date().toISOString(), submittedBy: 'user-001' },
        ];
        setPending(mockPending);
        setIsLoading(false);
    }, []);

    const handleApprove = async (submissionId: string) => {
        if (!user) return;
        setActionLoading(prev => ({ ...prev, [submissionId]: true }));
        console.log(`Approving ${submissionId} by ${user.id}`);
        // Mocking the API call
        setTimeout(() => {
            setPending(prev => prev.filter(s => s.submissionId !== submissionId));
            setActionLoading(prev => ({ ...prev, [submissionId]: false }));
        }, 1000);
    };
    
    const handleReject = (submissionId: string) => {
        setActionLoading(prev => ({ ...prev, [submissionId]: true }));
        console.log(`Rejecting ${submissionId}`);
        // Mocking the API call
        setTimeout(() => {
            setPending(prev => prev.filter(s => s.submissionId !== submissionId));
            setActionLoading(prev => ({ ...prev, [submissionId]: false }));
        }, 1000);
    };

    return (
        <div className="academic-card-elevated p-8">
            <h2 className="text-2xl font-bold text-primary mb-6">Pending Submissions ({pending.length})</h2>
            <div className="space-y-4">
                {isLoading ? <p>Loading...</p> : pending.map(sub => (
                    <div key={sub.submissionId} className="academic-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">{sub.GameTitle}</h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                                    <span className="flex items-center"><User className="w-4 h-4 mr-1" />{sub.Developer}</span>
                                    <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" />{new Date(sub.submittedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button onClick={() => handleReject(sub.submissionId)} disabled={actionLoading[sub.submissionId]} className="p-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50">
                                    {actionLoading[sub.submissionId] ? <Loader2 className="w-5 h-5 animate-spin" /> : <X className="w-5 h-5" />}
                                </button>
                                <button onClick={() => handleApprove(sub.submissionId)} disabled={actionLoading[sub.submissionId]} className="flex items-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50">
                                    {actionLoading[sub.submissionId] ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                                    <span>{actionLoading[sub.submissionId] ? 'Working...' : 'Approve'}</span>
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

