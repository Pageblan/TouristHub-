import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)

  // Separate async operations object
  const profileOperations = {
    async load(userId) {
      if (!userId) return
      setProfileLoading(true)
      try {
        const { data, error } = await supabase
          ?.from('user_profiles')
          ?.select('*')
          ?.eq('id', userId)
          ?.single()
        if (!error && data) {
          setUserProfile(data)
        } else if (error) {
          console.error('Profile load error:', error)
          setUserProfile(null)
        }
      } catch (err) {
        console.error('Profile load exception:', err)
        setUserProfile(null)
      } finally {
        setProfileLoading(false)
      }
    },
    
    clear() {
      setUserProfile(null)
      setProfileLoading(false)
    }
  }

  // Protected auth handlers
  const authStateHandlers = {
    // CRITICAL: This MUST remain synchronous
    onChange: (event, session) => {
      // Handle password recovery event
      if (event === 'PASSWORD_RECOVERY') {
        console.log('Password recovery detected - user is resetting password')
      }

      setUser(session?.user ?? null)
      setLoading(false)
      
      if (session?.user) {
        profileOperations?.load(session?.user?.id) // Fire-and-forget
      } else {
        profileOperations?.clear()
      }
    }
  }

  useEffect(() => {
    // Get initial session
    supabase?.auth?.getSession()?.then(({ data: { session } }) => {
      authStateHandlers?.onChange(null, session)
    }).catch((err) => {
      console.error('Session check error:', err)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase?.auth?.onAuthStateChange(
      authStateHandlers?.onChange
    )

    return () => subscription?.unsubscribe()
  }, [])

  // Auth methods
  const signIn = async (email, password) => {
    try {
      // Input validation
      if (!email?.trim() || !password) {
        return { success: false, error: 'Email and password are required' };
      }

      const { data, error } = await supabase?.auth?.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        // Handle specific error cases
        if (error.message?.includes('Invalid login credentials')) {
          return { success: false, error: 'Invalid email or password' };
        }
        if (error.message?.includes('Email not confirmed')) {
          return { success: false, error: 'Please verify your email address before signing in' };
        }
        return { success: false, error: error?.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        return { 
          success: false, 
          error: 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.' 
        };
      }
      return { success: false, error: 'Something went wrong. Please try again.' };
    }
  }

  const signUp = async (email, password, fullName, role = 'tourist') => {
    try {
      // Input validation
      if (!email?.trim() || !password || !fullName?.trim()) {
        return { success: false, error: 'All fields are required' };
      }

      // Password strength validation
      if (password.length < 8) {
        return { success: false, error: 'Password must be at least 8 characters long' };
      }

      const { data, error } = await supabase?.auth?.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            role: role
          },
          emailRedirectTo: `${window.location.origin}/login`
        }
      });

      if (error) {
        // Handle specific error cases
        if (error.message?.includes('already registered')) {
          return { success: false, error: 'This email is already registered' };
        }
        return { success: false, error: error?.message };
      }

      // Note: user_profiles will be created automatically by the trigger in your migration
      // No need to manually create it here

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        return { 
          success: false, 
          error: 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.' 
        };
      }
      return { success: false, error: 'Something went wrong. Please try again.' };
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase?.auth?.signOut();
      if (error) {
        return { success: false, error: error?.message };
      }
      // Clear state immediately
      setUser(null);
      setUserProfile(null);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Something went wrong during sign out.' };
    }
  }

  // Request password reset - with security best practices
  const requestPasswordReset = async (email) => {
    try {
      // Input validation
      if (!email?.trim()) {
        return { success: false, error: 'Email address is required' };
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      const { error } = await supabase?.auth?.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      // SECURITY: Always return success to prevent email enumeration
      // Don't reveal whether the email exists in the system
      if (error) {
        console.error('Password reset error:', error);
      }

      return { 
        success: true, 
        message: 'If an account exists with this email, you will receive a password reset link.' 
      };
    } catch (error) {
      console.error('Password reset exception:', error);
      // Still return success to prevent email enumeration
      return { 
        success: true, 
        message: 'If an account exists with this email, you will receive a password reset link.' 
      };
    }
  }

  // Update password - for use on reset password page
  const updatePassword = async (newPassword) => {
    try {
      // Password strength validation
      if (!newPassword || newPassword.length < 8) {
        return { 
          success: false, 
          error: 'Password must be at least 8 characters long' 
        };
      }

      // Check password complexity
      const hasUpperCase = /[A-Z]/.test(newPassword);
      const hasLowerCase = /[a-z]/.test(newPassword);
      const hasNumber = /[0-9]/.test(newPassword);
      const hasSpecialChar = /[^A-Za-z0-9]/.test(newPassword);

      if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
        return { 
          success: false, 
          error: 'Password must contain uppercase, lowercase, number, and special character' 
        };
      }

      const { error } = await supabase?.auth?.updateUser({
        password: newPassword,
      });

      if (error) {
        return { success: false, error: error?.message };
      }

      return { success: true, message: 'Password updated successfully' };
    } catch (error) {
      console.error('Password update error:', error);
      return { success: false, error: 'Failed to update password. Please try again.' };
    }
  }

  // Legacy resetPassword method - now points to requestPasswordReset
  const resetPassword = async (email) => {
    return await requestPasswordReset(email);
  }

  const updateProfile = async (updates) => {
    try {
      if (!user) return { success: false, error: 'No user logged in' };

      // Sanitize updates
      const sanitizedUpdates = {};
      if (updates.full_name) sanitizedUpdates.full_name = updates.full_name.trim();
      if (updates.phone) sanitizedUpdates.phone = updates.phone.trim();
      if (updates.nationality) sanitizedUpdates.nationality = updates.nationality.trim();
      if (updates.date_of_birth) sanitizedUpdates.date_of_birth = updates.date_of_birth;
      if (updates.profile_image) sanitizedUpdates.profile_image = updates.profile_image;

      const { data, error } = await supabase
        ?.from('user_profiles')
        ?.update({
          ...sanitizedUpdates,
          updated_at: new Date().toISOString()
        })
        ?.eq('id', user?.id)
        ?.select()
        ?.single();

      if (error) {
        return { success: false, error: error?.message };
      }

      setUserProfile(data);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to update profile' };
    }
  }

  // Change email (requires re-authentication)
  const updateEmail = async (newEmail) => {
    try {
      if (!newEmail?.trim()) {
        return { success: false, error: 'Email address is required' };
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newEmail.trim())) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      const { error } = await supabase?.auth?.updateUser({
        email: newEmail.trim()
      });

      if (error) {
        return { success: false, error: error?.message };
      }

      return { 
        success: true, 
        message: 'Verification email sent to your new address. Please confirm to complete the change.' 
      };
    } catch (error) {
      return { success: false, error: 'Failed to update email' };
    }
  }

  // Helper validation methods
  const isAuthenticated = () => {
    return !!user;
  }

  const isAdmin = () => {
    // Check both user metadata and profile
    return (
      userProfile?.role === 'admin' || 
      user?.user_metadata?.role === 'admin'
    );
  }

  const isAgent = () => {
    return (
      userProfile?.role === 'agent' || 
      user?.user_metadata?.role === 'agent'
    );
  }

  const isTourist = () => {
    return (
      userProfile?.role === 'tourist' || 
      user?.user_metadata?.role === 'tourist' ||
      (!userProfile?.role && !user?.user_metadata?.role) // Default to tourist
    );
  }

  const hasRole = (role) => {
    return (
      userProfile?.role === role || 
      user?.user_metadata?.role === role
    );
  }

  // Check if user is verified (if email confirmation is enabled)
  const isVerified = () => {
    return user?.email_confirmed_at != null;
  }

  // Get user display name
  const getDisplayName = () => {
    return userProfile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    const name = getDisplayName();
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  const value = {
    user,
    userProfile,
    loading,
    profileLoading,
    // Auth methods
    signIn,
    signUp,
    signOut,
    resetPassword, // Legacy method
    requestPasswordReset, // New method with better naming
    updatePassword, // For password reset flow
    updateProfile,
    updateEmail,
    // Helper methods (functions)
    isAuthenticated,
    isAdmin,
    isAgent,
    isTourist,
    hasRole,
    isVerified,
    getDisplayName,
    getUserInitials
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}