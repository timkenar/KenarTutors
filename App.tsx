import React, { useState, createContext, useContext, useEffect } from 'react';
import { User, UserRole } from './types';
import Auth from './components/Auth';
import Sidebar from './components/Sidebar';
import StudentDashboard from './components/StudentDashboard';
import TutorDashboard from './components/TutorDashboard';
import AdminDashboard from './components/AdminDashboard';

type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState('assignments');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // Set initial view based on role
      switch (parsedUser.role) {
        case UserRole.Admin: setView('dashboard'); break;
        case UserRole.Tutor: setView('open'); break;
        default: setView('assignments');
      }
    }
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
    }
  }, []);

  const login = (user: User) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
     switch (user.role) {
        case UserRole.Admin: setView('dashboard'); break;
        case UserRole.Tutor: setView('open'); break;
        default: setView('assignments');
      }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const renderDashboard = () => {
    if (!user) return null;
    switch (user.role) {
      case UserRole.Student:
        return <StudentDashboard />;
      case UserRole.Tutor:
        return <TutorDashboard view={view as 'open' | 'active' | 'completed'} />;
      case UserRole.Admin:
        return <AdminDashboard view={view as 'dashboard' | 'analytics'} />;
      default:
        return <div>Unknown role</div>;
    }
  };

  const toggleDarkMode = () => {
      const newDarkMode = !darkMode;
      setDarkMode(newDarkMode);
      localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', newDarkMode);
  }

  if (!user) {
    return (
      <AuthContext.Provider value={{ user, login, logout }}>
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
            <Auth />
        </div>
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <Sidebar 
            userRole={user.role} 
            onNavigate={setView} 
            currentView={view} 
            toggleDarkMode={toggleDarkMode} 
            isDarkMode={darkMode} 
        />
        <main className="flex-1 p-8 overflow-y-auto">
          {renderDashboard()}
        </main>
      </div>
    </AuthContext.Provider>
  );
};

export default App;
