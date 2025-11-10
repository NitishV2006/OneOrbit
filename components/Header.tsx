
import React from 'react';
import { OrbitId } from '../types';
import { NAVIGATION_ITEMS } from '../constants';
import Switch from './ui/Switch';
import { Button } from './Button';

const orbitSubtitles: Record<OrbitId, string> = {
    [OrbitId.Home]: "Welcome back, let's make today productive!",
    [OrbitId.Learn]: "Track your learning and achieve mastery.",
    [OrbitId.Tasks]: "What's on the agenda for today?",
    [OrbitId.Finance]: "Keep your spending in check.",
    [OrbitId.Health]: "Log your daily metrics to maintain balance.",
    [OrbitId.Reflect]: "Take a moment to reflect on your week.",
    [OrbitId.Connect]: "Stay accountable with your trio.",
    [OrbitId.Profile]: "Your personal portfolio of accomplishments.",
};


export const Header: React.FC<{ activeOrbit: OrbitId; onLogout: () => void; }> = ({ activeOrbit, onLogout }) => {
    const currentOrbit = NAVIGATION_ITEMS.find(item => item.id === activeOrbit);
    
    return (
        <header className="p-4 sm:p-6 flex justify-between items-center border-b border-border-default sticky top-0 bg-bg-primary/80 backdrop-blur-sm z-20">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">{currentOrbit?.label}</h1>
                <p className="text-text-secondary hidden sm:block">
                   {orbitSubtitles[activeOrbit]}
                </p>
            </div>
            <div className="flex items-center space-x-4">
                <Switch />
                <Button onClick={onLogout} variant="danger" className="text-xs px-3 py-1.5">Logout</Button>
            </div>
        </header>
    );
};
