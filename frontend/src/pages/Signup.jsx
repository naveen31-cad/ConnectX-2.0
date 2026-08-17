import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { validateNationalID } from '../utils/verification';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', phone: '', nationalId: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();
    setError('');

    if (!validateNationalID(formData.nationalId)) {
      setError('National ID must be exactly 12 numerical digits.');
      return;
    }

    setSuccess('Registration successful! Redirecting to login...');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6">
        
        <div className="border-b-2 border-black pb-4">
          <h1 className="text-3xl font-black uppercase tracking-tight">ConnectX</h1>
          <p className="text-xs font-bold text-pink-600 uppercase tracking-widest mt-1">
            Identity & Instant Access Portal
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border-2 border-rose-500 text-rose-600 text-xs font-bold">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-pink-50 border-2 border-pink-500 text-pink-600 text-xs font-bold">
            {success}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 border-2 border-black font-medium focus:outline-none focus:border-pink-500"
              placeholder="Naveen"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase mb-1">Mobile Number</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-3 border-2 border-black font-medium focus:outline-none focus:border-pink-500"
              placeholder="9876543210"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase mb-1">National ID (12 Digits)</label>
            <input
              type="text"
              maxLength="12"
              required
              value={formData.nationalId}
              onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
              className="w-full p-3 border-2 border-black font-medium focus:outline-none focus:border-pink-500"
              placeholder="123456789012"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-pink-600 text-white font-black uppercase text-sm border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-pink-500 active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            Register & Proceed
          </button>
        </form>

        <p className="text-xs text-center font-bold">
          Already have an account?{' '}
          <Link to="/login" className="text-pink-600 underline">
            Direct Login
          </Link>
        </p>

      </div>
    </div>
  );
}