import React, { useState, useEffect } from 'react';

export default function HelpModal({ isOpen, onClose, domainName }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (isOpen) {
      try {
        const stored = localStorage.getItem('user');
        if (stored) {
          setCurrentUser(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Error parsing user in HelpModal:', e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl">
        <h2 className="text-xl font-bold text-slate-800">Help & Support ({domainName || 'General'})</h2>
        <p className="text-sm text-slate-600">
          Hello {currentUser?.name || 'User'}, need assistance with the {domainName} module? Contact support or check your connection.
        </p>
        <button
          onClick={onClose}
          className="w-full py-2 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}