import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const user = await login(email, password);
      addToast(`Welcome back, ${user.name}!`, 'success');
      
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/employee/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to login');
      addToast('Login failed. Please check your credentials.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="bg-[#eaecf0] text-[#344054] rounded-lg py-4 mb-8 text-center text-sm font-medium mx-8">
        App/Web Logo
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 px-4">
        <div>
          <label className="block text-sm text-slate-700 mb-1">Login Id/Email :-</label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-slate-500 rounded-md focus:outline-none focus:border-[#df80ff]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        
        <div>
          <label className="block text-sm text-slate-700 mb-1">Password :-</label>
          <input
            type="password"
            className="w-full px-3 py-2 border border-slate-500 rounded-md focus:outline-none focus:border-[#df80ff]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-md text-white font-medium text-sm transition-colors disabled:opacity-50"
            style={{ backgroundColor: '#df80ff' }}
          >
            {isSubmitting ? 'Signing in...' : 'SIGN IN'}
          </button>
        </div>
      </form>

      <div className="mt-8 text-center text-xs text-slate-600">
        Don't have an Account?{' '}
        <Link to="/register" className="text-slate-800 hover:text-slate-900">
          Sign Up
        </Link>
      </div>
    </div>
  );
};
export default Login;
