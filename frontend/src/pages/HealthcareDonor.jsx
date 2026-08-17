import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function HealthcareDonor() {
  const { user } = useAuth();
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [units, setUnits] = useState('1');
  const [status, setStatus] = useState('');

  useEffect(() => {
    socket.emit('switch_domain', { userName: user?.name || 'Naveen', domain: 'healthcare' });
  }, [user]);

  const handleRequest = (e) => {
    e.preventDefault();

    // 1. Send live emergency broadcast event via Socket.io
    socket.emit('send_emergency_alert', {
      userName: user?.name || 'Naveen',
      bloodGroup,
      units,
      timestamp: new Date().toLocaleTimeString()
    });

    // 2. Local status update
    setStatus(`Emergency ${bloodGroup} request for ${units} unit(s) broadcasted to all connected users!`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <span className="px-3 py-1 bg-rose-100 text-rose-600 text-xs font-semibold rounded-full">
          Healthcare Domain
        </span>
        <h1 className="text-3xl font-bold text-slate-800 mt-2">Blood Donor Request</h1>
        <p className="text-slate-500 text-sm">Emergency donor verification and real-time alert broadcast.</p>
      </div>

      <form onSubmit={handleRequest} className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Blood Group Required</label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            >
              <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
              <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Units Needed</label>
            <input
              type="number"
              min="1"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-rose-600 text-white font-semibold rounded-2xl hover:bg-rose-700 transition-all shadow-sm"
        >
          Broadcast Emergency Request
        </button>
      </form>

      {status && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm font-medium">
          {status}
        </div>
      )}
    </div>
  );
}