"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Clock, Check, X, Edit2, Send, Loader2 } from 'lucide-react';
import ProfileSettings from './ProfileSettings'; // Import the new component
import { GameAPI } from '@/services/api';
import { NewGame } from '@/types';

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
    const [newGame, setNewGame] = useState<NewGame>({ GameTitle: '', Developer: '', YearDeveloped: '', Genre: '', GameDescription: '', Status: 'pending' });
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
        try {
            const createdGame = await GameAPI.createGame(newGame);
            if (createdGame) {
                const newSubmission: GameSubmission = {
                    submissionId: createdGame.GameID.S,
                    GameTitle: createdGame.GameTitle.S,
                    status: 'pending',
                    submittedAt: new Date().toISOString()
                };
                setSubmissions(prev => [newSubmission, ...prev]);
                setShowSubmitForm(false);
                setNewGame({ GameTitle: '', Developer: '', YearDeveloped: '', Genre: '', GameDescription: '', Status: 'pending' });
            }
        } finally {
            setIsSubmitting(false);
        }
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

                {showSubmitForm && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Game Title"
                                value={newGame.GameTitle}
                                onChange={(e) => setNewGame({ ...newGame, GameTitle: e.target.value })}
                                className="academic-input w-full"
                            />
                            <input
                                type="text"
                                placeholder="Developer"
                                value={newGame.Developer}
                                onChange={(e) => setNewGame({ ...newGame, Developer: e.target.value })}
                                className="academic-input w-full"
                            />
                            <input
                                type="text"
                                placeholder="Year Developed"
                                value={newGame.YearDeveloped}
                                onChange={(e) => setNewGame({ ...newGame, YearDeveloped: e.target.value })}
                                className="academic-input w-full"
                            />
                            <input
                                type="text"
                                placeholder="Genre"
                                value={newGame.Genre}
                                onChange={(e) => setNewGame({ ...newGame, Genre: e.target.value })}
                                className="academic-input w-full"
                            />
                            <textarea
                                placeholder="Game Description"
                                value={newGame.GameDescription}
                                onChange={(e) => setNewGame({ ...newGame, GameDescription: e.target.value })}
                                className="academic-input w-full md:col-span-2"
                                rows={4}
                            />
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={handleSubmitGame}
                                disabled={isSubmitting}
                                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-medium shadow-lg"
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                <span>{isSubmitting ? 'Submitting...' : 'Submit for Review'}</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {/* The rest of the component JSX remains the same */}
        </div>
    );
}