

import React, { useMemo } from 'react';
import { Card } from '../components/Card';
import { ProgressRing } from '../components/ProgressRing';
import { DailyMetrics, OrbitId, UserData, HealthLog } from '../types';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { MagicBento } from '../components/MagicBento';

const TrendIndicator: React.FC<{ history: {value: number}[] }> = ({ history }) => {
    if (history.length < 2) return <span className="text-text-secondary">→</span>;
    const latest = history[history.length - 1].value;
    const previous = history[history.length - 2].value;
    if (latest > previous) return <span className="text-success font-bold">↑</span>;
    if (latest < previous) return <span className="text-danger font-bold">↓</span>;
    return <span className="text-text-secondary font-bold">→</span>;
};

const KpiCard: React.FC<{ title: string; value: string | number; unit: string; icon: string; color: string; data: { history: { value: number }[] }; onClick: () => void; }> = ({ title, value, unit, icon, color, data, onClick }) => (
    <button onClick={onClick} className="w-full text-left">
        <Card className="flex-1 min-w-[140px] group transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden">
            <div className={`absolute inset-x-0 top-0 h-24 ${color} opacity-20 -translate-y-1/2 blur-2xl group-hover:opacity-30 transition-opacity`}></div>
            <div className="flex justify-between items-start relative">
                <div>
                    <p className="text-text-secondary text-sm font-semibold">{title}</p>
                    <p className="text-2xl font-bold text-text-primary mt-1">
                        {value} <span className="text-base font-normal text-text-secondary">{unit}</span>
                    </p>
                </div>
                 <div className="flex items-center space-x-1">
                    <TrendIndicator history={data.history} />
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl`}>
                        {icon}
                    </div>
                </div>
            </div>
            <div className="h-16 mt-2 -ml-6 -mr-6 -mb-4">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.history} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id={`${title}Color`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                        <Area type="monotone" dataKey="value" stroke="var(--color-primary)" strokeWidth={2} fill={`url(#${title}Color)`} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    </button>
);

const RingDisplay: React.FC<{ progress: number; label: string; color: string; }> = ({ progress, label, color }) => (
    <div className="flex flex-col items-center space-y-2">
        <div className="relative">
            <ProgressRing radius={50} stroke={8} progress={progress} color={color} />
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-text-primary">{Math.round(progress)}%</span>
            </div>
        </div>
        <p className="font-semibold text-text-secondary">{label}</p>
    </div>
);

export const HomeOrbit: React.FC<{ setActiveOrbit: (orbit: OrbitId) => void; userData: UserData }> = ({ setActiveOrbit, userData }) => {
    
    const { progressMetrics, kpiMetrics } = useMemo(() => {
        const { tasks, learningItems, expenses, healthLogs, financeSettings } = userData;
        
        // Progress Rings Calculation
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.completed_at).length;
        const tasksProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        
        const totalMastery = learningItems.reduce((sum, item) => sum + item.mastery_score, 0);
        const studyMasteryProgress = learningItems.length > 0 ? totalMastery / learningItems.length : 0;
        
        const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const budgetProgress = financeSettings.weeklyBudget > 0 ? Math.min((totalSpent / financeSettings.weeklyBudget) * 100, 100) : 0;
        
        const today = new Date().toISOString().split('T')[0];
        const todayHealth = healthLogs[today];
        const healthProgress = todayHealth ? (todayHealth.energy_score / 100) * 100 : 0; // Assuming energy score is out of 100

        // KPI Cards Calculation
        const streak = 0; // simplified
        const budgetSpent = totalSpent;
        const energyAvg = todayHealth?.energy_score || 0;
        const focusHrs = tasks.filter(t => !t.completed_at).reduce((sum, t) => sum + t.duration, 0) / 60;

        return {
            progressMetrics: {
                tasks: tasksProgress,
                study: studyMasteryProgress,
                budget: budgetProgress,
                health: healthProgress
            },
            kpiMetrics: {
                streak: { value: streak, history: [{value: streak}] },
                budget: { value: budgetSpent, history: expenses.map(e => ({ value: e.amount })) },
                // Fix: Add explicit type to map callback parameter to resolve 'property does not exist on type unknown' error.
                energy: { value: energyAvg, history: Object.values(healthLogs).map((h: HealthLog) => ({ value: h.energy_score })) },
                focus: { value: focusHrs, history: [{value: focusHrs}]}
            }
        };

    }, [userData]);
    
    return (
        <div className="p-4 sm:p-6 space-y-6">
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard title="Streak" value={kpiMetrics.streak.value} unit="days" icon="🔥" color="bg-red-500" data={{history: kpiMetrics.streak.history}} onClick={() => setActiveOrbit(OrbitId.Tasks)} />
                <KpiCard title="Budget Spent" value={`₹${kpiMetrics.budget.value.toFixed(2)}`} unit="used" icon="💰" color="bg-green-500" data={{history: kpiMetrics.budget.history}} onClick={() => setActiveOrbit(OrbitId.Finance)} />
                <KpiCard title="Energy" value={kpiMetrics.energy.value} unit="avg" icon="⚡️" color="bg-yellow-500" data={{history: kpiMetrics.energy.history}} onClick={() => setActiveOrbit(OrbitId.Health)} />
                <KpiCard title="Focus" value={kpiMetrics.focus.value.toFixed(1)} unit="hrs" icon="🎯" color="bg-blue-500" data={{history: kpiMetrics.focus.history}} onClick={() => setActiveOrbit(OrbitId.Learn)} />
            </section>

            <section>
                <Card title="Today's Progress">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
                        <RingDisplay progress={progressMetrics.tasks} label="Tasks Done" color="var(--color-primary)" />
                        <RingDisplay progress={progressMetrics.study} label="Study Mastery" color="var(--color-success)" />
                        <RingDisplay progress={progressMetrics.budget} label="Weekly Budget" color="var(--color-secondary)" />
                        <RingDisplay progress={progressMetrics.health} label="Health Goals" color="var(--color-danger)" />
                    </div>
                </Card>
            </section>

            <section className="dark">
                <MagicBento setActiveOrbit={setActiveOrbit} />
            </section>
        </div>
    );
};