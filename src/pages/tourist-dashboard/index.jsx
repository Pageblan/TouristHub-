import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import TouristNavigation from '../../components/ui/TouristNavigation';
import WelcomeHeader from './components/WelcomeHeader';
import QuickStats from './components/QuickStats';
import UpcomingBookings from './components/UpcomingBookings';
import QuickActions from './components/QuickActions';
import PersonalizedRecommendations from './components/PersonalizedRecommendations';
import RecentActivity from './components/RecentActivity';
import WeatherWidget from './components/WeatherWidget';
import { bookingService } from '../../services/bookingService';
import { tourPackageService } from '../../services/tourPackageService';
import { wishlistService } from '../../services/wishlistService';

const TouristDashboard = () => {
  const { user, userProfile, loading: authLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    bookings: [],
    recommendations: [],
    wishlistCount: 0,
    stats: {
      totalBookings: 0,
      upcomingTrips: 0,
      completedTrips: 0,
      totalSpent: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      loadDashboardData();
    }
  }, [user, authLoading]);

  const loadDashboardData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Load bookings
      const bookingsResult = await bookingService?.getUserBookings(user?.id);
      const bookings = bookingsResult?.success ? bookingsResult?.data : [];

      // Load wishlist count
      const wishlistResult = await wishlistService?.getWishlistCount(user?.id);
      const wishlistCount = wishlistResult?.success ? wishlistResult?.data : 0;

      // Load recommendations (featured packages)
      const recommendationsResult = await tourPackageService?.getFeaturedTourPackages(4);
      const recommendations = recommendationsResult?.success ? recommendationsResult?.data : [];

      // Calculate stats
      const totalBookings = bookings?.length || 0;
      const upcomingTrips = bookings?.filter(b => 
        b?.status === 'confirmed' && new Date(b?.departure_date) > new Date()
      )?.length || 0;
      const completedTrips = bookings?.filter(b => b?.status === 'completed')?.length || 0;
      const totalSpent = bookings
        ?.filter(b => b?.status === 'confirmed' || b?.status === 'completed')
        ?.reduce((sum, b) => sum + (parseFloat(b?.total_amount) || 0), 0) || 0;

      setDashboardData({
        bookings: bookings?.slice(0, 3), // Show only recent 3 bookings
        recommendations,
        wishlistCount,
        stats: {
          totalBookings,
          upcomingTrips,
          completedTrips,
          totalSpent
        }
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <TouristNavigation />
        <main className="pt-20 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TouristNavigation />
      <main className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Header */}
          <WelcomeHeader user={userProfile || user} />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
            {/* Quick Stats */}
            <div className="lg:col-span-3">
              <QuickStats stats={dashboardData?.stats} />
            </div>
            
            {/* Weather Widget */}
            <div className="lg:col-span-1">
              <WeatherWidget />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Upcoming Bookings */}
              <UpcomingBookings bookings={dashboardData?.bookings} />
              
              {/* Personalized Recommendations */}
              <PersonalizedRecommendations 
                recommendations={dashboardData?.recommendations} 
              />
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              {/* Quick Actions */}
              <QuickActions wishlistCount={dashboardData?.wishlistCount} />
              
              {/* Recent Activity */}
              <RecentActivity bookings={dashboardData?.bookings} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TouristDashboard;