"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Check, X, User, Calendar, Loader2, Eye } from 'lucide-react';
import { GameAPI } from '@/services/api';
import { Game } from '@/types';
import GameDetailModal from './GameDetailModal';

export default function AdminApprovalQueue() {
    const [pendingGames, setPendingGames] = useState<Game[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);

    useEffect(() => {
        const fetchPendingGames = async () => {
            try {
                const allGames = await GameAPI.getAllGames();
                const pending = allGames.filter(game => game.Status?.S === 'pending');
                setPendingGames(pending);
            } catch (error) {
                console.error("Failed to fetch pending games:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPendingGames();
    }, []);

    const handleApprove = async (gameId: string) => {
        setActionLoading(prev => ({ ...prev, [gameId]: true }));
        const success = await GameAPI.updateGameStatus(gameId, 'approved');
        if (success) {
            setPendingGames(prev => prev.filter(game => game.GameID.S !== gameId));
            setSelectedGame(null);
        } else {
            alert('Failed to approve the game. Please try again.');
        }
        setActionLoading(prev => ({ ...prev, [gameId]: false }));
    };

    const handleReject = async (gameId: string) => {
        setActionLoading(prev => ({ ...prev, [gameId]: true }));
        const success = await GameAPI.updateGameStatus(gameId, 'rejected');
        if (success) {
            setPendingGames(prev => prev.filter(game => game.GameID.S !== gameId));
            setSelectedGame(null);
        } else {
            alert('Failed to reject the game. Please try again.');
        }
        setActionLoading(prev => ({ ...prev, [gameId]: false }));
    };

    return (
        <div className="academic-card-elevated p-8">
            <h2 className="text-2xl font-bold text-primary mb-6">Pending Game Approvals ({pendingGames.length})</h2>
            <div className="space-y-4">
                {isLoading ? <p>Loading...</p> : pendingGames.map(game => (
                    <div key={game.GameID.S} className="academic-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">{game.GameTitle.S}</h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                                    <span className="flex items-center"><User className="w-4 h-4 mr-1" />{game.Developer.S}</span>
                                    <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" />{game.YearDeveloped.S}</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button onClick={() => setSelectedGame(game)} className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    <Eye className="w-5 h-5" />
                                    <span>Review</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {pendingGames.length === 0 && !isLoading && <p className="text-gray-500 text-center py-8">The approval queue is empty. Great job!</p>}
            </div>

            {selectedGame && (
                <GameDetailModal
                    game={selectedGame}
                    onClose={() => setSelectedGame(null)}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    isApprovalQueue={true}
                />
            )}
        </div>
    );
}