import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      addToast('If an account exists, a password reset link has been sent.', 'success');
      setEmail('');
    }, 1000);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-slate-800 mb-2 text-center">Reset your password</h3>
      <p className="text-sm text-slate-500 mb-6 text-center">
        Enter your email address and we will send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          required
        />

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full"
            isLoading={isSubmitting}
          >
            Send Reset Link
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center text-sm text-slate-600">
        Remember your password?{' '}
        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
