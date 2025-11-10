

import React, { useState } from 'react';
import { LearningItem, UserData, NewLearningItem, StudySession } from '../types';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { StudySessionModal } from '../components/StudySessionModal';

const difficultyStyles = {
    Hard: 'bg-danger/20 text-danger',
    Medium: 'bg-secondary/20 text-amber-600',
    Easy: 'bg-success/20 text-green-600',
};

const LearningItemCard: React.FC<{ item: LearningItem; onStudy: (item: LearningItem) => void; }> = ({ item, onStudy }) => (
    <Card>
        <div className="flex justify-between items-start">
            <div>
                <h4 className="text-lg font-bold text-text-primary">{item.title}</h4>
                <p className={`text-sm font-semibold px-2 py-0.5 rounded-full inline-block mt-1 ${difficultyStyles[item.difficulty]}`}>{item.difficulty}</p>
            </div>
            <div className="text-right flex flex-col items-end">
                <p className="text-2xl font-bold text-primary">{item.mastery_score}%</p>
                <p className="text-xs text-text-secondary">Mastery</p>
            </div>
        </div>
        <div className="mt-4">
            <div className="w-full bg-bg-primary rounded-full h-4 relative">
                <div className="bg-primary h-4 rounded-full" style={{ width: `${item.mastery_score}%`, transition: 'width 0.5s ease-in-out' }}></div>
            </div>
        </div>
        <div className="mt-4 flex justify-between items-center text-text-secondary text-sm">
            <span title="Consecutive study days">🔥 {item.streak} days</span>
            <span title="Total time invested">⏰ {(item.time_invested_minutes / 60).toFixed(1)} hrs</span>
        </div>
         <div className="mt-4 flex space-x-2">
            <Button variant="primary" className="text-sm py-1 px-3 w-full" onClick={() => onStudy(item)}>Study Now</Button>
        </div>
    </Card>
);


const AddTopicForm: React.FC<{ onAdd: (item: NewLearningItem) => void; onCancel: () => void; }> = ({ onAdd, onCancel }) => {
    const [title, setTitle] = useState('');
    const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        onAdd({ title, difficulty });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-1">Topic Title</label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-bg-primary border border-border-default rounded-lg focus:ring-primary focus:border-primary"
                    placeholder="e.g., Quantum Mechanics"
                    required
                />
            </div>
            <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-text-secondary mb-1">Difficulty</label>
                <select
                    id="difficulty"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 bg-bg-primary border border-border-default rounded-lg focus:ring-primary focus:border-primary"
                >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel} className="bg-gray-200 text-gray-800 hover:bg-gray-300">Cancel</Button>
                <Button type="submit">Add Topic</Button>
            </div>
        </form>
    );
};

export const LearnOrbit: React.FC<{ userData: UserData, setUserData: (data: UserData) => void }> = ({ userData, setUserData }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [studyingItem, setStudyingItem] = useState<LearningItem | null>(null);

    const handleAddTopic = (item: NewLearningItem) => {
        const newLearningItem: LearningItem = {
            ...item,
            id: Date.now().toString(),
            mastery_score: 0,
            streak: 0,
            time_invested_minutes: 0,
        };
        setUserData({
            ...userData,
            learningItems: [...userData.learningItems, newLearningItem]
        });
        setIsAdding(false);
    };

    const handleSessionEnd = (itemId: string, durationMinutes: number, quality: 1 | 2 | 3 | 4 | 5) => {
        const itemIndex = userData.learningItems.findIndex(i => i.id === itemId);
        if (itemIndex === -1) return;

        const item = userData.learningItems[itemIndex];

        const updatedItem: LearningItem = {
            ...item,
            time_invested_minutes: item.time_invested_minutes + durationMinutes,
            mastery_score: Math.min(100, Math.round(item.mastery_score + (quality * durationMinutes) / 5)), // Adjusted heuristic
            streak: item.streak + 1, // Simplified streak logic
        };

        const updatedLearningItems = [...userData.learningItems];
        updatedLearningItems[itemIndex] = updatedItem;
        
        const newStudySession: StudySession = {
            id: Date.now().toString(),
            learning_item_id: itemId,
            start_time: new Date(Date.now() - durationMinutes * 60000).toISOString(),
            end_time: new Date().toISOString(),
            duration: durationMinutes,
            quality_rating: quality,
        };
        
        const studySessions = userData.studySessions ? [newStudySession, ...userData.studySessions] : [newStudySession];

        setUserData({
            ...userData,
            learningItems: updatedLearningItems,
            studySessions,
        });

        setStudyingItem(null);
    };

    return (
        <div className="p-4 sm:p-6 space-y-6">
            {isAdding && (
                <Modal title="Add New Learning Topic" onClose={() => setIsAdding(false)}>
                    <AddTopicForm onAdd={handleAddTopic} onCancel={() => setIsAdding(false)} />
                </Modal>
            )}

            {studyingItem && (
                <StudySessionModal
                    item={studyingItem}
                    onClose={() => setStudyingItem(null)}
                    onSessionEnd={handleSessionEnd}
                />
            )}

            <div className="flex justify-end items-center mb-6">
                <Button onClick={() => setIsAdding(true)}>Add New Topic</Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userData.learningItems.length > 0 ? (
                    userData.learningItems.map(item => <LearningItemCard key={item.id} item={item} onStudy={setStudyingItem} />)
                ) : (
                    <p className="text-center text-text-secondary md:col-span-2 lg:col-span-3 py-8">No learning topics yet. Add one to get started!</p>
                )}
            </div>
            
            <Card title="Recent Study Sessions">
              {userData.studySessions && userData.studySessions.length > 0 ? (
                     <ul className="space-y-2 max-h-64 overflow-y-auto">
                        {userData.studySessions.slice(0, 10).map(session => {
                            const item = userData.learningItems.find(li => li.id === session.learning_item_id);
                            return (
                                <li key={session.id} className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-bg-primary">
                                    <div>
                                        <p className="font-semibold text-text-primary">{item?.title || 'Unknown Topic'}</p>
                                        <p className="text-text-secondary text-xs">{new Date(session.end_time).toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className="font-semibold">{session.duration} min</span>
                                        <span className="text-secondary">{'★'.repeat(session.quality_rating)}{'☆'.repeat(5 - session.quality_rating)}</span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p className="text-center text-text-secondary py-8">No recent study sessions logged.</p>
                )}
            </Card>
        </div>
    );
};