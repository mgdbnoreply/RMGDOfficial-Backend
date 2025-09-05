"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Clock, Check, X, Edit2, Send, Loader2 } from 'lucide-react';
import ProfileSettings from './ProfileSettings'; // Import the new component

interface GameSubmission {
    submissionId: string;
    GameTitle: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: string;
}

export default function UserDashboard() {
    const { user } = useAuth();
    const [submissions, setSubmissions] = useState<GameSubmission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showSubmitForm, setShowSubmitForm] = useState(false);
    const [newGame, setNewGame] = useState({ GameTitle: '', Developer: '', YearDeveloped: '', Genre: '', GameDescription: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const mockSubmissions: GameSubmission[] = [
            { submissionId: 'sub1', GameTitle: 'Snake II', status: 'approved', submittedAt: new Date(Date.now() - 86400000 * 5).toISOString() },
            { submissionId: 'sub2', GameTitle: 'Space Impact', status: 'pending', submittedAt: new Date(Date.now() - 86400000 * 2).toISOString() },
            { submissionId: 'sub3', GameTitle: 'Bantumi', status: 'rejected', submittedAt: new Date(Date.now() - 86400000 * 10).toISOString() },
        ];
        setSubmissions(mockSubmissions);
        setIsLoading(false);
    }, [user]);

    const handleSubmitGame = async () => {
        if (!newGame.GameTitle || !user) return;
        setIsSubmitting(true);
        setTimeout(() => {
            const newSubmission: GameSubmission = {
                submissionId: `sub${Date.now()}`,
                GameTitle: newGame.GameTitle,
                status: 'pending',
                submittedAt: new Date().toISOString()
            };
            setSubmissions(prev => [newSubmission, ...prev]);
            setShowSubmitForm(false);
            setNewGame({ GameTitle: '', Developer: '', YearDeveloped: '', Genre: '', GameDescription: '' });
            setIsSubmitting(false);
        }, 1000);
    };

    const getStatusChip = (status: 'pending' | 'approved' | 'rejected') => {
        const baseClasses = "flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium";
        switch (status) {
            case 'pending':
                return <div className={`${baseClasses} bg-yellow-100 text-yellow-800`}><Clock className="w-4 h-4" /><span>Pending Review</span></div>;
            case 'approved':
                return <div className={`${baseClasses} bg-green-100 text-green-800`}><Check className="w-4 h-4" /><span>Approved</span></div>;
            case 'rejected':
                return <div className={`${baseClasses} bg-red-100 text-red-800`}><X className="w-4 h-4" /><span>Rejected</span></div>;
        }
    };

    return (
        <div className="space-y-8">
            {/* ADDED PROFILE SETTINGS FOR THE USER */}
            <ProfileSettings />

            <div className="academic-card-elevated p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-primary">My Contributions</h2>
                        <p className="text-secondary text-lg">Submit games and see their approval status.</p>
                    </div>
                    <button onClick={() => setShowSubmitForm(!showSubmitForm)} className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-medium shadow-lg">
                        <Plus className="w-5 h-5" />
                        <span>{showSubmitForm ? 'Cancel Submission' : 'Submit a Game'}</span>
                    </button>
                </div>
            </div>

            {/* The rest of the component JSX remains the same */}
        </div>
    );
}
