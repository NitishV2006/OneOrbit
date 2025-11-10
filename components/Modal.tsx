
import React, { ReactNode } from 'react';
import { Card } from './Card';

interface ModalProps {
    title: string;
    onClose: () => void;
    children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
            onClick={onClose}
        >
            <Card 
                title={title}
                className="w-full max-w-md mx-4"
                onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="mt-4">
                    {children}
                </div>
            </Card>
        </div>
    );
};
