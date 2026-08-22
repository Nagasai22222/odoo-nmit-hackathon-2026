import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Upload, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'employee'
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      await register(formData);
      addToast('Registration successful! Please sign in.', 'success');
      navigate('/login');
    } catch (err) {
      setErrors({ form: err.message || 'Registration failed' });
      addToast('Registration failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="bg-[#eaecf0] text-[#344054] rounded-lg py-4 mb-8 text-center text-sm font-medium mx-12">
        App/Web Logo
      </div>
      
      {errors.form && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 text-center">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 px-2">
        
        {/* Company Name Row */}
        <div className="flex items-center justify-between">
          <label className="w-2/5 text-sm text-slate-700">Company Name :-</label>
          <div className="w-3/5 flex items-center gap-2">
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              disabled={isSubmitting}
              className="flex-1 border-0 border-b border-slate-500 focus:ring-0 px-1 py-1 bg-transparent text-sm"
              style={{ outline: 'none' }}
            />
            <button type="button" className="bg-[#2563eb] text-white p-1.5 rounded flex-shrink-0">
              <Upload size={14} />
            </button>
          </div>
        </div>

        {/* Name Row */}
        <div className="flex items-center justify-between">
          <label className="w-2/5 text-sm text-slate-700">Name :-</label>
          <div className="w-3/5">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-[85%] border-0 border-b border-slate-500 focus:ring-0 px-1 py-1 bg-transparent text-sm"
              style={{ outline: 'none' }}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
        </div>

        {/* Email Row */}
        <div className="flex items-center justify-between">
          <label className="w-2/5 text-sm text-slate-700">Email :-</label>
          <div className="w-3/5">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-[85%] border-0 border-b border-slate-500 focus:ring-0 px-1 py-1 bg-transparent text-sm"
              style={{ outline: 'none' }}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>
        </div>

        {/* Phone Row */}
        <div className="flex items-center justify-between">
          <label className="w-2/5 text-sm text-slate-700">Phone :-</label>
          <div className="w-3/5">
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-[85%] border-0 border-b border-slate-500 focus:ring-0 px-1 py-1 bg-transparent text-sm"
              style={{ outline: 'none' }}
            />
          </div>
        </div>

        {/* Password Row */}
        <div className="flex items-center justify-between">
          <label className="w-2/5 text-sm text-slate-700">Password :-</label>
          <div className="w-3/5 flex items-end gap-2">
            <div className="w-[85%]">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full border-0 border-b border-slate-500 focus:ring-0 px-1 py-1 bg-transparent text-sm"
                style={{ outline: 'none' }}
              />
            </div>
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 text-slate-600 bg-slate-200 rounded flex-shrink-0"
            >
              {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
            </button>
          </div>
        </div>
        {errors.password && <p className="text-xs text-red-500 ml-[40%]">{errors.password}</p>}

        {/* Confirm Password Row */}
        <div className="flex items-center justify-between">
          <label className="w-2/5 text-sm text-slate-700">Confirm Password :-</label>
          <div className="w-3/5 flex items-end gap-2">
            <div className="w-[85%]">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full border-0 border-b border-slate-500 focus:ring-0 px-1 py-1 bg-transparent text-sm"
                style={{ outline: 'none' }}
              />
            </div>
            <button 
              type="button" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="p-1 text-slate-600 bg-slate-200 rounded flex-shrink-0"
            >
              {showConfirmPassword ? <EyeOff size={12} /> : <Eye size={12} />}
            </button>
          </div>
        </div>
        {errors.confirmPassword && <p className="text-xs text-red-500 ml-[40%]">{errors.confirmPassword}</p>}

        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-md text-white font-medium text-sm transition-colors disabled:opacity-50"
            style={{ backgroundColor: '#df80ff' }}
          >
            {isSubmitting ? 'Submitting...' : 'Sign Up'}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center text-xs text-slate-600">
        Already have an account ?{' '}
        <Link to="/login" className="text-slate-800 hover:text-slate-900">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Register;
