import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      addToast('Password has been reset successfully.', 'success');
      navigate('/login');
    }, 1000);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-slate-800 mb-2 text-center">Set new password</h3>
      <p className="text-sm text-slate-500 mb-6 text-center">
        Please enter your new password below.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="New Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isSubmitting}
          required
        />

        <Input
          label="Confirm New Password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isSubmitting}
          required
        />

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full"
            isLoading={isSubmitting}
          >
            Reset Password
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center text-sm text-slate-600">
        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;
