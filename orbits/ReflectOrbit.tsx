import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { parseReflectionGoals } from '../services/geminiService';
import { ReflectionTask } from '../types';

interface ReflectionPrompts {
    worked_well: string;
    failed_items: string;
    next_goals: string;
}

const prompts = [
    { key: 'worked_well', title: 'What went well this week?' },
    { key: 'failed_items', title: 'What could have been better?' },
    { key: 'next_goals', title: 'What are my main goals for next week?' },
];

interface ReflectOrbitProps {
    addReflectionAndTasks: (reflectionContent: ReflectionPrompts, goals: string[]) => void;
}


export const ReflectOrbit: React.FC<ReflectOrbitProps> = ({ addReflectionAndTasks }) => {
    const [reflection, setReflection] = useState<ReflectionPrompts>({
        worked_well: '',
        failed_items: '',
        next_goals: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setReflection(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyGoals = async () => {
        setIsLoading(true);
        setShowSuccess(false);
        const fullText = Object.values(reflection).join('\n');
        
        try {
            const goals = await parseReflectionGoals(fullText);
            
            if (goals.length > 0) {
                addReflectionAndTasks(reflection, goals);
                setShowSuccess(true);
                // Clear the form after submission
                setReflection({ worked_well: '', failed_items: '', next_goals: '' });
                setTimeout(() => setShowSuccess(false), 4000);
            } else {
                 alert("Could not extract any goals. Please write a more detailed reflection.");
            }
        } catch (error) {
            console.error("Failed to apply goals:", error);
            alert("An error occurred while analyzing your reflection. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Fix: Add explicit type to callback parameter to resolve 'property does not exist on type unknown' error.
    const canSubmit = Object.values(reflection).some((text: string) => text.trim().length > 10);

    return (
        <div className="p-4 sm:p-6 space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-text-primary">Weekly Reflection</h1>
                <p className="text-text-secondary">Take a moment to reflect on your week. (Due Sunday 8 PM)</p>
            </header>

            <Card>
                <div className="space-y-6">
                    {prompts.map(prompt => (
                        <div key={prompt.key}>
                            <label className="text-lg font-semibold text-text-primary">{prompt.title}</label>
                            <textarea
                                name={prompt.key}
                                value={reflection[prompt.key as keyof ReflectionPrompts]}
                                onChange={handleTextChange}
                                rows={4}
                                className="mt-2 w-full p-3 bg-bg-primary border border-border-default rounded-lg focus:ring-primary focus:border-primary"
                                placeholder="Write your thoughts here..."
                            />
                        </div>
                    ))}
                </div>
            </Card>

             <div className="flex justify-end items-center space-x-4">
                {showSuccess && <p className="text-success font-semibold">Reflection saved & tasks created!</p>}
                <Button onClick={handleApplyGoals} disabled={isLoading || !canSubmit}>
                    {isLoading ? 'Analyzing...' : 'Apply Goals & Create Tasks'}
                </Button>
            </div>
        </div>
    );
};