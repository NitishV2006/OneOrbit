import React, { useState, useMemo } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { User, UserData, TrioMember, CheckIn } from '../types';
import { MOCK_USERS } from '../data/mock';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';


const getPast7Days = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dates.push(d);
    }
    return dates;
};

const dayOfWeek = (date: Date) => {
    return date.toLocaleString('en-US', { weekday: 'short' });
}

interface ConnectOrbitProps {
    user: User;
    userData: UserData;
    setUserData: (data: UserData) => void;
}

export const ConnectOrbit: React.FC<ConnectOrbitProps> = ({ user, userData, setUserData }) => {
    const [newCheckIn, setNewCheckIn] = useState('');

    const trioMembers = userData.trioMembers;

    const handleCreateTrio = () => {
        const newTrio: TrioMember[] = [
            {
                id: 'trio-1',
                username: 'gnanendra',
                avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=256&h=256&fit=crop&crop=faces'
            },
            {
                id: 'trio-2',
                username: 'manohar',
                avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&fit=crop&crop=faces'
            }
        ];

        setUserData({ ...userData, trioMembers: newTrio });
    };
    
    const handlePostCheckIn = () => {
        if (!newCheckIn.trim()) return;

        const checkIn: CheckIn = {
            userId: user.id,
            username: user.username,
            avatarUrl: user.avatarUrl,
            message: newCheckIn,
            timestamp: new Date().toISOString()
        };
        
        const updatedCheckIns = [...userData.checkIns, checkIn];
        setUserData({ ...userData, checkIns: updatedCheckIns });
        setNewCheckIn('');

        // Simulate trio member responses
        trioMembers.forEach((member, index) => {
            setTimeout(() => {
                const responses = ["Great job!", "Keep it up!", "Awesome work!", "Let's crush this week!", "I finished my main task for today too."];
                const memberCheckIn: CheckIn = {
                    userId: member.id,
                    username: member.username,
                    avatarUrl: member.avatarUrl,
                    message: responses[Math.floor(Math.random() * responses.length)],
                    timestamp: new Date().toISOString()
                };
                 // Fetch the latest check-ins to avoid overwriting state
                 setUserData(currentData => ({
                    ...currentData,
                    checkIns: [...currentData.checkIns, memberCheckIn],
                }));
            }, (index + 1) * 2000); // Stagger responses
        });
    };

    const weeklyTaskData = useMemo(() => {
        const last7Days = getPast7Days();
        return last7Days.map(date => {
            const dateStr = date.toISOString().split('T')[0];
            
            // Real data for current user
            const userTasks = userData.tasks.filter(t => t.completed_at && t.completed_at.startsWith(dateStr)).length;
            
            // Simulated data for trio members
            const member1Tasks = Math.floor(Math.random() * 4); // Random tasks between 0-3
            const member2Tasks = Math.floor(Math.random() * 5); // Random tasks between 0-4

            const dataPoint: { name: string, [key: string]: string | number } = {
                name: dayOfWeek(date),
                [user.username]: userTasks,
            };

            if (trioMembers.length > 0) {
                 dataPoint[trioMembers[0].username] = member1Tasks;
            }
             if (trioMembers.length > 1) {
                 dataPoint[trioMembers[1].username] = member2Tasks;
            }

            return dataPoint;
        });
    }, [userData.tasks, trioMembers, user.username]);
    
    const sortedCheckIns = [...userData.checkIns].sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return (
        <div className="p-4 sm:p-6 space-y-6">
            {trioMembers.length === 0 ? (
                <Card>
                    <div className="text-center py-16">
                        <h2 className="text-2xl font-bold text-text-primary">Find Your Accountability Trio!</h2>
                        <p className="text-text-secondary mt-2 max-w-md mx-auto">
                           Connect with two other members to share progress, stay motivated, and achieve your goals together.
                        </p>
                        <Button onClick={handleCreateTrio} className="mt-6">Create My Trio</Button>
                    </div>
                </Card>
            ) : (
                <>
                    <Card title="Your Trio">
                        <div className="flex justify-around items-center py-4">
                            {[user, ...trioMembers].map(member => (
                                <div key={member.id} className="flex flex-col items-center text-center">
                                    <img src={member.avatarUrl} alt={member.username} className="w-20 h-20 rounded-full border-4 border-primary object-cover"/>
                                    <p className="font-bold text-text-primary mt-2">{member.username}</p>
                                    {member.id === user.id && <p className="text-xs text-text-secondary">(You)</p>}
                                </div>
                            ))}
                        </div>
                    </Card>
                    
                    <Card title="Weekly Tasks Completed">
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={weeklyTaskData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)"/>
                                    <XAxis dataKey="name" stroke="var(--text-secondary)"/>
                                    <YAxis stroke="var(--text-secondary)" allowDecimals={false} />
                                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-default)' }}/>
                                    <Legend />
                                    <Bar dataKey={user.username} fill="var(--color-primary)" />
                                    {trioMembers[0] && <Bar dataKey={trioMembers[0].username} fill="var(--color-success)" />}
                                    {trioMembers[1] && <Bar dataKey={trioMembers[1].username} fill="var(--color-secondary)" />}
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                    
                    <Card title="Daily Check-in">
                        <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                             {sortedCheckIns.length > 0 ? sortedCheckIns.map((checkIn, index) => (
                                <div key={index} className={`flex items-start gap-3 ${checkIn.userId === user.id ? 'flex-row-reverse' : ''}`}>
                                    <img src={checkIn.avatarUrl} alt={checkIn.username} className="w-8 h-8 rounded-full" />
                                    <div className={`p-3 rounded-lg max-w-xs ${checkIn.userId === user.id ? 'bg-primary text-white' : 'bg-bg-primary'}`}>
                                        <p className="text-sm">{checkIn.message}</p>
                                    </div>
                                </div>
                            )) : <p className="text-center text-text-secondary py-8">No check-ins yet today. Be the first to post!</p>}
                        </div>
                        <div className="mt-4 flex gap-2 pt-4 border-t border-border-default">
                             <input 
                                type="text"
                                value={newCheckIn}
                                onChange={(e) => setNewCheckIn(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handlePostCheckIn()}
                                placeholder="What did you accomplish today?"
                                className="w-full px-4 py-2 bg-bg-primary border border-border-default rounded-lg focus:ring-primary focus:border-primary"
                             />
                             <Button onClick={handlePostCheckIn}>Post</Button>
                        </div>
                    </Card>
                </>
            )}
        </div>
    );
};