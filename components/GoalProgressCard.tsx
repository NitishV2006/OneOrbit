import React, { useMemo } from 'react';
import { Card } from './Card';
import { Reflection, Task } from '../types';

interface GoalProgressCardProps {
    reflection?: Reflection;
    tasks: Task[];
}

const GoalProgressBar: React.FC<{ goalText: string; progress: number }> = ({ goalText, progress }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium text-text-primary">{goalText}</p>
                <span className="text-sm font-bold text-primary">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-bg-primary rounded-full h-2.5">
                <div 
                    className="bg-primary h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
};

export const GoalProgressCard: React.FC<GoalProgressCardProps> = ({ reflection, tasks }) => {

    const goalProgress = useMemo(() => {
        if (!reflection || !reflection.goals) {
            return [];
        }

        return reflection.goals.map(goal => {
            const relatedTasks = tasks.filter(task => task.goalId === goal.id);
            if (relatedTasks.length === 0) {
                return { text: goal.text, progress: 0 };
            }
            const completedTasks = relatedTasks.filter(task => task.completed_at);
            const progress = (completedTasks.length / relatedTasks.length) * 100;
            return { text: goal.text, progress };
        });

    }, [reflection, tasks]);

    return (
        <Card title="This Week's Goals (from Reflection)">
            {reflection && reflection.goals.length > 0 ? (
                <div className="space-y-4">
                    {goalProgress.map((goal, index) => (
                        <GoalProgressBar key={index} goalText={goal.text} progress={goal.progress} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-4">
                    <p className="text-text-secondary">
                        You haven't set any goals from your reflection yet.
                    </p>
                    <p className="text-text-secondary text-sm mt-1">
                        Visit the 'Reflect' orbit to get started!
                    </p>
                </div>
            )}
        </Card>
    );
};