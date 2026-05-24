import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

export default function Login() {
  const { loginWithSecretCode, currentUser, isAdmin } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // If already logged in, redirect straight to admin
  if (currentUser && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter the secret code.');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate small network delay for UX
    await new Promise(r => setTimeout(r, 600));

    const success = loginWithSecretCode(password);
    
    if (success) {
      navigate('/admin');
    } else {
      setError('Invalid secret code.');
    }
    
    setLoading(false);
  };

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center bg-cover bg-center px-4 py-16" style={{
      backgroundImage: "linear-gradient(to bottom, rgba(47, 37, 25, 0.8), rgba(47, 37, 25, 0.8)), url('https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80')"
    }}>
      <div className="absolute inset-0 bg-brand-dark/20"></div>

      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
        
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-wood text-white font-serif text-2xl font-bold mb-4 shadow">
            KK
          </span>
          <h2 className="font-serif text-2xl font-bold text-brand-dark">Admin Console</h2>
          <p className="text-xs text-brand-dark/65 mt-1.5">Sign in to manage products, gallery, and customer inquiries.</p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {error && (
            <div className="flex items-start gap-2 p-3.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-dark/75 mb-1.5">
              Secret Code
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-wood/50">
                <Lock size={16} />
              </span>
              <input
                type="password"
                required
                placeholder="Enter secret access code"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-brand-wood/20 bg-brand-light/50 py-3 pl-10 pr-4 text-sm outline-none focus:border-brand-wood focus:bg-white transition-all text-brand-dark tracking-widest"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 flex items-center justify-center gap-2 rounded-lg bg-brand-wood py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-dark transition-all duration-300 disabled:opacity-50"
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            ) : (
              <>
                <LogIn size={16} />
                <span>Access Console</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
