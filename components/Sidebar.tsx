import React from 'react';
import { useAuth } from '../App';
import { UserRole } from '../types';
import { DashboardIcon, BriefcaseIcon, DocumentTextIcon, UsersIcon, LogoutIcon, CheckCircleIcon, ChartBarIcon, SunIcon, MoonIcon } from './icons';

interface SidebarProps {
    userRole: UserRole;
    onNavigate: (view: string) => void;
    currentView: string;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ userRole, onNavigate, currentView, toggleDarkMode, isDarkMode }) => {
    const { user, logout } = useAuth();

    const NavLink: React.FC<{
        onClick?: () => void;
        isActive?: boolean;
        children: React.ReactNode;
    }> = ({ onClick, isActive, children }) => (
        <button
            onClick={onClick}
            className={`w-full flex items-center px-4 py-3 text-left text-sm font-medium rounded-lg transition-colors duration-200 ${
                isActive
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
        >
            {children}
        </button>
    );
    
    const renderNavLinks = () => {
        switch (userRole) {
            case UserRole.Student:
                return (
                    <NavLink isActive={currentView === 'assignments'}>
                        <DashboardIcon /> <span className="ml-3">My Assignments</span>
                    </NavLink>
                );
            case UserRole.Tutor:
                return (
                    <>
                        <NavLink onClick={() => onNavigate('open')} isActive={currentView === 'open'}>
                           <BriefcaseIcon /> <span className="ml-3">Find Work</span>
                        </NavLink>
                        <NavLink onClick={() => onNavigate('active')} isActive={currentView === 'active'}>
                            <DocumentTextIcon /> <span className="ml-3">Active Work</span>
                        </NavLink>
                        <NavLink onClick={() => onNavigate('completed')} isActive={currentView === 'completed'}>
                            <CheckCircleIcon /> <span className="ml-3">Completed</span>
                        </NavLink>
                    </>
                );
            case UserRole.Admin:
                 return (
                    <>
                        <NavLink onClick={() => onNavigate('dashboard')} isActive={currentView === 'dashboard'}>
                            <UsersIcon /> <span className="ml-3">Dashboard</span>
                        </NavLink>
                        <NavLink onClick={() => onNavigate('analytics')} isActive={currentView === 'analytics'}>
                            <ChartBarIcon /> <span className="ml-3">Analytics</span>
                        </NavLink>
                    </>
                );
            default:
                return null;
        }
    }

    return (
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col flex-shrink-0">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">TutorFlow</h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {renderNavLinks()}
            </nav>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-100">{user?.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
                    </div>
                     <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                        aria-label="Toggle dark mode"
                    >
                        {isDarkMode ? <SunIcon /> : <MoonIcon />}
                    </button>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 px-4 py-3 text-sm font-medium rounded-lg"
                >
                    <LogoutIcon />
                    <span className="ml-3">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
