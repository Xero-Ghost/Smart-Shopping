import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Info, Target } from 'lucide-react';

export default function PlayerDashboard({ user, onLogout }) {
    const [products, setProducts] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [currentUser, setCurrentUser] = useState(user);
    const [buying, setBuying] = useState(null);

    const [selectedProductGraph, setSelectedProductGraph] = useState(null);
    const [graphData, setGraphData] = useState([]);
    const [recommendationPath, setRecommendationPath] = useState(null);
    const [loadingRecs, setLoadingRecs] = useState(false);

    const fetchData = async () => {
        const pRes = await fetch('/api/products');
        const newProducts = await pRes.json();
        setProducts(newProducts);
        const sRes = await fetch('/api/stats');
        const stats = await sRes.json();
        setLeaderboard(stats.leaderboard);
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleShowGraph = async (productId) => {
        if (selectedProductGraph === productId) {
            setSelectedProductGraph(null);
            return;
        }
        setSelectedProductGraph(productId);
        const res = await fetch(`/api/product/${productId}/history`);
        const data = await res.json();
        setGraphData(data);
    };

    const handleBuy = async (productId) => {
        setBuying(productId);
        try {
            const res = await fetch('/api/buy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser.id, productId })
            });
            const data = await res.json();
            if (res.ok) {
                setCurrentUser(prev => ({
                    ...prev,
                    coins: data.new_coins,
                    points: data.new_points
                }));
                fetchData();
                if (selectedProductGraph === productId) handleShowGraph(productId);
            } else {
                alert(data.error);
            }
        } catch (e) { console.error(e); }
        finally { setBuying(null); }
    };

    const handleGetRecommendations = async () => {
        setLoadingRecs(true);
        try {
            const res = await fetch('/api/recommendations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser.id })
            });
            const data = await res.json();
            if (res.ok) {
                setRecommendationPath(data.plan);
                setCurrentUser(prev => ({ ...prev, reco_tries: data.tries_left }));
            } else {
                alert(data.error);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingRecs(false);
        }
    };

    return (
        <div>
            {/* Header */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: 'var(--glass-bg)', padding: '1rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                <div>
                    <h2 style={{ margin: 0 }}>Smart Marketplace</h2>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Welcome, {currentUser.username}</div>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', gap: '2rem' }}>
                    <div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Funds</div>
                        <div style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '1.2rem' }}>₹{currentUser.coins.toFixed(2)}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Points</div>
                        <div style={{ color: '#60a5fa', fontWeight: 'bold', fontSize: '1.2rem' }}>{currentUser.points || 0}</div>
                    </div>
                    <button onClick={onLogout} style={{ background: 'transparent', border: '1px solid #ef4444', borderRadius: '8px', color: '#ef4444', cursor: 'pointer', padding: '0.5rem 1rem' }}>Logout</button>
                </div>
            </header>

            {/* Ticker */}
            <div className="glass-panel" style={{ padding: '0.5rem 1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '2rem', overflowX: 'auto', borderLeft: '4px solid var(--accent)' }}>
                <span style={{ fontWeight: 'bold', color: 'var(--accent)', whiteSpace: 'nowrap' }}>LIVE PRICES</span>
                {products.map(p => {
                    const percentChange = ((p.price - p.basePrice) / p.basePrice * 100).toFixed(1);
                    const hasIncreased = p.price > p.basePrice;
                    return (
                        <div key={p.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem', minWidth: '180px' }}>
                            <span>{p.name}</span>
                            {hasIncreased ? (
                                <span style={{ color: '#22c55e' }}>▲ ₹{p.price.toFixed(0)} <span style={{ fontSize: '0.75rem' }}>(+{percentChange}%)</span></span>
                            ) : (
                                <span style={{ color: '#9ca3af' }}>━ ₹{p.price.toFixed(0)}</span>
                            )}
                        </div>
                    );
                })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '2rem' }}>

                {/* Main */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    <div className="grid-container">
                        {products.map(p => (
                            <div key={p.id} className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', position: 'relative' }}>

                                <button
                                    onClick={() => handleShowGraph(p.id)}
                                    style={{
                                        position: 'absolute', top: '10px', right: '10px',
                                        background: 'white', border: 'none', borderRadius: '50%',
                                        width: '30px', height: '30px', cursor: 'pointer', color: 'black',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                    }}>
                                    <Info size={18} />
                                </button>

                                <div style={{ height: '200px', marginBottom: '1rem', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
                                    {selectedProductGraph === p.id ? (
                                        <div style={{ width: '100%', height: '100%', background: 'white', padding: '10px' }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={graphData}>
                                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} stroke="#000" />
                                                    <XAxis dataKey="time" stroke="#000" fontSize={10} tickFormatter={(val) => val} />
                                                    <YAxis stroke="#000" fontSize={10} domain={['auto', 'auto']} />
                                                    <Line type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={2} dot={{ r: 2 }} />
                                                    <Tooltip contentStyle={{ background: '#fff', border: '1px solid #ccc', color: 'black' }} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    ) : (
                                        <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    )}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 0.5rem 0' }}>{p.name}</h3>
                                        <span style={{ fontSize: '0.8rem', background: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent)', padding: '2px 6px', borderRadius: '4px' }}>
                                            {p.points} Pts
                                        </span>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#4ade80' }}>₹{p.price.toFixed(0)}</div>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{p.stock} left</div>
                                    </div>
                                </div>

                                <button
                                    className="btn-primary"
                                    style={{ marginTop: '1rem', width: '100%' }}
                                    disabled={p.stock <= 0 || currentUser.coins < p.price}
                                    onClick={() => handleBuy(p.id)}
                                >
                                    {p.stock <= 0 ? 'SOLD OUT' : 'BUY NOW'}
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3>AI Path Optimizer</h3>
                            <button
                                className="btn-primary"
                                onClick={handleGetRecommendations}
                                disabled={currentUser.reco_tries <= 0 || loadingRecs}
                                style={{ background: currentUser.reco_tries <= 0 ? 'gray' : 'var(--accent)' }}
                            >
                                {loadingRecs ? 'Calculating Best Path...' : `Get 5-Step Strategy (${currentUser.reco_tries} left)`}
                            </button>
                        </div>

                        {recommendationPath && (
                            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                                {recommendationPath.map((step, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                                        <div style={{
                                            background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '12px',
                                            border: '1px solid var(--accent)', minWidth: '140px', textAlign: 'center'
                                        }}>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Step {i + 1}</div>
                                            <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{step.product_name}</div>
                                            <div style={{ fontSize: '0.9rem', color: '#4ade80' }}>Cost: ₹{step.cost.toFixed(0)}</div>
                                            <div style={{ fontSize: '0.9rem', color: '#60a5fa' }}>+{step.points} Pts</div>
                                        </div>
                                        {i < recommendationPath.length - 1 && <span style={{ fontSize: '1.5rem', margin: '0 0.5rem', opacity: 0.5 }}>→</span>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

                {/* Sidebar */}
                <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Target size={20} color="#fbbf24" /> Leaderboard
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', fontSize: '0.8rem', opacity: 0.7, borderBottom: '1px solid white' }}>
                            <span>User</span>
                            <span>Points</span>
                        </li>
                        {leaderboard.map((u, i) => (
                            <li key={i} style={{
                                padding: '0.75rem 0',
                                borderBottom: '1px solid var(--glass-border)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                color: u.username === currentUser.username ? 'var(--accent)' : 'inherit'
                            }}>
                                <span>#{i + 1} {u.username}</span>
                                <span style={{ fontWeight: 'bold' }}>{u.points}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
