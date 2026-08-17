import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

// Dynamic URL support for Render & Vercel cloud deployment
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const socket = io(BACKEND_URL);

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  // Get real logged-in user details (fallback to localStorage if context is hydrating)
  const currentUser = user || JSON.parse(localStorage.getItem('user') || '{}');
  const userName = currentUser.name || 'User';

  // 1. ROUTE PROTECTION: Kicks user to /login if no valid token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
    }
  }, []);

  // 2. LOGOUT HANDLER: Fully clears tokens and session state
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    window.location.href = '/login';
  };

  // Real-time live user counters per domain
  const [domainCounts, setDomainCounts] = useState({
    total: 1,
    healthcare: 0,
    agri: 0,
    location: 0,
    service: 0,
    analytics: 0,
    dashboard: 1
  });

  const [liveLogs, setLiveLogs] = useState([]);

  // Set initial telemetry log once the real user's name is available
  useEffect(() => {
    setLiveLogs([
      { id: 1, type: 'REALTIME', message: `Socket connected for ${userName}`, time: 'Just now' },
      { id: 2, type: 'AGRI', message: 'USSD market query processed', time: '2 mins ago' },
      { id: 3, type: 'HEALTH', message: 'Donor eligibility verified', time: '5 mins ago' }
    ]);
  }, [userName]);

  useEffect(() => {
    socket.on('connect', () => {
      setIsSocketConnected(true);
      // Register the REAL logged-in user with the socket server
      socket.emit('switch_domain', { userName: userName, domain: 'dashboard' });
    });

    socket.on('disconnect', () => {
      setIsSocketConnected(false);
    });

    // Listen for live domain counts from backend
    socket.on('realtime_domain_counts', (counts) => {
      setDomainCounts(counts);

      setLiveLogs((prev) => [
        {
          id: Date.now(),
          type: 'SOCKET',
          message: `Live updates — Total: ${counts.total} (Health: ${counts.healthcare}, Agri: ${counts.agri}, Privacy: ${counts.location}, Service: ${counts.service}, AI: ${counts.analytics})`,
          time: 'Just now'
        },
        ...prev.slice(0, 4)
      ]);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('realtime_domain_counts');
    };
  }, [userName]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 p-6 md:p-10 space-y-8 font-sans">
      
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-6 gap-4">
        <div>
          <span className="inline-block px-3 py-1 bg-violet-100 text-violet-700 text-xs font-semibold rounded-full border border-violet-200 mb-2">
            ConnectX 2.0 Real-Time Domain Telemetry
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
            Welcome back, <span className="text-violet-600">{userName}</span> 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time active user tracking across all 5 operational domain modules.
          </p>
        </div>

        {/* Status & Logout Header Controls */}
        <div className="flex items-center gap-3">
          {/* Socket Status Badge */}
          <div className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-2.5 rounded-2xl shadow-sm">
            <div className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isSocketConnected ? 'bg-emerald-400' : 'bg-rose-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isSocketConnected ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
            </div>
            <span className="text-xs font-medium text-slate-600">
              {isSocketConnected ? 'Domain Socket Server: Live' : 'Connecting Socket...'}
            </span>
          </div>

          {/* Functional Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            Logout 🚪
          </button>
        </div>
      </div>

      {/* Domain Real-Time Active Users Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center text-lg font-bold mb-3">
            👥
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Active System Users</p>
          <p className="text-4xl font-extrabold text-slate-800 mt-1">{domainCounts.total}</p>
          <span className="inline-block mt-2 text-[11px] font-medium text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md">
            ● All Domains Connected
          </span>
        </div>

        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-lg font-bold mb-3">
            🌾
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Agri Domain Users</p>
          <p className="text-4xl font-extrabold text-slate-800 mt-1">{domainCounts.agri}</p>
          <span className="inline-block mt-2 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
            Live USSD Browsers
          </span>
        </div>

        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center text-lg font-bold mb-3">
            🩸
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Healthcare Domain Users</p>
          <p className="text-4xl font-extrabold text-slate-800 mt-1">{domainCounts.healthcare}</p>
          <span className="inline-block mt-2 text-[11px] font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
            Live Blood Portal
          </span>
        </div>

        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-lg font-bold mb-3">
            📊
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Domain Users</p>
          <p className="text-4xl font-extrabold text-slate-800 mt-1">{domainCounts.analytics}</p>
          <span className="inline-block mt-2 text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
            Live Analytics Feed
          </span>
        </div>
      </div>

      {/* Main Section: Domain Cards Launchpad with Real-time Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span>✨</span> Core Domain Modules & Live Active Counts
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 1. Healthcare */}
            <Link to="/healthcare" className="bg-white hover:bg-rose-50/40 border border-slate-100 hover:border-rose-200 p-6 rounded-3xl shadow-sm transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">🩸</span>
                <span className="text-xs font-semibold px-2.5 py-1 bg-rose-100 text-rose-600 rounded-lg flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                  {domainCounts.healthcare} Active Now
                </span>
              </div>
              <h3 className="font-bold text-slate-800 group-hover:text-rose-600 transition-colors">Healthcare & Blood Donor</h3>
              <p className="text-xs text-slate-500 mt-1">Smart eligibility verification and emergency donor dispatch.</p>
            </Link>

            {/* 2. Agri USSD */}
            <Link to="/agri" className="bg-white hover:bg-emerald-50/40 border border-slate-100 hover:border-emerald-200 p-6 rounded-3xl shadow-sm transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">🌾</span>
                <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-600 rounded-lg flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {domainCounts.agri} Active Now
                </span>
              </div>
              <h3 className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">Offline Agricultural USSD</h3>
              <p className="text-xs text-slate-500 mt-1">Market crop rate inquiries via feature-phone simulation.</p>
            </Link>

            {/* 3. Privacy */}
            <Link to="/location" className="bg-white hover:bg-sky-50/40 border border-slate-100 hover:border-sky-200 p-6 rounded-3xl shadow-sm transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">📍</span>
                <span className="text-xs font-semibold px-2.5 py-1 bg-sky-100 text-sky-600 rounded-lg flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
                  {domainCounts.location} Active Now
                </span>
              </div>
              <h3 className="font-bold text-slate-800 group-hover:text-sky-600 transition-colors">Mutual Location Sharing</h3>
              <p className="text-xs text-slate-500 mt-1">Privacy-first dual consent GPS coordinate disclosure.</p>
            </Link>

            {/* 4. Service Verification */}
            <Link to="/service" className="bg-white hover:bg-violet-50/40 border border-slate-100 hover:border-violet-200 p-6 rounded-3xl shadow-sm transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">📸</span>
                <span className="text-xs font-semibold px-2.5 py-1 bg-violet-100 text-violet-600 rounded-lg flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></span>
                  {domainCounts.service} Active Now
                </span>
              </div>
              <h3 className="font-bold text-slate-800 group-hover:text-violet-600 transition-colors">Service Proof Verification</h3>
              <p className="text-xs text-slate-500 mt-1">Field proof of work and photographic task completion audit.</p>
            </Link>

            {/* 5. AI Analytics */}
            <Link to="/analytics" className="bg-white hover:bg-amber-50/40 border border-slate-100 hover:border-amber-200 p-6 rounded-3xl shadow-sm transition-all group md:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">📊</span>
                <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-600 rounded-lg flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  {domainCounts.analytics} Active Now
                </span>
              </div>
              <h3 className="font-bold text-slate-800 group-hover:text-amber-600 transition-colors">Demand Analytics & Insights</h3>
              <p className="text-xs text-slate-500 mt-1">Regional resource demand push alerts and predictive trend analysis.</p>
            </Link>

          </div>
        </div>

        {/* Telemetry Stream */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span>📡</span> Live Telemetry Feed
          </h2>

          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
            {liveLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-violet-100 text-violet-700 rounded-md mt-0.5">
                  {log.type}
                </span>
                <div className="flex-1">
                  <p className="text-xs text-slate-700 font-medium">{log.message}</p>
                  <span className="text-[10px] text-slate-400">{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}