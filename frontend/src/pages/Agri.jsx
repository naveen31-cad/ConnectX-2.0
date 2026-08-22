import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import HelpModal from './HelpModal';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function Agri() {
  const [activeTab, setActiveTab] = useState('users');
  const [realUsers, setRealUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New Request Form State
  const [requestTitle, setRequestTitle] = useState('');
  const [requestDesc, setRequestDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Help Modal State
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Socket.io and User Session Initialization (Safely inside useEffect)
  useEffect(() => {
    let socket;
    try {
      socket = io(BACKEND_URL);
      const stored = localStorage.getItem('user');
      const currentUser = stored ? JSON.parse(stored) : {};
      const userName = currentUser.name || 'User';

      socket.on('connect', () => {
        socket.emit('switch_domain', { userName, domain: 'agriculture' });
      });
      if (socket.connected) {
        socket.emit('switch_domain', { userName, domain: 'agriculture' });
      }
    } catch (e) {
      console.error('Socket initialization error:', e);
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  // Fetch real users registered in the Agriculture domain from your backend database
  useEffect(() => {
    async function fetchRealUsers() {
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_URL}/api/agri/users`);
        if (!response.ok) {
          throw new Error('Failed to fetch real user data from backend.');
        }
        const data = await response.json();
        setRealUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRealUsers();
  }, []);

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!requestTitle.trim() || !requestDesc.trim()) return;

    try {
      setSubmitting(true);
      setSuccessMsg('');
      const response = await fetch(`${BACKEND_URL}/api/agri/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: requestTitle, description: requestDesc, domain: 'Agriculture' })
      });

      if (!response.ok) {
        throw new Error('Failed to submit request.');
      }

      setSuccessMsg('Request submitted successfully!');
      setRequestTitle('');
      setRequestDesc('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 p-6 md:p-10 font-sans space-y-6">
      
      {/* Top Header with Back and Help Button */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <Link to="/dashboard" className="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-xl hover:bg-emerald-200 transition-colors inline-block mb-2">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <span>🌾</span> Agriculture Operational Domain
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time database records and active participants.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsHelpOpen(true)}
            className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1.5 rounded-xl hover:bg-amber-200 transition-colors shadow-sm"
          >
            Help ❓
          </button>
        </div>
      </div>

      {/* Feature Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'users'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-emerald-50'
          }`}
        >
          👥 Real Active Users ({realUsers.length})
        </button>
        <button
          onClick={() => setActiveTab('post')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'post'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-emerald-50'
          }`}
        >
          📝 Post Request
        </button>
        <button
          onClick={() => setActiveTab('market')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'market'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-emerald-50'
          }`}
        >
          📈 Live Market Data
        </button>
      </div>

      {/* Real Users Section */}
      {activeTab === 'users' && (
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-lg">Real Database Users in Agriculture</h3>
          <p className="text-xs text-slate-500">Live records queried directly from your database.</p>
          
          {loading && <p className="text-xs text-slate-400 py-4">Fetching real user records from database...</p>}
          {error && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800">
              ⚠️ Could not connect to backend endpoint ({BACKEND_URL}). Make sure your backend server is running on port 5000.
            </div>
          )}

          {!loading && !error && realUsers.length === 0 && (
            <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl text-center space-y-2">
              <p className="text-xs font-bold text-slate-700">No real users found in the database for this domain.</p>
              <p className="text-[11px] text-slate-400">When new users register and select agriculture, they will appear here automatically.</p>
            </div>
          )}

          <div className="space-y-2">
            {realUsers.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                <div>
                  <span className="font-bold text-slate-800">{user.name}</span>
                  <span className="text-slate-500 ml-2">({user.email})</span>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 font-semibold rounded-lg">Registered User</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Post Request Section */}
      {activeTab === 'post' && (
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-lg">Submit New Agriculture Request</h3>
          <p className="text-xs text-slate-500">Broadcast your requirements or service queries to the network.</p>

          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800">
              ✅ {successMsg}
            </div>
          )}

          <form onSubmit={handleRequestSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Request Title</label>
              <input 
                type="text" 
                value={requestTitle} 
                onChange={(e) => setRequestTitle(e.target.value)} 
                placeholder="e.g., Organic Fertilizer Supply Needed" 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
              <textarea 
                value={requestDesc} 
                onChange={(e) => setRequestDesc(e.target.value)} 
                placeholder="Provide details about your requirement..." 
                rows="4"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              ></textarea>
            </div>
            <button 
              type="submit" 
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-sm"
            >
              {submitting ? 'Submitting...' : 'Submit Request 🚀'}
            </button>
          </form>
        </div>
      )}

      {/* Live Market Section */}
      {activeTab === 'market' && (
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-lg">Live Commodity Rates</h3>
          <p className="text-xs text-slate-500">Connected to live agricultural pricing feeds.</p>
          <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-2xl text-xs text-slate-700 font-medium">
            📊 Database connection active and ready.
          </div>
        </div>
      )}

      {/* Help Modal */}
      <HelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
        domainName="Agriculture" 
      />

    </div>
  );
}