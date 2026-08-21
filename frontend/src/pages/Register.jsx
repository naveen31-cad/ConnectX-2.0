import { BACKEND_URL } from '../config';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fullName, username, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm w-full max-w-md space-y-5">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            ConnectX 2.0 Account Creation
          </span>
          <h2 className="text-2xl font-bold text-slate-800 pt-2">Create Your Account</h2>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-600 text-xs p-3 rounded-xl border border-rose-100 font-medium">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full mt-1 p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
              placeholder="e.g. Naveen"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
              className="w-full mt-1 p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
              placeholder="e.g. naveen_07"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase">Confirm Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mt-1 p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
          >
            {loading ? 'Creating Account...' : 'Create Account 🚀'}
          </button>
        </form>

        <p className="text-xs text-center text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}