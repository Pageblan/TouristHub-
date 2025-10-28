import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';

const TouristNavigation = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userProfile, signOut, isAdmin } = useAuth();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navigationItems = [
    {
      name: 'Discover',
      path: '/destination-search',
      icon: 'Search',
      description: 'Find destinations'
    },
    {
      name: 'My Trips',
      path: '/tourist-dashboard',
      icon: 'MapPin',
      description: 'Manage bookings'
    }
  ];

  const isActivePath = (path) => {
    if (path === '/destination-search') {
      return location?.pathname === '/destination-search' || location?.pathname === '/tour-package-details';
    }
    return location?.pathname === path;
  };

  const handleLogout = async () => {
    await signOut();
    setShowProfileMenu(false);
  };

  const Logo = () => (
    <Link to="/tourist-dashboard" className="flex items-center space-x-2 transition-tourism hover:opacity-80">
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <Icon name="Compass" size={20} color="white" strokeWidth={2.5} />
      </div>
      <span className="font-heading font-bold text-xl text-foreground">TourismHub</span>
    </Link>
  );

  const ProfileMenu = () => (
    <div className="relative">
      <button 
        onClick={() => setShowProfileMenu(!showProfileMenu)}
        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-tourism"
      >
        <Icon name="User" size={20} />
      </button>
      
      {showProfileMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowProfileMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-50">
            <div className="p-4 border-b border-border">
              <p className="font-semibold text-foreground">{userProfile?.full_name || user?.user_metadata?.full_name || 'User'}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              {isAdmin() && (
                <span className="inline-block mt-2 px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                  Admin
                </span>
              )}
            </div>
            <div className="py-2">
              {/* Admin Dashboard Link - Only for admins */}
              {isAdmin() && (
                <button
                  onClick={() => {
                    navigate('/admin-dashboard');
                    setShowProfileMenu(false);
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-foreground hover:bg-muted transition-tourism"
                >
                  <Icon name="LayoutDashboard" size={16} />
                  <span>Admin Dashboard</span>
                  <Icon name="Shield" size={14} className="ml-auto text-primary" />
                </button>
              )}
              <Link
                to="/profile"
                className="flex items-center space-x-2 px-4 py-2 text-foreground hover:bg-muted transition-tourism"
                onClick={() => setShowProfileMenu(false)}
              >
                <Icon name="User" size={16} />
                <span>My Profile</span>
              </Link>
              <Link
                to="/settings"
                className="flex items-center space-x-2 px-4 py-2 text-foreground hover:bg-muted transition-tourism"
                onClick={() => setShowProfileMenu(false)}
              >
                <Icon name="Settings" size={16} />
                <span>Settings</span>
              </Link>
            </div>
            <div className="border-t border-border py-2">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 w-full px-4 py-2 text-destructive hover:bg-destructive/10 transition-tourism"
              >
                <Icon name="LogOut" size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-sm">
          <div className="px-4 py-3 flex items-center justify-between">
            <Logo />
            <div className="flex items-center space-x-2">
              {/* Admin Dashboard Button - Mobile */}
              {isAdmin() && (
                <button
                  onClick={() => navigate('/admin-dashboard')}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium transition-tourism hover:bg-primary/20"
                >
                  <Icon name="Shield" size={16} />
                  <span>Admin</span>
                </button>
              )}
              <ProfileMenu />
            </div>
          </div>
        </header>

        {/* Spacer for fixed header */}
        <div className="h-14" />

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg safe-area-bottom">
          <div className="flex items-center justify-around py-3 px-2">
            {navigationItems?.map((item) => (
              <Link
                key={item?.name}
                to={item?.path}
                className={`flex flex-col items-center py-2 px-4 rounded-lg transition-tourism min-w-[70px] ${
                  isActivePath(item?.path)
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon 
                  name={item?.icon} 
                  size={22} 
                  strokeWidth={isActivePath(item?.path) ? 2.5 : 2}
                />
                <span className="text-xs font-caption mt-1.5 font-medium">{item?.name}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Spacer for fixed bottom nav */}
        <div className="h-20" />
      </>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-tourism">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Logo />
          
          <nav className="flex items-center space-x-8">
            {navigationItems?.map((item) => (
              <Link
                key={item?.name}
                to={item?.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-body font-medium transition-tourism ${
                  isActivePath(item?.path)
                    ? 'text-primary bg-primary/10 shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon 
                  name={item?.icon} 
                  size={18} 
                  strokeWidth={isActivePath(item?.path) ? 2.5 : 2}
                />
                <span>{item?.name}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {/* Admin Dashboard Button - Desktop */}
            {isAdmin() && (
              <button
                onClick={() => navigate('/admin-dashboard')}
                className="flex items-center space-x-2 px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium transition-tourism hover:bg-primary/20 hover:shadow-sm"
              >
                <Icon name="LayoutDashboard" size={18} />
                <span>Admin Dashboard</span>
              </button>
            )}
            <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-tourism">
              <Icon name="Bell" size={20} />
            </button>
            <ProfileMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TouristNavigation;