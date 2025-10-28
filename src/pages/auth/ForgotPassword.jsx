import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const { requestPasswordReset } = useAuth();

  // Email validation regex
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Rate limiting - 1 request per 60 seconds
    if (cooldown > 0) {
      setError(`Please wait ${cooldown} seconds before trying again`);
      return;
    }

    setLoading(true);

    try {
      const result = await requestPasswordReset(email);

      // Always show success message (security best practice)
      setSuccess(true);
      setCooldown(60); // Set 60-second cooldown
      setEmail(''); // Clear email field

    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Icon name="MapPin" size={32} className="text-primary mr-2" />
            <h1 className="font-heading font-bold text-2xl text-foreground">TourismHub</h1>
          </div>
          <h2 className="font-heading font-semibold text-xl text-foreground mb-2">
            Reset Your Password
          </h2>
          <p className="font-body text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {/* Form */}
        <div className="bg-card rounded-lg shadow-tourism p-6">
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  <div className="flex items-start">
                    <Icon name="AlertCircle" size={18} className="text-destructive mr-2 flex-shrink-0 mt-0.5" />
                    <p className="font-body text-sm text-destructive">{error}</p>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block font-body text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  disabled={loading || cooldown > 0}
                  required
                  autoComplete="email"
                />
              </div>

              <Button
                type="submit"
                variant="default"
                fullWidth
                disabled={loading || cooldown > 0}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Icon name="Loader" size={20} className="animate-spin mr-2" />
                    Sending...
                  </div>
                ) : cooldown > 0 ? (
                  `Wait ${cooldown}s`
                ) : (
                  'Send Reset Link'
                )}
              </Button>

              {/* Security Notice */}
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-start">
                  <Icon name="Info" size={16} className="text-muted-foreground mr-2 flex-shrink-0 mt-0.5" />
                  <p className="font-caption text-xs text-muted-foreground">
                    For security reasons, we'll send a reset link to your email if an account exists. 
                    The link expires in 60 minutes.
                  </p>
                </div>
              </div>
            </form>
          ) : (
            // Success Message
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="CheckCircle2" size={32} className="text-success" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                Check Your Email
              </h3>
              <p className="font-body text-muted-foreground mb-6">
                If an account exists with that email, we've sent you a password reset link. 
                Please check your inbox and spam folder.
              </p>
              
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                  }}
                  disabled={cooldown > 0}
                >
                  {cooldown > 0 ? `Try Again (${cooldown}s)` : 'Try Another Email'}
                </Button>
                
                <Link to="/login">
                  <Button type="button" variant="ghost" fullWidth>
                    <Icon name="ArrowLeft" size={16} className="mr-2" />
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Back to Login (if not success) */}
          {!success && (
            <div className="mt-6 text-center">
              <Link 
                to="/login" 
                className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center"
              >
                <Icon name="ArrowLeft" size={16} className="mr-1" />
                Back to Login
              </Link>
            </div>
          )}
        </div>

        {/* Additional Security Info */}
        <div className="mt-4 text-center">
          <p className="font-caption text-xs text-muted-foreground">
            Didn't receive an email? Check your spam folder or contact support
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;