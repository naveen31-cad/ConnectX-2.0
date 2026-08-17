import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function AgriSMS() {
  const { user } = useAuth();
  const [crop, setCrop] = useState('');
  const [response, setResponse] = useState('');

  useEffect(() => {
    // Notify socket server user is on Agri domain
    socket.emit('switch_domain', { userName: user?.name || 'Naveen', domain: 'agri' });
  }, [user]);

  const handleQuery = (e) => {
    e.preventDefault();
    setResponse(`[USSD Live Rate] ${crop || 'Paddy'}: ₹2,150 / Quintal in nearest market.`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-xs font-semibold rounded-full">
          Agriculture Domain
        </span>
        <h1 className="text-3xl font-bold text-slate-800 mt-2">Offline Agri USSD Query</h1>
        <p className="text-slate-500 text-sm">Feature-phone market crop rate inquiries.</p>
      </div>

      <form onSubmit={handleQuery} className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Crop Name / Keyword</label>
          <input
            type="text"
            required
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            placeholder="e.g. Rice, Tomato, Cotton"
            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-emerald-600 text-white font-semibold rounded-2xl hover:bg-emerald-700 transition-all shadow-sm"
        >
          Simulate USSD Query Dispatch
        </button>
      </form>

      {response && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-sm font-medium">
          {response}
        </div>
      )}
    </div>
  );
}