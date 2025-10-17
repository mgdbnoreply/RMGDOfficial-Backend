"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Clock, Check, X, Edit2, Send, Loader2 } from 'lucide-react';
import ProfileSettings from './ProfileSettings'; // Import the new component
import { GameAPI } from '@/services/api';
import { NewGame, Game } from '@/types';
import AddGameModal from './AddGameModal';
import GameCard from './GameCard';
import GameDetailModal from './GameDetailModal';

interface UserDashboardProps {
    games: Game[];
    user: any;
    onAddGame: (newGame: Game) => void;
}

export default function UserDashboard({ games, user, onAddGame }: UserDashboardProps) {
    const [submissions, setSubmissions] = useState<Game[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showSubmitForm, setShowSubmitForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);

    useEffect(() => {
        if (user && games) {
            // Filter by email (unique identifier) instead of name
            const userSubmissions = games.filter(game => game.SubmittedBy?.S === user.email);
            setSubmissions(userSubmissions);
            setIsLoading(false);
        }
    }, [user, games]);

    const handleSubmitGame = async (newGame: NewGame) => {
        if (!newGame.GameTitle || !user) return;
        setIsSubmitting(true);
        try {
            const createdGame = await GameAPI.createGame({ 
                ...newGame, 
                Status: 'pending',
                SubmittedBy: user.email, // Use email as unique identifier
                SubmittedByName: user.name // Store name separately for display
            });
            if (createdGame) {
                onAddGame(createdGame);
                setShowSubmitForm(false);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusChip = (status?: 'pending' | 'approved' | 'rejected') => {
        const baseClasses = "flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium";
        switch (status) {
            case 'pending':
                return <div className={`${baseClasses} bg-yellow-100 text-yellow-800`}><Clock className="w-4 h-4" /><span>Pending Review</span></div>;
            case 'approved':
                return <div className={`${baseClasses} bg-green-100 text-green-800`}><Check className="w-4 h-4" /><span>Approved</span></div>;
            case 'rejected':
                return <div className={`${baseClasses} bg-red-100 text-red-800`}><X className="w-4 h-4" /><span>Rejected</span></div>;
            default:
                return <div className={`${baseClasses} bg-gray-100 text-gray-800`}><Clock className="w-4 h-4" /><span>Status Unknown</span></div>;
        }
    };

    return (
        <div className="space-y-8">
            {/* <ProfileSettings /> */}

            <div className="academic-card-elevated p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-primary">My Contributions</h2>
                        <p className="text-secondary text-lg">Submit games and see their approval status.</p>
                    </div>
                    <button onClick={() => setShowSubmitForm(true)} className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-medium shadow-lg">
                        <Plus className="w-5 h-5" />
                        <span>Submit a Game</span>
                    </button>
                </div>

                {showSubmitForm && (
                    <AddGameModal
                        onSubmit={handleSubmitGame}
                        onCancel={() => setShowSubmitForm(false)}
                        loading={isSubmitting}
                    />
                )}

                <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">My Submissions</h3>
                    {isLoading ? (
                        <p>Loading submissions...</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {submissions.map(submission => (
                                <div key={submission.GameID.S} className="relative">
                                    <GameCard
                                        game={submission}
                                        viewMode="grid"
                                        onEdit={() => {}}
                                        onView={setSelectedGame}
                                        onDelete={() => {}}
                                        hideActions={true}
                                    />
                                    <div className="absolute top-4 right-4">
                                        {getStatusChip(submission.Status?.S)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Game Detail Modal */}
            {selectedGame && (
                <GameDetailModal 
                    game={selectedGame} 
                    onClose={() => setSelectedGame(null)}
                />
            )}
        </div>
    );
}