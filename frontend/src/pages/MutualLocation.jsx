import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function MutualLocation() {
  const { user } = useAuth();
  const [targetPhone, setTargetPhone] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    // Notify socket server user is on Privacy/Location domain
    socket.emit('switch_domain', { userName: user?.name || 'Naveen', domain: 'location' });
  }, [user]);

  const handleShare = (e) => {
    e.preventDefault();
    setStatus('Consent request sent! Awaiting dual approval to unveil encrypted GPS coordinates.');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <span className="px-3 py-1 bg-sky-100 text-sky-600 text-xs font-semibold rounded-full">
          Privacy & Location Domain
        </span>
        <h1 className="text-3xl font-bold text-slate-800 mt-2">Mutual Location Disclosure</h1>
        <p className="text-slate-500 text-sm">Dual-consent privacy protocol for real-time location exchange.</p>
      </div>

      <form onSubmit={handleShare} className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Target User Mobile Number</label>
          <input
            type="tel"
            required
            value={targetPhone}
            onChange={(e) => setTargetPhone(e.target.value)}
            placeholder="Enter target phone number"
            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-sky-600 text-white font-semibold rounded-2xl hover:bg-sky-700 transition-all shadow-sm"
        >
          Request Mutual GPS Exchange
        </button>
      </form>

      {status && (
        <div className="p-4 bg-sky-50 border border-sky-200 text-sky-800 rounded-2xl text-sm font-medium">
          {status}
        </div>
      )}
    </div>
  );
}