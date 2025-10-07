
import React from 'react';
import { useApp } from '../../hooks/useApp';
import Button from './Button';

const DumbbellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary">
        <path d="M14.4 14.4 9.6 9.6" /><path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.828l-1.768 1.768a2 2 0 1 1-2.828-2.828l1.768-1.768a2 2 0 1 1-2.828-2.829l-1.768 1.768a2 2 0 1 1-2.828-2.828l8.486-8.486a2 2 0 1 1 2.828 2.828l1.768-1.768a2 2 0 1 1 2.828 2.829l1.768-1.768a2 2 0 1 1 2.828 2.828l-1.768 1.768a2 2 0 1 1 2.829 2.828l-1.768 1.768a2 2 0 1 1 2.828 2.828L18.657 21.485Z" />
    </svg>
);

const Header: React.FC = () => {
    const { user, logout } = useApp();

    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <DumbbellIcon />
                    <h1 className="text-2xl font-bold text-secondary">FitForge AI</h1>
                </div>
                {user && (
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600 hidden sm:block">Welcome, {user.name}</span>
                        <Button onClick={logout} variant="secondary" size="sm">Logout</Button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
