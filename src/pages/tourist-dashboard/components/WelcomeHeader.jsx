import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WelcomeHeader = () => {
  const { user, userProfile, profileLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're currently on admin dashboard
  const isOnAdminDashboard = location.pathname === '/admin-dashboard' || location.pathname === '/';

  const getCurrentGreeting = () => {
    const hour = new Date()?.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Get user name from profile or user metadata
  const getUserName = () => {
    if (profileLoading) return "...";
    
    // Try different sources for the name
    const name = 
      userProfile?.full_name || 
      userProfile?.name ||
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      user?.email?.split('@')[0] || // Use email username as fallback
      "Friend";
    
    return name;
  };

  // Get user role for display
  const getUserRole = () => {
    return userProfile?.role || user?.user_metadata?.role || 'tourist';
  };

  const userName = getUserName();
  const userRole = getUserRole();

  return (
    <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl p-6 mb-6 shadow-tourism">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="font-heading text-2xl font-bold">
              {getCurrentGreeting()}, {userName}!
            </h1>
            {/* Role Badge */}
            <span className="bg-primary-foreground/20 px-3 py-1 rounded-full text-xs font-medium capitalize">
              {userRole}
            </span>
          </div>
          <p className="font-body text-primary-foreground/90">
            {userRole === 'admin' 
              ? "Manage your tourism platform and oversee all operations."
              : userRole === 'agent'
              ? "Help travelers discover and book amazing experiences."
              : "Ready for your next adventure? Let's explore amazing destinations together."
            }
          </p>
        </div>
        
        {/* Icon Section with Admin Button */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Admin Dashboard Button - Only show for admins */}
          {isAdmin() && !isOnAdminDashboard && (
            <Button
              variant="secondary"
              onClick={() => navigate('/admin-dashboard')}
              className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-primary-foreground/30"
            >
              <Icon name="LayoutDashboard" size={18} className="mr-2" />
              Admin Dashboard
            </Button>
          )}
          
          {/* Back to Tourist Dashboard - Show when admin is on admin dashboard */}
          {isAdmin() && isOnAdminDashboard && (
            <Button
              variant="secondary"
              onClick={() => navigate('/tourist-dashboard')}
              className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-primary-foreground/30"
            >
              <Icon name="User" size={18} className="mr-2" />
              Tourist View
            </Button>
          )}

          {/* Profile Image or Role Icon */}
          {userProfile?.profile_image ? (
            <img 
              src={userProfile.profile_image} 
              alt="Profile" 
              className="w-14 h-14 rounded-full object-cover border-2 border-primary-foreground/30 shadow-lg"
            />
          ) : (
            <div className="bg-primary-foreground/20 rounded-lg p-3 backdrop-blur-sm">
              {userRole === 'admin' ? (
                <Icon name="Shield" size={28} color="currentColor" />
              ) : userRole === 'agent' ? (
                <Icon name="Briefcase" size={28} color="currentColor" />
              ) : (
                <Icon name="MapPin" size={28} color="currentColor" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Optional: Add quick stats or info */}
      {user?.email && (
        <div className="mt-4 pt-4 border-t border-primary-foreground/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-wrap items-center gap-4 text-sm text-primary-foreground/80">
              <div className="flex items-center space-x-2">
                <Icon name="Mail" size={16} color="currentColor" />
                <span className="font-body">{user.email}</span>
              </div>
              
              {userProfile?.nationality && (
                <div className="flex items-center space-x-2">
                  <Icon name="Globe" size={16} color="currentColor" />
                  <span className="font-body">{userProfile.nationality}</span>
                </div>
              )}
              
              {userProfile?.location && (
                <div className="flex items-center space-x-2">
                  <Icon name="MapPin" size={16} color="currentColor" />
                  <span className="font-body">{userProfile.location}</span>
                </div>
              )}
            </div>

            {/* Mobile Admin Dashboard Button */}
            {isAdmin() && (
              <div className="sm:hidden">
                {!isOnAdminDashboard ? (
                  <button
                    onClick={() => navigate('/admin-dashboard')}
                    className="flex items-center space-x-2 bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Icon name="LayoutDashboard" size={16} />
                    <span>Admin</span>
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/tourist-dashboard')}
                    className="flex items-center space-x-2 bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Icon name="User" size={16} />
                    <span>Tourist View</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeHeader;