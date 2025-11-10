import React from 'react';
import { OrbitId } from '../types';
import { NAVIGATION_ITEMS } from '../constants';

interface BottomNavProps {
  activeOrbit: OrbitId;
  setActiveOrbit: (orbit: OrbitId) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeOrbit, setActiveOrbit }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-bg-secondary border-t border-border-default md:hidden z-10">
      <div className="flex justify-around items-center h-16">
        {NAVIGATION_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveOrbit(item.id)}
            className={`flex flex-col items-center justify-center w-full h-full text-xs transition-colors duration-200 ${
              activeOrbit === item.id ? 'text-primary' : 'text-text-secondary'
            }`}
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span className={activeOrbit === item.id ? 'font-bold' : ''}>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
