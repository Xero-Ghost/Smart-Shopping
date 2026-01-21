import React, { useState } from 'react';

export default function Login({ onLogin }) {
    const [role, setRole] = useState('player'); // 'admin' or 'player'
    const [formData, setFormData] = useState({ email: '', collegeId: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role, ...formData })
            });
            const data = await res.json();
            if (res.ok) {
                onLogin(data);
            } else {
                setError(data.error || "Login Failed");
            }
        } catch (err) {
            setError("Network Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <div className="glass-panel" style={{ padding: '3rem', maxWidth: '400px', width: '100%' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Smart Shop</h1>

                <div style={{ display: 'flex', marginBottom: '1.5rem', background: 'rgba(0,0,0,0.1)', padding: '0.25rem', borderRadius: '8px' }}>
                    <button
                        style={{ flex: 1, padding: '0.5rem', border: 'none', borderRadius: '6px', cursor: 'pointer', background: role === 'player' ? 'var(--accent)' : 'transparent', color: role === 'player' ? 'white' : 'var(--text-secondary)' }}
                        onClick={() => setRole('player')}
                    >
                        Player
                    </button>
                    <button
                        style={{ flex: 1, padding: '0.5rem', border: 'none', borderRadius: '6px', cursor: 'pointer', background: role === 'admin' ? 'var(--accent)' : 'transparent', color: role === 'admin' ? 'white' : 'var(--text-secondary)' }}
                        onClick={() => setRole('admin')}
                    >
                        Admin
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {role === 'player' ? (
                        <input
                            placeholder="College ID"
                            value={formData.collegeId}
                            onChange={e => setFormData({ ...formData, collegeId: e.target.value })}
                            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}
                            required
                        />
                    ) : (
                        <input
                            placeholder="Admin Email"
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}
                            required
                        />
                    )}

                    <input
                        placeholder="Password"
                        type="password"
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                        style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}
                        required
                    />

                    {error && <div style={{ color: '#ef4444', fontSize: '0.9rem' }}>{error}</div>}

                    <button className="btn-primary" disabled={loading}>
                        {loading ? 'Entering...' : 'Enter System'}
                    </button>
                </form>

                {role === 'admin' ?
                    <p style={{ marginTop: '1rem', fontSize: '0.8rem', opacity: 0.6, textAlign: 'center' }}>Default: admin@smartshop.com / adminpassword</p>
                    :
                    <p style={{ marginTop: '1rem', fontSize: '0.8rem', opacity: 0.6, textAlign: 'center' }}>New IDs are automatically registered.</p>
                }
            </div>
        </div>
    );
}
