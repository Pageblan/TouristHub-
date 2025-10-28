import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'tourist'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: []
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

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
    const commonPasswords = ['password', '12345678', 'qwerty', 'abc123', 'password123'];
    if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
      score = Math.max(0, score - 2);
      feedback.push('Avoid common passwords');
    }

    return { score, feedback };
  };

  // Update password strength when password changes
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
      [e?.target?.name]: e?.target?.value
    });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    // Check required fields
    if (!formData?.fullName?.trim()) {
      setError('Please enter your full name');
      return false;
    }

    if (!formData?.email?.trim()) {
      setError('Please enter your email address');
      return false;
    }

    if (!formData?.password) {
      setError('Please enter a password');
      return false;
    }

    if (!formData?.confirmPassword) {
      setError('Please confirm your password');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex?.test(formData?.email?.trim())) {
      setError('Please enter a valid email address');
      return false;
    }

    // Password strength validation
    if (formData?.password?.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (passwordStrength.score < 3) {
      setError('Please choose a stronger password. Your password should include uppercase, lowercase, numbers, and special characters.');
      return false;
    }

    // Password match validation
    if (formData?.password !== formData?.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    // Terms agreement
    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    const result = await signUp(
      formData?.email, 
      formData?.password, 
      formData?.fullName,
      formData?.role
    );
    
    if (result?.success) {
      setSuccess('Account created successfully! Please check your email to verify your account.');
      // Clear form
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'tourist'
      });
      setAgreedToTerms(false);
      
      // Redirect to login after 4 seconds
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Account created! Please check your email to verify your account before logging in.' 
          } 
        });
      }, 4000);
    } else {
      setError(result?.error || 'Sign up failed. Please try again.');
    }
    
    setLoading(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Icon name="MapPin" size={32} className="text-primary mr-2" />
            <h1 className="font-heading font-bold text-2xl text-foreground">TourismHub</h1>
          </div>
          <h2 className="font-heading font-semibold text-xl text-foreground mb-2">Create Account</h2>
          <p className="font-body text-muted-foreground">Join us to explore amazing destinations</p>
        </div>

        {/* Signup Form */}
        <div className="bg-card rounded-lg shadow-tourism p-6">
          {success ? (
            // Success State
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="CheckCircle2" size={32} className="text-success" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                Account Created!
              </h3>
              <div className="bg-success/10 border border-success/20 rounded-lg p-4 mb-4">
                <p className="font-body text-sm text-success">{success}</p>
              </div>
              <p className="font-body text-sm text-muted-foreground mb-4">
                Redirecting to login page...
              </p>
              <div className="flex items-center justify-center">
                <Icon name="Loader" size={20} className="text-primary animate-spin" />
              </div>
            </div>
          ) : (
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
                <label htmlFor="fullName" className="block font-body text-sm font-medium text-foreground mb-2">
                  Full Name *
                </label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData?.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  disabled={loading}
                  required
                  autoComplete="name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block font-body text-sm font-medium text-foreground mb-2">
                  Email Address *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData?.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  disabled={loading}
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="role" className="block font-body text-sm font-medium text-foreground mb-2">
                  Account Type *
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData?.role}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  <option value="tourist">Tourist - Explore and book tours</option>
                  <option value="agent">Travel Agent - Manage tours and bookings</option>
                </select>
                <p className="mt-1 font-caption text-xs text-muted-foreground">
                  {formData.role === 'tourist' 
                    ? 'Browse destinations and book amazing tours' 
                    : 'Create and manage tour packages for travelers'}
                </p>
              </div>

              <div>
                <label htmlFor="password" className="block font-body text-sm font-medium text-foreground mb-2">
                  Password *
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData?.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
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
                  Confirm Password *
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData?.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
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
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <p className="mt-1 font-caption text-xs text-success flex items-center">
                    <Icon name="CheckCircle2" size={12} className="mr-1" />
                    Passwords match
                  </p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => {
                    setAgreedToTerms(e.target.checked);
                    if (error && error.includes('Terms')) setError('');
                  }}
                  className="mt-1 h-4 w-4 text-primary focus:ring-primary border-border rounded cursor-pointer"
                />
                <label htmlFor="terms" className="font-body text-sm text-muted-foreground cursor-pointer">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary hover:text-primary/80 transition-colors">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-primary hover:text-primary/80 transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                variant="default"
                fullWidth
                disabled={loading || passwordStrength.score < 3 || !agreedToTerms}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Icon name="Loader" size={20} className="animate-spin mr-2" />
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>

              {/* Password Requirements Info */}
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-start">
                  <Icon name="Info" size={16} className="text-muted-foreground mr-2 flex-shrink-0 mt-0.5" />
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
          )}

          {/* Sign In Link */}
          {!success && (
            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="font-body text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-4 text-center">
          <p className="font-caption text-xs text-muted-foreground">
            By creating an account, you'll get access to exclusive travel deals and personalized recommendations
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;