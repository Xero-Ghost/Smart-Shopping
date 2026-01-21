import React, { useState, useEffect } from 'react';

export default function AdminDashboard({ user, onLogout }) {
    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState({ leaderboard: [] });
    // Simplified for V2 - focusing on monitoring

    const fetchData = async () => {
        const pRes = await fetch('/api/products');
        setProducts(await pRes.json());

        const sRes = await fetch('/api/stats');
        setStats(await sRes.json());
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="FadeIn">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Admin Portal</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span>{user.username}</span>
                    <button onClick={onLogout} style={{ background: '#ef4444', border: 'none', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>Logout</button>
                </div>
            </header>

            <div className="grid-container">
                {/* Live Inventory */}
                <div className="glass-panel" style={{ padding: '2rem', gridColumn: 'span 2' }}>
                    <h3>Live Market Monitor</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                                <th style={{ paddingBottom: '1rem' }}>Product</th>
                                <th style={{ paddingBottom: '1rem' }}>Price</th>
                                <th style={{ paddingBottom: '1rem' }}>Stock</th>
                                <th style={{ paddingBottom: '1rem' }}>Revenue Potential</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '1rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <img src={p.image} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                                        {p.name}
                                    </td>
                                    <td style={{ color: '#4ade80' }}>${p.price.toFixed(2)}</td>
                                    <td>
                                        <span style={{ color: p.stock < 5 ? '#ef4444' : 'inherit' }}>{p.stock}</span>
                                    </td>
                                    <td>${(p.price * p.stock).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
