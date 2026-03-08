import { useNavigate, useLocation } from 'react-router-dom';
import { PlusCircle, Moon, Sun } from 'lucide-react';
import './AppHeader.css';

export const AppHeader = ({ settings, toggleTheme }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const pageTitle = location.pathname.replace('/', '').replace(/-/g, ' ') || 'dashboard';

    return (
        <header className="app-header">
            <div className="header-left">
                <h1 className="page-title">{pageTitle}</h1>
                <p className="header-subtitle">Welcome back, here's what's happening today.</p>
            </div>
            <div className="header-actions">
                <button
                    onClick={toggleTheme}
                    className="btn-theme"
                    title={settings.theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                >
                    {settings.theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
                <button onClick={() => navigate('/create')} className="btn-primary">
                    <PlusCircle size={18} />
                    <span>New Project</span>
                </button>
            </div>
        </header>
    );
};
