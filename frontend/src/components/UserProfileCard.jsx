import React, { useState } from 'react';

export default function UserProfileCard({ currentUser, targetUser }) {
  // State tracking consent from both users
  const [myConsent, setMyConsent] = useState(false);
  const [theirConsent, setTheirConsent] = useState(false); // Simulated status from target user

  // Check if BOTH users have granted permission
  const detailsUnlocked = myConsent && theirConsent;

  return (
    <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 shadow-sm max-w-sm">
      <div className="flex items-center justify-between">
        <div>
          {/* ALWAYS VISIBLE: Username */}
          <h4 className="font-bold text-slate-800 text-sm">@{targetUser.username}</h4>
          <span className="text-[10px] font-semibold text-slate-400">Connected User</span>
        </div>
        
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
          detailsUnlocked ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {detailsUnlocked ? 'Full Access Granted ✅' : 'Protected Profile 🔒'}
        </span>
      </div>

      <hr className="border-slate-100" />

      {/* PRIVACY SECTION */}
      {detailsUnlocked ? (
        /* Revealed ONLY when BOTH allow */
        <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 text-xs space-y-1">
          <p><span className="font-bold text-slate-600">Full Name:</span> {targetUser.name}</p>
          <p><span className="font-bold text-slate-600">Email:</span> {targetUser.email}</p>
          <p><span className="font-bold text-slate-600">Phone/GPS:</span> Shared Mutually</p>
        </div>
      ) : (
        /* Hidden details when one or neither allows */
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-500 space-y-1">
          <p className="italic">🔒 Private details are hidden.</p>
          <p className="text-[11px] text-slate-400">
            {!myConsent && !theirConsent && 'Neither user has granted permission yet.'}
            {myConsent && !theirConsent && 'You granted permission. Waiting for @' + targetUser.username + ' to allow.'}
            {!myConsent && theirConsent && '@' + targetUser.username + ' requested access. Click allow below to share.'}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setMyConsent(!myConsent)}
          className={`w-full py-2 text-xs font-bold rounded-xl transition-all ${
            myConsent
              ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {myConsent ? 'Revoke My Consent' : 'Allow Details Sharing 🤝'}
        </button>

        {/* Demo Toggle to simulate the other user's response */}
        <button
          onClick={() => setTheirConsent(!theirConsent)}
          className="text-[10px] bg-slate-100 text-slate-600 px-2 rounded-xl border border-slate-200 hover:bg-slate-200"
          title="Simulate other user action for testing"
        >
          Simulate @{targetUser.username} {theirConsent ? 'Revoke' : 'Allow'}
        </button>
      </div>
    </div>
  );
}