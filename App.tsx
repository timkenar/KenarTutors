import React, { useState, createContext, useContext, useEffect, useCallback } from 'react';
import { User, UserRole } from './types';
import Auth from './components/Auth';
import Sidebar from './components/Sidebar';
import StudentDashboard from './components/StudentDashboard';
import TutorDashboard from './components/TutorDashboard';
import AdminDashboard from './components/AdminDashboard';
import LandingPage from './components/LandingPage';

type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const marketingRoutes = [
  {
    path: '/',
    label: 'Homepage',
    description: 'High-level overview for curious students, tutors, and admins.',
  },
  {
    path: '/login',
    label: 'Sign in',
    description: 'Secure login flow for returning users with saved profiles.',
  },
  {
    path: '/signin',
    label: 'Create account',
    description: 'Guided onboarding for brand new students or tutors.',
  },
  {
    path: '/app',
    label: 'Dashboard',
    description: 'Authenticated workspace with personalized assignments.',
  },
] as const;

const getInitialPath = () => (typeof window === 'undefined' ? '/' : window.location.pathname || '/');

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
  const [route, setRoute] = useState<string>(() => getInitialPath());

  const navigate = useCallback((path: string, options: { replace?: boolean } = {}) => {
    if (typeof window === 'undefined') return;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    if (window.location.pathname === normalizedPath && !options.replace) {
      setRoute(normalizedPath);
      return;
    }
    if (options.replace) {
      window.history.replaceState({}, '', normalizedPath);
    } else {
      window.history.pushState({}, '', normalizedPath);
    }
    setRoute(normalizedPath);
  }, []);

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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopState = () => setRoute(window.location.pathname || '/');
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (user && ['/', '/login', '/signin'].includes(route)) {
      navigate('/app', { replace: true });
    }
  }, [user, route, navigate]);

  useEffect(() => {
    if (!user && route === '/app') {
      navigate('/', { replace: true });
    }
  }, [user, route, navigate]);

  const login = (user: User) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
     switch (user.role) {
        case UserRole.Admin: setView('dashboard'); break;
        case UserRole.Tutor: setView('open'); break;
        default: setView('assignments');
      }
     navigate('/app');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/');
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

  const isAuthRoute = route === '/login' || route === '/signin';
  const authMode = route === '/signin' ? 'signup' : 'login';

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {!user ? (
        isAuthRoute ? (
          <div className="relative min-h-screen bg-gray-100 py-12 dark:bg-gray-900">
            <button
              onClick={() => navigate('/')}
              className="absolute right-6 top-6 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Back to site
            </button>
            <Auth
              mode={authMode}
              onModeChange={(mode) => navigate(mode === 'signup' ? '/signin' : '/login')}
            />
          </div>
        ) : (
          <LandingPage
            onRouteSelect={navigate}
            availableRoutes={marketingRoutes}
            currentPath={route}
          />
        )
      ) : (
        <div className="flex h-screen bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
          <Sidebar 
            userRole={user.role} 
            onNavigate={setView} 
            currentView={view} 
            toggleDarkMode={toggleDarkMode} 
            isDarkMode={darkMode} 
          />
          <main className="flex-1 overflow-y-auto p-8">
            {renderDashboard()}
          </main>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export default App;
