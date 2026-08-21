import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [domainCounts, setDomainCounts] = useState({
    total: 1,
    agriculture: 0,
    healthcare: 0,
    homeservices: 0,
    other: 0,
  });

  const currentUser = user || JSON.parse(localStorage.getItem('user') || '{}');
  const userName = currentUser.name || 'User';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const socket = io(BACKEND_URL);

    socket.on('connect', () => {
      setIsSocketConnected(true);
      socket.emit('switch_domain', { userName: userName, domain: 'dashboard' });
    });

    socket.on('disconnect', () => {
      setIsSocketConnected(false);
    });

    socket.on('realtime_domain_counts', (counts) => {
      setDomainCounts(counts);
    });

    return () => {
      socket.disconnect();
    };
  }, [userName]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 p-6 md:p-10 space-y-8 font-sans relative">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-6 gap-4">
        <div>
          <span className="inline-block px-3 py-1 bg-violet-100 text-violet-700 text-xs font-semibold rounded-full border border-violet-200 mb-2">
            ConnectX 2.0 Core Hub
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
            Welcome back, <span className="text-violet-600">{userName}</span> 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Choose an operational domain module below to collaborate.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            Logout 🚪
          </button>
        </div>
      </div>

      {/* 4 Core Domains Grid with Proper React Router Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Agriculture Domain */}
        <Link to="/agri" className="bg-white hover:bg-emerald-50/40 border border-slate-100 hover:border-emerald-200 p-6 rounded-3xl shadow-sm transition-all group flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">🌾</span>
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-600 rounded-lg">
                {domainCounts.agriculture} Active
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">Agriculture</h3>
            <p className="text-xs text-slate-500 mt-1">USSD market rates, crop guides, and SMS/WhatsApp list support.</p>
          </div>
          <span className="mt-6 text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            Enter Domain →
          </span>
        </Link>

        {/* Healthcare Domain */}
        <Link to="/healthcare" className="bg-white hover:bg-rose-50/40 border border-slate-100 hover:border-rose-200 p-6 rounded-3xl shadow-sm transition-all group flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">🩺</span>
              <span className="text-xs font-semibold px-2.5 py-1 bg-rose-100 text-rose-600 rounded-lg">
                {domainCounts.healthcare} Active
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 group-hover:text-rose-600 transition-colors">Health</h3>
            <p className="text-xs text-slate-500 mt-1">Dedicated access for blood donors and patient requests only.</p>
          </div>
          <span className="mt-6 text-xs font-bold text-rose-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            Enter Domain →
          </span>
        </Link>

        {/* Home Services Domain */}
        <Link to="/homeservices" className="bg-white hover:bg-sky-50/40 border border-slate-100 hover:border-sky-200 p-6 rounded-3xl shadow-sm transition-all group flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">🏡</span>
              <span className="text-xs font-semibold px-2.5 py-1 bg-sky-100 text-sky-600 rounded-lg">
                {domainCounts.homeservices} Active
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 group-hover:text-sky-600 transition-colors">Home Services</h3>
            <p className="text-xs text-slate-500 mt-1">Connect with service providers, live mutual GPS location & photo work verification.</p>
          </div>
          <span className="mt-6 text-xs font-bold text-sky-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            Enter Domain →
          </span>
        </Link>

        {/* Other Domain */}
        <Link to="/other" className="bg-white hover:bg-violet-50/40 border border-slate-100 hover:border-violet-200 p-6 rounded-3xl shadow-sm transition-all group flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">🌐</span>
              <span className="text-xs font-semibold px-2.5 py-1 bg-violet-100 text-violet-600 rounded-lg">
                {domainCounts.other} Active
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 group-hover:text-violet-600 transition-colors">Other</h3>
            <p className="text-xs text-slate-500 mt-1">General purpose collaboration and community queries.</p>
          </div>
          <span className="mt-6 text-xs font-bold text-violet-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            Enter Domain →
          </span>
        </Link>

      </div>

    </div>
  );
}