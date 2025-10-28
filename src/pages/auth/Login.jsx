import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  const { signIn, isAuthenticated, isAdmin, isAgent, user, userProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the path user tried to access before being redirected to login
  const from = location.state?.from || null;
  const message = location.state?.message || null;

  // Show info message from navigation state (e.g., after signup)
  useEffect(() => {
    if (message) {
      setInfoMessage(message);
      // Clear the message from location state after displaying
      window.history.replaceState({}, document.title);
    }
  }, [message]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated() && user) {
      redirectBasedOnRole();
    }
  }, [user, userProfile]);

  // Handle lockout timer
  useEffect(() => {
    if (lockoutTimer > 0) {
      const timer = setTimeout(() => setLockoutTimer(lockoutTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (lockoutTimer === 0 && isLocked) {
      setIsLocked(false);
      setLoginAttempts(0);
    }
  }, [lockoutTimer, isLocked]);

  const redirectBasedOnRole = () => {
    // First check if there's a return path
    if (from && from !== '/login') {
      navigate(from, { replace: true });
      return;
    }

    // Redirect based on role
    if (isAdmin()) {
      navigate('/admin-dashboard', { replace: true });
    } else if (isAgent()) {
      navigate('/agent-dashboard', { replace: true });
    } else {
      navigate('/tourist-dashboard', { replace: true });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    if (error) setError('');
    if (infoMessage) setInfoMessage('');
  };

  const validateForm = () => {
    // Email validation
    if (!formData?.email?.trim()) {
      setError('Please enter your email address');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid email address');
      return false;
    }

    // Password validation
    if (!formData?.password) {
      setError('Please enter your password');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    // Check if account is locked
    if (isLocked) {
      setError(`Too many login attempts. Please wait ${lockoutTimer} seconds.`);
      return;
    }

    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setInfoMessage('');

    try {
      const result = await signIn(formData?.email, formData?.password);
      
      if (result?.success) {
        // Reset login attempts on success
        setLoginAttempts(0);
        
        // Handle remember me (store preference in localStorage)
        if (formData.rememberMe) {
          localStorage.setItem('rememberedEmail', formData.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        // Wait a moment for the auth context to update with user profile
        setTimeout(() => {
          // Get fresh role data
          const userRole = result?.data?.user?.user_metadata?.role;
          
          // Redirect based on return path or role
          if (from && from !== '/login') {
            navigate(from, { replace: true });
          } else if (userRole === 'admin') {
            navigate('/admin-dashboard', { replace: true });
          } else if (userRole === 'agent') {
            navigate('/agent-dashboard', { replace: true });
          } else {
            navigate('/tourist-dashboard', { replace: true });
          }
        }, 100);
      } else {
        // Handle failed login attempt
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);

        // Lock account after 5 failed attempts
        if (newAttempts >= 5) {
          setIsLocked(true);
          setLockoutTimer(60); // 60 second lockout
          setError('Too many failed login attempts. Account locked for 60 seconds.');
        } else {
          const attemptsLeft = 5 - newAttempts;
          setError(
            `${result?.error || 'Login failed. Please check your credentials.'} ${
              attemptsLeft > 0 ? `(${attemptsLeft} attempt${attemptsLeft > 1 ? 's' : ''} remaining)` : ''
            }`
          );
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (role) => {
    if (isLocked) {
      setError(`Account is locked. Please wait ${lockoutTimer} seconds.`);
      return;
    }

    switch(role) {
      case 'admin':
        setFormData({ email: 'admin@tourismhub.com', password: 'admin123', rememberMe: false });
        break;
      case 'agent':
        setFormData({ email: 'agent@tourismhub.com', password: 'agent123', rememberMe: false });
        break;
      case 'tourist':
        setFormData({ email: 'tourist@example.com', password: 'tourist123', rememberMe: false });
        break;
    }
    setError('');
    setInfoMessage('Demo credentials loaded. Click Sign In to continue.');
  };

  // Load remembered email on mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setFormData(prev => ({
        ...prev,
        email: rememberedEmail,
        rememberMe: true
      }));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Icon name="MapPin" size={32} className="text-primary mr-2" />
            <h1 className="font-heading font-bold text-2xl text-foreground">TourismHub</h1>
          </div>
          <h2 className="font-heading font-semibold text-xl text-foreground mb-2">Welcome Back</h2>
          <p className="font-body text-muted-foreground">Sign in to your account to continue</p>
        </div>

        {/* Login Form */}
        <div className="bg-card rounded-lg shadow-tourism p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Info Message (success messages from other pages) */}
            {infoMessage && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                <div className="flex items-start">
                  <Icon name="Info" size={18} className="text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <p className="font-body text-sm text-primary">{infoMessage}</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <div className="flex items-start">
                  <Icon name="AlertCircle" size={18} className="text-destructive mr-2 flex-shrink-0 mt-0.5" />
                  <p className="font-body text-sm text-destructive">{error}</p>
                </div>
              </div>
            )}

            {/* Lockout Warning */}
            {isLocked && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <div className="flex items-start">
                  <Icon name="Lock" size={18} className="text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-body text-sm text-yellow-600 font-medium mb-1">Account Temporarily Locked</p>
                    <p className="font-caption text-xs text-yellow-600">
                      Your account has been locked due to multiple failed login attempts. 
                      Please wait {lockoutTimer} seconds before trying again.
                    </p>
                  </div>
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
                value={formData?.email}
                onChange={handleChange}
                placeholder="Enter your email"
                disabled={loading || isLocked}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block font-body text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData?.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  disabled={loading || isLocked}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  tabIndex={-1}
                  disabled={isLocked}
                >
                  <Icon 
                    name={showPassword ? 'EyeOff' : 'Eye'} 
                    size={20} 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  disabled={loading || isLocked}
                  className="h-4 w-4 text-primary focus:ring-primary border-border rounded cursor-pointer"
                />
                <span className="ml-2 font-body text-sm text-muted-foreground">Remember me</span>
              </label>
              <Link 
                to="/forgot-password" 
                className="font-body text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="default"
              fullWidth
              disabled={loading || isLocked}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Icon name="Loader" size={20} className="animate-spin mr-2" />
                  Signing in...
                </div>
              ) : isLocked ? (
                <div className="flex items-center justify-center">
                  <Icon name="Lock" size={20} className="mr-2" />
                  Locked ({lockoutTimer}s)
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="font-body text-sm text-muted-foreground mb-3 text-center">Quick Demo Access:</p>
            <div className="grid gap-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin')}
                disabled={loading || isLocked}
                className="p-2 text-left bg-muted/50 hover:bg-muted rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="font-caption text-xs text-muted-foreground">Admin</div>
                  <Icon name="Shield" size={14} className="text-primary" />
                </div>
                <div className="font-mono text-xs text-foreground">admin@tourismhub.com</div>
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('agent')}
                disabled={loading || isLocked}
                className="p-2 text-left bg-muted/50 hover:bg-muted rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="font-caption text-xs text-muted-foreground">Travel Agent</div>
                  <Icon name="Briefcase" size={14} className="text-primary" />
                </div>
                <div className="font-mono text-xs text-foreground">agent@tourismhub.com</div>
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('tourist')}
                disabled={loading || isLocked}
                className="p-2 text-left bg-muted/50 hover:bg-muted rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="font-caption text-xs text-muted-foreground">Tourist</div>
                  <Icon name="User" size={14} className="text-primary" />
                </div>
                <div className="font-mono text-xs text-foreground">tourist@example.com</div>
              </button>
            </div>
            <p className="font-caption text-xs text-muted-foreground mt-2 text-center">
              Click to auto-fill credentials
            </p>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="font-body text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-4 text-center space-y-2">
          <p className="font-caption text-xs text-muted-foreground">
            Protected by industry-standard encryption
          </p>
          {loginAttempts > 0 && !isLocked && (
            <div className="flex items-center justify-center text-yellow-600">
              <Icon name="AlertTriangle" size={12} className="mr-1" />
              <p className="font-caption text-xs">
                {5 - loginAttempts} login attempt{5 - loginAttempts !== 1 ? 's' : ''} remaining
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;