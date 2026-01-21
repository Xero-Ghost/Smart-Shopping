import React, { useState } from 'react';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import PlayerDashboard from './components/PlayerDashboard';
import { Moon, Sun } from 'lucide-react';

function App() {
    const [user, setUser] = useState(null);
    const [theme, setTheme] = useState('dark');

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    return (
        <>
            <button className="theme-toggle" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {!user ? (
                <Login onLogin={setUser} />
            ) : (
                <div className="container FadeIn">
                    {user.role === 'admin' ? (
                        <AdminDashboard user={user} onLogout={() => setUser(null)} />
                    ) : (
                        <PlayerDashboard user={user} onLogout={() => setUser(null)} />
                    )}
                </div>
            )}
        </>
    );
}

export default App;
