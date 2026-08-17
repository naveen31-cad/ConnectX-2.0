import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function DemandAnalytics() {
  const { user } = useAuth();
  const [region, setRegion] = useState('Coimbatore');

  useEffect(() => {
    // Notify socket server user is on Analytics domain
    socket.emit('switch_domain', { userName: user?.name || 'Naveen', domain: 'analytics' });
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <span className="px-3 py-1 bg-amber-100 text-amber-600 text-xs font-semibold rounded-full">
          AI & Analytics Domain
        </span>
        <h1 className="text-3xl font-bold text-slate-800 mt-2">Demand Analytics Dashboard</h1>
        <p className="text-slate-500 text-sm">Predictive alerts and regional resource demand analysis.</p>
      </div>

      <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Select Target Region</label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          >
            <option>Coimbatore</option>
            <option>Chennai</option>
            <option>Salem</option>
            <option>Madurai</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-5 bg-amber-50/50 border border-amber-100 rounded-2xl">
            <p className="text-xs font-bold text-amber-700 uppercase">Predicted Demand Spike</p>
            <p className="text-2xl font-black text-slate-800 mt-1">O+ Blood Units</p>
            <p className="text-xs text-slate-500 mt-1">High regional demand expected in {region} over the next 48 hours.</p>
          </div>

          <div className="p-5 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
            <p className="text-xs font-bold text-emerald-700 uppercase">Crop USSD Hotspot</p>
            <p className="text-2xl font-black text-slate-800 mt-1">Tomato Market Rate</p>
            <p className="text-xs text-slate-500 mt-1">120+ offline USSD queries logged from {region} today.</p>
          </div>
        </div>
      </div>
    </div>
  );
}