import React from 'react';
import { OrbitId } from '../types';
import { NAVIGATION_ITEMS } from '../constants';

interface SidebarProps {
  activeOrbit: OrbitId;
  setActiveOrbit: (orbit: OrbitId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeOrbit, setActiveOrbit }) => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-bg-secondary border-r border-border-default p-4 space-y-2 shadow-md z-10">
       <div className="flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">O</span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary">OneOrbit</h1>
        </div>
      {NAVIGATION_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveOrbit(item.id)}
          className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200 ${
            activeOrbit === item.id 
              ? 'bg-primary text-white shadow-lg' 
              : 'text-text-secondary hover:bg-bg-primary hover:text-text-primary'
          }`}
        >
          <item.icon className="w-6 h-6" />
          <span className="font-semibold">{item.label}</span>
        </button>
      ))}
    </aside>
  );
};
