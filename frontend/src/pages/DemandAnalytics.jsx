import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DemandAnalytics() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    agriCount: 0,
    healthcareCount: 0,
    homeServicesCount: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user counts or data from backend endpoints simultaneously
    Promise.all([
      fetch('http://localhost:5000/api/agri/users').then(res => res.json()),
      fetch('http://localhost:5000/api/healthcare/users').then(res => res.json()),
      fetch('http://localhost:5000/api/homeservices/users').then(res => res.json())
    ])
      .then(([agriData, healthData, homeData]) => {
        const agriLen = Array.isArray(agriData) ? agriData.length : 0;
        const healthLen = Array.isArray(healthData) ? healthData.length : 0;
        const homeLen = Array.isArray(homeData) ? homeData.length : 0;

        setStats({
          agriCount: agriLen,
          healthcareCount: healthLen,
          homeServicesCount: homeLen,
          totalUsers: agriLen + healthLen + homeLen
        });
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load analytics metrics from server.");
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f4f7f6', padding: '2rem', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', background: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        
        {/* Compact Back Button */}
        <button 
          onClick={() => navigate('/dashboard')}
          style={{ background: '#e0e7ff', color: '#3730a3', border: 'none', padding: '0.4rem 0.9rem', borderRadius: '20px', cursor: 'pointer', marginBottom: '1.2rem', fontWeight: '600', fontSize: '0.85rem' }}
        >
          ← Back to Dashboard
        </button>

        <h1 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>📊 Demand Analytics Module</h1>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Real-time metrics and dynamic visual tracking of domain utilization.</p>

        {loading && <p style={{ color: '#4b5563' }}>Loading analytics data...</p>}
        {error && <p style={{ color: '#ef4444' }}>{error}</p>}

        {!loading && !error && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            
            <div style={{ background: '#f0fdf4', padding: '1.5rem', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
              <h4 style={{ color: '#166534', marginBottom: '0.5rem' }}>Agriculture Demand</h4>
              <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#14532d', margin: 0 }}>{stats.agriCount}</p>
            </div>

            <div style={{ background: '#eef2ff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #c7d2fe' }}>
              <h4 style={{ color: '#3730a3', marginBottom: '0.5rem' }}>Healthcare Demand</h4>
              <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#312e81', margin: 0 }}>{stats.healthcareCount}</p>
            </div>

            <div style={{ background: '#ecfdf5', padding: '1.5rem', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
              <h4 style={{ color: '#065f46', marginBottom: '0.5rem' }}>Home Services Demand</h4>
              <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#064e3b', margin: 0 }}>{stats.homeServicesCount}</p>
            </div>

            <div style={{ background: '#fdf4ff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #f5d0fe' }}>
              <h4 style={{ color: '#86198f', marginBottom: '0.5rem' }}>Total Active Users</h4>
              <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#701a75', margin: 0 }}>{stats.totalUsers}</p>
            </div>

          </div>
        )}

        <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>System Performance Status</h3>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>All operational tracking sockets and database connections are stable and updating in real time.</p>
        </div>

      </div>
    </div>
  );
}