"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
// import { SubmissionsAPI } from '@/services/api'; // Commented out for now
import { Plus, Clock, Check, X, Edit2, Send, Loader2 } from 'lucide-react';
import ProfileSettings from './ProfileSettings'; // Add this import at the top

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
        // MOCK DATA for the user's submissions
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
        console.log("Submitting game:", newGame);

        // Mocking API call with a timeout
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
            default:
                return null;
        }
    };

    
    return (
        <div className="space-y-8">
             <ProfileSettings /> {/* Add this new component */}
             
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

            {showSubmitForm && (
                 <div className="academic-card-elevated p-8">
                    <h3 className="text-xl font-bold text-primary mb-4">New Game Submission Form</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input value={newGame.GameTitle} onChange={(e) => setNewGame({...newGame, GameTitle: e.target.value})} placeholder="Game Title*" className="academic-input" />
                        <input value={newGame.Developer} onChange={(e) => setNewGame({...newGame, Developer: e.target.value})} placeholder="Developer*" className="academic-input" />
                        <input value={newGame.YearDeveloped} onChange={(e) => setNewGame({...newGame, YearDeveloped: e.target.value})} placeholder="Year" className="academic-input" />
                        <input value={newGame.Genre} onChange={(e) => setNewGame({...newGame, Genre: e.target.value})} placeholder="Genre" className="academic-input" />
                        <textarea value={newGame.GameDescription} onChange={(e) => setNewGame({...newGame, GameDescription: e.target.value})} placeholder="Description" className="academic-input md:col-span-2" rows={4}></textarea>
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                        <button onClick={() => setShowSubmitForm(false)} className="px-6 py-3 text-gray-700">Cancel</button>
                        <button onClick={handleSubmitGame} disabled={isSubmitting || !newGame.GameTitle} className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-xl disabled:opacity-50">
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            <span>{isSubmitting ? 'Submitting...' : 'Submit for Review'}</span>
                        </button>
                    </div>
                </div>
            )}

            <div className="academic-card-elevated p-8">
                <h3 className="text-xl font-bold text-primary mb-6">My Submissions ({submissions.length})</h3>
                <div className="space-y-4">
                    {isLoading ? <p>Loading submissions...</p> : submissions.map(sub => (
                        <div key={sub.submissionId} className="academic-card p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                            <div>
                                <h4 className="font-semibold text-lg text-gray-800">{sub.GameTitle}</h4>
                                <p className="text-sm text-gray-500">Submitted on: {new Date(sub.submittedAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                {getStatusChip(sub.status)}
                                {sub.status !== 'approved' && (
                                    <button className="p-2 text-gray-500 hover:text-blue-600"><Edit2 className="w-5 h-5" /></button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

