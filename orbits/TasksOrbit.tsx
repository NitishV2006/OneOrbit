

import React, { useState, ChangeEvent, useMemo } from 'react';
import { Task, NewTask, UserData } from '../types';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { analyzeTask } from '../services/geminiService';
import { GoalProgressCard } from '../components/GoalProgressCard';

const priorityStyles = {
    High: 'bg-danger/20 text-danger border-danger/50',
    Medium: 'bg-secondary/20 text-amber-600 border-secondary/50',
    Low: 'bg-success/20 text-green-600 border-success/50',
};

const TaskItem: React.FC<{ task: Task; onComplete: (id: string) => void }> = ({ task, onComplete }) => {
    const isGoalTask = !!task.goalId;

    return (
        <div className={`flex items-center p-3 rounded-lg transition-all duration-300 ${task.completed_at ? 'bg-bg-primary' : 'bg-bg-secondary'}`}>
            <button
                onClick={() => !task.completed_at && onComplete(task.id)}
                className={`w-6 h-6 rounded-full border-2 transition-all duration-300 flex-shrink-0 ${task.completed_at ? 'bg-success border-success' : 'border-border-default hover:border-primary'}`}
            >
                {task.completed_at && <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
            </button>
            <div className="ml-4 flex-grow">
                <p className={`font-semibold ${task.completed_at ? 'line-through text-text-secondary' : 'text-text-primary'}`}>
                    {isGoalTask && <span className="mr-2" title="Goal-related task">🎯</span>}
                    {task.title}
                </p>
                <div className="flex items-center space-x-2 text-xs text-text-secondary mt-1">
                    <span>{task.category}</span>
                    <span className="font-bold">&middot;</span>
                    <span>{task.duration} min</span>
                </div>
            </div>
            <div className={`text-xs font-bold px-2 py-1 border rounded-full ${priorityStyles[task.priority]}`}>{task.priority}</div>
        </div>
    );
}

const SpinnerIcon: React.FC = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

interface TasksOrbitProps {
    userData: UserData;
    streak: number;
    onCompleteTask: (id: string) => void;
    onAddTask: (task: NewTask) => void;
}

export const TasksOrbit: React.FC<TasksOrbitProps> = ({ userData, streak, onCompleteTask, onAddTask }) => {
    const [newTask, setNewTask] = useState({
        title: '',
        duration: 30,
        category: 'Personal' as Task['category'],
        priority: 'Medium' as Task['priority'],
    });
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const latestReflection = useMemo(() => {
        if (!userData.reflections || userData.reflections.length === 0) {
            return undefined;
        }
        // Assuming reflections are sorted by date, newest first
        return userData.reflections[0];
    }, [userData.reflections]);
    
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewTask(prev => ({
            ...prev,
            [name]: name === 'duration' ? parseInt(value, 10) || 0 : value,
        }));
    };

    const handleAnalyzeTask = async () => {
        if (!newTask.title.trim()) return;
        setIsAnalyzing(true);
        try {
            const result = await analyzeTask(newTask.title);
            if (result) {
                setNewTask(prev => ({ ...prev, ...result }));
            }
        } catch (error) {
            console.error("Task analysis failed:", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if(!newTask.title.trim()) return;

        onAddTask({ ...newTask, due_date: new Date().toISOString() });

        setNewTask({
            title: '',
            duration: 30,
            category: 'Personal',
            priority: 'Medium',
        });
    };

    const incompleteTasks = userData.tasks.filter(t => !t.completed_at);
    const completedTasks = userData.tasks.filter(t => t.completed_at);

    return (
        <div className="p-4 sm:p-6 space-y-6 relative">
            <div className="flex justify-end items-center mb-6">
                <div className="text-right">
                    <p className="text-4xl font-bold">🔥</p>
                    <p className="font-bold text-text-primary">{streak} Day Streak</p>
                </div>
            </div>

            <GoalProgressCard reflection={latestReflection} tasks={userData.tasks} />
            
            <Card>
                <form onSubmit={handleAddTask} className="space-y-4">
                    <div className="relative">
                        <label htmlFor="title" className="sr-only">Task Title</label>
                        <input
                            id="title"
                            type="text"
                            name="title"
                            value={newTask.title}
                            onChange={handleInputChange}
                            placeholder="e.g., Prepare for history exam tomorrow"
                            className="w-full px-4 py-2 bg-bg-primary border border-border-default rounded-lg focus:ring-primary focus:border-primary pr-12"
                        />
                         <button
                            type="button"
                            onClick={handleAnalyzeTask}
                            disabled={isAnalyzing || !newTask.title.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary rounded-full text-white hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
                            title="Analyze Task with AI"
                            aria-label="Analyze Task with AI"
                        >
                            {isAnalyzing ? <SpinnerIcon /> : <span className="text-base">✨</span>}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-text-secondary mb-1">Category</label>
                            <select id="category" name="category" value={newTask.category} onChange={handleInputChange} className="w-full px-3 py-2 bg-bg-primary border border-border-default rounded-lg focus:ring-primary focus:border-primary">
                                <option value="Study">Study</option>
                                <option value="Work">Work</option>
                                <option value="Personal">Personal</option>
                                <option value="Fitness">Fitness</option>
                            </select>
                        </div>
                        <div>
                             <label htmlFor="priority" className="block text-sm font-medium text-text-secondary mb-1">Priority</label>
                            <select id="priority" name="priority" value={newTask.priority} onChange={handleInputChange} className="w-full px-3 py-2 bg-bg-primary border border-border-default rounded-lg focus:ring-primary focus:border-primary">
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="duration" className="block text-sm font-medium text-text-secondary mb-1">Duration (min)</label>
                            <input id="duration" type="number" name="duration" value={newTask.duration} onChange={handleInputChange} className="w-full px-3 py-2 bg-bg-primary border border-border-default rounded-lg focus:ring-primary focus:border-primary" step="5" />
                        </div>
                    </div>
                    <Button type="submit" className="w-full !mt-6">Add Task</Button>
                </form>
            </Card>

            <div className="space-y-4">
                <h3 className="text-xl font-bold text-text-primary">To Do</h3>
                <Card className="p-2 sm:p-4 space-y-2">
                   {incompleteTasks.length > 0 ? incompleteTasks.map(task => <TaskItem key={task.id} task={task} onComplete={onCompleteTask} />) : <p className="text-center text-text-secondary p-4">All tasks completed! Great job!</p>}
                </Card>

                <h3 className="text-xl font-bold text-text-primary">Completed</h3>
                <Card className="p-2 sm:p-4 space-y-2">
                   {completedTasks.length > 0 ? completedTasks.map(task => <TaskItem key={task.id} task={task} onComplete={onCompleteTask} />) : <p className="text-center text-text-secondary p-4">No tasks completed yet today.</p>}
                </Card>
            </div>
        </div>
    );
};