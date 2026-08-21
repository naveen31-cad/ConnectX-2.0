import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';
import HelpModal from './HelpModal';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const socket = io(BACKEND_URL);

export default function Agri() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userName = currentUser.name || 'User';

    socket.on('connect', () => {
      socket.emit('switch_domain', { userName, domain: 'agriculture' });
    });
    if (socket.connected) {
      socket.emit('switch_domain', { userName, domain: 'agriculture' });
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-emerald-50/30 p-6 md:p-10 font-sans space-y-6">
      
      {/* Navigation Header with Help Button */}
      <div className="flex items-center justify-between">
        <Link to="/dashboard" className="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-xl hover:bg-emerald-200 transition-colors">
          ← Back to Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsHelpOpen(true)}
            className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1.5 rounded-xl hover:bg-amber-200 transition-colors shadow-sm"
          >
            Help ❓
          </button>
          <span className="text-xs font-semibold px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full">
            🌾 Agriculture Module
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-emerald-100 p-8 rounded-3xl shadow-sm space-y-4 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800">Offline Agricultural USSD & Market Rates</h1>
        <p className="text-slate-500 text-sm">
          Access real-time crop market pricing, offline USSD tools, and broadcast updates via SMS/WhatsApp lists.
        </p>
      </div>

      {/* Help Modal */}
      <HelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
        domainName="Agriculture" 
      />

    </div>
  );
}