
import React from 'react';
import { DashboardIcon, FuelIcon, SettingsIcon } from './icons/NavIcons';

interface LayoutProps {
  children: React.ReactNode;
  activePage: 'dashboard' | 'history' | 'settings';
  setPage: (page: 'dashboard' | 'history' | 'settings') => void;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  return (
    <a
      href={`#/${label.toLowerCase()}`}
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full transition-all duration-300 ${isActive ? 'text-brand-primary' : 'text-brand-text-secondary hover:text-brand-primary'}`}
    >
      <div className={`transition-all duration-300 ${isActive ? 'scale-110' : ''}`}>
        {icon}
      </div>
      <span className="text-xs mt-1 font-medium">{label}</span>
      {isActive && <div className="mt-1.5 h-1 w-8 rounded-full bg-brand-primary shadow-glow-primary"></div>}
    </a>
  );
};

const Layout: React.FC<LayoutProps> = ({ children, activePage, setPage }) => {
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col font-sans">
      <main className="flex-grow flex flex-col p-4 overflow-auto">
        {children}
      </main>
      <nav className="flex-shrink-0 bg-brand-surface/80 backdrop-blur-sm border-t border-brand-primary/20 shadow-lg sticky bottom-0">
        <div className="max-w-md mx-auto flex justify-around items-center h-20">
          <NavItem 
            label="Dashboard" 
            icon={<DashboardIcon />} 
            isActive={activePage === 'dashboard'} 
            onClick={() => setPage('dashboard')} 
          />
          <NavItem 
            label="History" 
            icon={<FuelIcon />} 
            isActive={activePage === 'history'} 
            onClick={() => setPage('history')} 
          />
          <NavItem 
            label="Settings" 
            icon={<SettingsIcon />} 
            isActive={activePage === 'settings'} 
            onClick={() => setPage('settings')} 
          />
        </div>
      </nav>
    </div>
  );
};

export default Layout;
