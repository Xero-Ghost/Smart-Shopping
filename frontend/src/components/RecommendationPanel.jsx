import React from 'react';

export default function RecommendationPanel({ recommendations }) {
    if (!recommendations || recommendations.length === 0) return null;

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '2rem' }}>
            <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                AI Buying Recommendations (5-Step Lookahead)
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Based on 'Points per Coin' efficiency if purchased in sequence.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                {recommendations.slice(0, 3).map(rec => (
                    <div key={rec.product_id} style={{
                        background: 'rgba(0,0,0,0.2)',
                        padding: '1rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(59, 130, 246, 0.3)'
                    }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent)' }}>{rec.product_name}</h4>
                        <div style={{ fontSize: '0.8rem' }}>
                            <div>Current Value: {rec.steps[0]?.value.toFixed(4)} pts/$</div>
                            <div style={{ marginTop: '0.5rem', opacity: 0.7 }}>
                                Future Price Trend:
                                {rec.steps.map((s, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Step {s.step}:</span>
                                        <span>${s.price.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
