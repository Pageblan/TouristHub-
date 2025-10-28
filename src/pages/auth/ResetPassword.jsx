import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: []
  });
  const [isValidToken, setIsValidToken] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);

  const { updatePassword } = useAuth();

  // Check for valid password reset token
  useEffect(() => {
    const checkToken = async () => {
      const token = searchParams.get('token');
      const type = searchParams.get('type');

      if (type !== 'recovery' || !token) {
        setError('Invalid or expired reset link. Please request a new one.');
        setCheckingToken(false);
        return;
      }

      // Token is present, consider it valid
      // Supabase will validate it when we try to update the password
      setIsValidToken(true);
      setCheckingToken(false);
    };

    checkToken();
  }, [searchParams]);

  // Password strength checker
  const checkPasswordStrength = (password) => {
    const feedback = [];
    let score = 0;

    if (!password) return { score: 0, feedback: [] };

    // Length check
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('At least 8 characters');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One uppercase letter');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One lowercase letter');
    }

    // Number check
    if (/[0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One number');
    }

    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One special character');
    }

    // Common password check
    const commonPasswords = ['password', '12345678', 'qwerty', 'abc123'];
    if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
      score = Math.max(0, score - 2);
      feedback.push('Avoid common passwords');
    }

    return { score, feedback };
  };

  useEffect(() => {
    if (formData.password) {
      setPasswordStrength(checkPasswordStrength(formData.password));
    } else {
      setPasswordStrength({ score: 0, feedback: [] });
    }
  }, [formData.password]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const validateForm = () => {
    // Password length
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    // Password strength
    if (passwordStrength.score < 3) {
      setError('Please choose a stronger password');
      return false;
    }

    // Passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await updatePassword(formData.password);

      if (result.success) {
        setSuccess(true);

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login', { 
            state: { message: 'Password updated successfully. Please log in with your new password.' }
          });
        }, 3000);
      } else {
        setError(result.error || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      console.error('Password reset error:', err);
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength.score === 0) return 'bg-border';
    if (passwordStrength.score <= 2) return 'bg-destructive';
    if (passwordStrength.score <= 3) return 'bg-yellow-500';
    return 'bg-success';
  };

  const getStrengthText = () => {
    if (passwordStrength.score === 0) return '';
    if (passwordStrength.score <= 2) return 'Weak';
    if (passwordStrength.score <= 3) return 'Fair';
    if (passwordStrength.score <= 4) return 'Good';
    return 'Strong';
  };

  // Loading state while checking token
  if (checkingToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
        <div className="text-center">
          <Icon name="Loader" size={48} className="text-primary animate-spin mx-auto mb-4" />
          <p className="font-body text-muted-foreground">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (!isValidToken && !checkingToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-card rounded-lg shadow-tourism p-6 text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="XCircle" size={32} className="text-destructive" />
            </div>
            <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
              Invalid Reset Link
            </h3>
            <p className="font-body text-muted-foreground mb-6">
              {error || 'This password reset link has expired or is invalid.'}
            </p>
            <Button
              type="button"
              variant="default"
              fullWidth
              onClick={() => navigate('/forgot-password')}
            >
              Request New Link
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
            Create New Password
          </h2>
          <p className="font-body text-muted-foreground">
            Choose a strong password for your account
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
                <label htmlFor="password" className="block font-body text-sm font-medium text-foreground mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    disabled={loading}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    tabIndex={-1}
                  >
                    <Icon 
                      name={showPassword ? 'EyeOff' : 'Eye'} 
                      size={20} 
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    />
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-caption text-xs text-muted-foreground">
                        Password Strength: {getStrengthText()}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      />
                    </div>
                    {passwordStrength.feedback.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {passwordStrength.feedback.map((item, index) => (
                          <li key={index} className="font-caption text-xs text-muted-foreground flex items-center">
                            <Icon name="Circle" size={4} className="mr-2" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block font-body text-sm font-medium text-foreground mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                    disabled={loading}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    tabIndex={-1}
                  >
                    <Icon 
                      name={showConfirmPassword ? 'EyeOff' : 'Eye'} 
                      size={20} 
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    />
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="mt-1 font-caption text-xs text-destructive flex items-center">
                    <Icon name="XCircle" size={12} className="mr-1" />
                    Passwords do not match
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="default"
                fullWidth
                disabled={loading || passwordStrength.score < 3}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Icon name="Loader" size={20} className="animate-spin mr-2" />
                    Updating Password...
                  </div>
                ) : (
                  'Reset Password'
                )}
              </Button>

              {/* Security Tips */}
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-start">
                  <Icon name="Shield" size={16} className="text-muted-foreground mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-caption text-xs text-muted-foreground mb-1 font-medium">
                      Password Requirements:
                    </p>
                    <ul className="font-caption text-xs text-muted-foreground space-y-1">
                      <li>• At least 8 characters</li>
                      <li>• Mix of uppercase and lowercase</li>
                      <li>• At least one number</li>
                      <li>• At least one special character</li>
                    </ul>
                  </div>
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
                Password Updated!
              </h3>
              <p className="font-body text-muted-foreground mb-6">
                Your password has been successfully reset. Redirecting to login...
              </p>
              <div className="flex items-center justify-center">
                <Icon name="Loader" size={20} className="text-primary animate-spin" />
              </div>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-4 text-center">
          <p className="font-caption text-xs text-muted-foreground">
            Remember your password?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Back to Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;