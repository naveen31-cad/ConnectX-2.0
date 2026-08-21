import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function HomeServices() {
  const [activeTab, setActiveTab] = useState('users');
  const [realUsers, setRealUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [requestTitle, setRequestTitle] = useState('');
  const [requestDesc, setRequestDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    async function fetchRealUsers() {
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_URL}/api/homeservices/users`);
        if (!response.ok) throw new Error('Failed to fetch real user data from backend.');
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
      const response = await fetch(`${BACKEND_URL}/api/homeservices/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: requestTitle, description: requestDesc, domain: 'Home Services' })
      });
      if (!response.ok) throw new Error('Failed to submit request.');
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
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <Link to="/dashboard" className="text-xs font-bold text-sky-600 bg-sky-100 px-3 py-1.5 rounded-xl hover:bg-sky-200 transition-colors inline-block mb-2">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <span>🏡</span> Home Services Operational Domain
          </h1>
          <p className="text-slate-500 text-sm mt-1">Real-time service providers and technical support records.</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'users' ? 'bg-sky-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-sky-50'}`}>
          👥 Real Active Users ({realUsers.length})
        </button>
        <button onClick={() => setActiveTab('post')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'post' ? 'bg-sky-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-sky-50'}`}>
          📝 Post Request
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-lg">Real Database Users in Home Services</h3>
          {loading && <p className="text-xs text-slate-400 py-4">Fetching real user records...</p>}
          {error && <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800">⚠️ Backend error: {error}</div>}
          {!loading && !error && realUsers.length === 0 && (
            <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl text-center space-y-2">
              <p className="text-xs font-bold text-slate-700">No real users found for home services.</p>
            </div>
          )}
          <div className="space-y-2">
            {realUsers.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                <div><span className="font-bold text-slate-800">{user.name}</span><span className="text-slate-500 ml-2">({user.email})</span></div>
                <span className="px-2.5 py-1 bg-sky-100 text-sky-700 font-semibold rounded-lg">Service Expert</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'post' && (
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-lg">Submit Home Service Request</h3>
          {successMsg && <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl text-xs text-sky-800">✅ {successMsg}</div>}
          <form onSubmit={handleRequestSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Request Title</label>
              <input type="text" value={requestTitle} onChange={(e) => setRequestTitle(e.target.value)} placeholder="e.g., Electrical Wiring Inspection" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
              <textarea value={requestDesc} onChange={(e) => setRequestDesc(e.target.value)} placeholder="Provide repair/service details..." rows="4" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500" required></textarea>
            </div>
            <button type="submit" disabled={submitting} className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-sm">
              {submitting ? 'Submitting...' : 'Submit Request 🚀'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}