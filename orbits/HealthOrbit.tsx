
import React, { useState, useMemo, ChangeEvent, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ProgressRing } from '../components/ProgressRing';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { UserData, HealthLog } from '../types';


const getPast7Days = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
};

const dayOfWeek = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
}


export const HealthOrbit: React.FC<{ userData: UserData; setUserData: (data: UserData) => void; }> = ({ userData, setUserData }) => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    const [log, setLog] = useState<Omit<HealthLog, 'id'|'logged_date'|'energy_score'>>({
        sleep_hours: userData.healthLogs[todayStr]?.sleep_hours || 8,
        water_cups: userData.healthLogs[todayStr]?.water_cups || 6,
        stress_rating: userData.healthLogs[todayStr]?.stress_rating || 2, // 1-5
        focus_hours: userData.healthLogs[todayStr]?.focus_hours || 4,
    });
    
    const healthHistory = useMemo(() => {
        const last7Days = getPast7Days();
        return last7Days.map(date => {
            const logForDay = userData.healthLogs[date];
            return {
                day: dayOfWeek(date),
                sleep: logForDay?.sleep_hours || 0,
                focus: logForDay?.focus_hours || 0,
            };
        });
    }, [userData.healthLogs]);


    const energyScore = useMemo(() => {
        const score = (log.focus_hours * 10) + (log.sleep_hours * 5) + (log.water_cups * 2) - log.stress_rating;
        return Math.max(0, Math.min(100, Math.round(score)));
    }, [log]);
    
    useEffect(() => {
        // When component mounts, sync state with today's log if it exists
        const todayLog = userData.healthLogs[todayStr];
        if (todayLog) {
            setLog({
                sleep_hours: todayLog.sleep_hours,
                water_cups: todayLog.water_cups,
                stress_rating: todayLog.stress_rating,
                focus_hours: todayLog.focus_hours,
            });
        }
    }, [todayStr, userData.healthLogs]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLog(prev => ({ ...prev, [name]: Number(value) }));
    };
    
    const handleSaveLog = () => {
        const newLog: HealthLog = {
            ...log,
            id: todayStr,
            logged_date: todayStr,
            energy_score: energyScore
        };
        setUserData({
            ...userData,
            healthLogs: {
                ...userData.healthLogs,
                [todayStr]: newLog,
            }
        });
        alert("Health log saved for today!");
    };

    let energyColor = 'var(--color-danger)';
    let energyEmoji = '😴';
    if (energyScore > 80) { energyColor = 'var(--color-primary)'; energyEmoji = '⚡'; }
    else if (energyScore > 60) { energyColor = 'var(--color-success)'; energyEmoji = '🔋'; }
    else if (energyScore > 30) { energyColor = 'var(--color-secondary)'; energyEmoji = '🙂'; }

    return (
        <div className="p-4 sm:p-6 space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
                <Card title="Today's Energy Score" className="lg:col-span-1 flex flex-col items-center justify-center text-center">
                    <div className="relative my-4">
                        <ProgressRing radius={80} stroke={12} progress={energyScore} color={energyColor} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-7xl">{energyEmoji}</span>
                            <span className="text-4xl font-bold text-text-primary mt-2">{energyScore}</span>
                        </div>
                    </div>
                    <p className="text-text-secondary text-sm">Based on your logs:</p>
                    <p className="text-text-primary font-mono text-xs">(focus*10) + (sleep*5) + (water*2) - stress</p>
                    <p className="mt-4 bg-primary/10 text-primary font-semibold px-4 py-2 rounded-lg text-sm">Your lowest metric is water. Drink more!</p>
                </Card>

                <Card title="Log Today's Metrics" className="lg:col-span-2">
                    <form className="space-y-6">
                        {/* Input sliders... */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary">Sleep (hours)</label>
                                <div className="flex items-center space-x-4"><input type="range" name="sleep_hours" min="0" max="12" step="0.5" value={log.sleep_hours} onChange={handleInputChange} className="w-full h-2 bg-bg-primary rounded-lg appearance-none cursor-pointer accent-primary" /><span className="font-bold text-primary w-12 text-center">{log.sleep_hours.toFixed(1)}</span></div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary">Water (cups)</label>
                                <div className="flex items-center space-x-4"><input type="range" name="water_cups" min="0" max="16" step="1" value={log.water_cups} onChange={handleInputChange} className="w-full h-2 bg-bg-primary rounded-lg appearance-none cursor-pointer accent-primary" /><span className="font-bold text-primary w-12 text-center">{log.water_cups}</span></div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary">Stress Level (1-5)</label>
                                <div className="flex items-center space-x-4"><input type="range" name="stress_rating" min="1" max="5" step="1" value={log.stress_rating} onChange={handleInputChange} className="w-full h-2 bg-bg-primary rounded-lg appearance-none cursor-pointer accent-primary" /><span className="font-bold text-primary w-12 text-center">{log.stress_rating}</span></div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary">Focus (hours)</label>
                                <div className="flex items-center space-x-4"><input type="range" name="focus_hours" min="0" max="10" step="0.5" value={log.focus_hours} onChange={handleInputChange} className="w-full h-2 bg-bg-primary rounded-lg appearance-none cursor-pointer accent-primary" /><span className="font-bold text-primary w-12 text-center">{log.focus_hours.toFixed(1)}</span></div>
                            </div>
                        </div>
                        <Button type="button" className="w-full" onClick={handleSaveLog}>Save Log</Button>
                    </form>
                </Card>
            </div>
            
             <Card title="7-Day Sleep vs. Focus Correlation">
                <p className="text-sm text-text-secondary mb-4">Insight: You focus 40% longer after 8+ hours of sleep.</p>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <ComposedChart data={healthHistory}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)"/>
                            <XAxis dataKey="day" stroke="var(--text-secondary)" />
                            <YAxis yAxisId="left" label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: 'var(--text-secondary)' }} stroke="var(--text-secondary)" />
                            <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-default)' }} />
                            <Legend />
                            <Bar yAxisId="left" dataKey="focus" barSize={20} fill="var(--color-primary)" name="Focus Hours" />
                            <Line yAxisId="left" type="monotone" dataKey="sleep" stroke="var(--color-secondary)" strokeWidth={2} name="Sleep Hours" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
};
