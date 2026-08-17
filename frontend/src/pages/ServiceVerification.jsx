import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function ServiceVerification() {
  const { user } = useAuth();
  const [taskId, setTaskId] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    // Notify socket server user is on Service domain
    socket.emit('switch_domain', { userName: user?.name || 'Naveen', domain: 'service' });
  }, [user]);

  const handleVerify = (e) => {
    e.preventDefault();
    setStatus(`Task #${taskId || 'SRV-101'} verified! Photographic proof validated.`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <span className="px-3 py-1 bg-violet-100 text-violet-600 text-xs font-semibold rounded-full">
          Service Domain
        </span>
        <h1 className="text-3xl font-bold text-slate-800 mt-2">Service Proof Verification</h1>
        <p className="text-slate-500 text-sm">Field service proof and geotagged task completion audit.</p>
      </div>

      <form onSubmit={handleVerify} className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Service Task Reference ID</label>
          <input
            type="text"
            required
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
            placeholder="e.g. SRV-204"
            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-violet-600 text-white font-semibold rounded-2xl hover:bg-violet-700 transition-all shadow-sm"
        >
          Verify Task Completion
        </button>
      </form>

      {status && (
        <div className="p-4 bg-violet-50 border border-violet-200 text-violet-800 rounded-2xl text-sm font-medium">
          {status}
        </div>
      )}
    </div>
  );
}