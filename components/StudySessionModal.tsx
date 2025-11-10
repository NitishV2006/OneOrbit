import React, { useState, useEffect, useMemo } from 'react';
import { LearningItem } from '../types';
import { Button } from './Button';
import { Modal } from './Modal';

interface StudySessionModalProps {
    item: LearningItem;
    onClose: () => void;
    onSessionEnd: (itemId: string, durationMinutes: number, quality: 1 | 2 | 3 | 4 | 5) => void;
}

const SESSION_DURATION_SECONDS = 25 * 60; // 25 minutes

const StarRating: React.FC<{ rating: number; setRating: (rating: number) => void }> = ({ rating, setRating }) => {
    return (
        <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-4xl transition-transform transform hover:scale-110 ${star <= rating ? 'text-secondary' : 'text-gray-300 dark:text-gray-600'}`}
                    aria-label={`Rate ${star} out of 5`}
                >
                    ★
                </button>
            ))}
        </div>
    );
};

export const StudySessionModal: React.FC<StudySessionModalProps> = ({ item, onClose, onSessionEnd }) => {
    const [timeLeft, setTimeLeft] = useState(SESSION_DURATION_SECONDS);
    const [isFinished, setIsFinished] = useState(false);
    const [quality, setQuality] = useState<number>(0);

    useEffect(() => {
        if (isFinished) return;

        if (timeLeft <= 0) {
            setIsFinished(true);
            // Play a notification sound
            new Audio('https://aistudio.google.com/static/sounds/task_completed.mp3').play();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, isFinished]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const handleEndSessionEarly = () => {
        setIsFinished(true);
    };

    const handleSave = () => {
        if (quality === 0) return;
        const durationStudiedSeconds = SESSION_DURATION_SECONDS - timeLeft;
        const durationStudiedMinutes = Math.ceil(durationStudiedSeconds / 60);
        onSessionEnd(item.id, durationStudiedMinutes, quality as 1 | 2 | 3 | 4 | 5);
    };

    const progressPercentage = useMemo(() => {
        return ((SESSION_DURATION_SECONDS - timeLeft) / SESSION_DURATION_SECONDS) * 100;
    }, [timeLeft]);

    return (
        <Modal title={isFinished ? "Session Complete!" : `Studying: ${item.title}`} onClose={onClose}>
            {!isFinished ? (
                <div className="text-center space-y-6">
                    <div className="relative w-48 h-48 mx-auto">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle className="text-border-default/50" strokeWidth="7" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                            <circle
                                className="text-primary"
                                strokeWidth="7" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50"
                                strokeDasharray={2 * Math.PI * 45}
                                strokeDashoffset={(2 * Math.PI * 45) * (1 - progressPercentage / 100)}
                                style={{ transition: 'stroke-dashoffset 1s linear' }}
                                transform="rotate(-90 50 50)"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-5xl font-bold text-text-primary tracking-tighter">
                                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                            </span>
                        </div>
                    </div>
                    <p className="text-text-secondary">Stay focused. You can do it!</p>
                    <Button variant="danger" onClick={handleEndSessionEarly}>End Session Early</Button>
                </div>
            ) : (
                <div className="text-center space-y-6">
                    <h3 className="text-xl font-bold text-text-primary">Great work!</h3>
                    <p className="text-text-secondary">How would you rate the quality of this study session?</p>
                    <StarRating rating={quality} setRating={setQuality} />
                    <Button onClick={handleSave} disabled={quality === 0}>Save & Close</Button>
                </div>
            )}
        </Modal>
    );
};
