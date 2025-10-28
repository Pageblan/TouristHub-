import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const UpcomingBookings = () => {
  const upcomingBookings = [
    {
      id: "BK001",
      destination: "Santorini, Greece",
      packageName: "Mediterranean Paradise - 5 Days",
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=250&fit=crop",
      startDate: "2025-12-20",
      endDate: "2025-12-25",
      status: "confirmed",
      totalAmount: 2850,
      travelers: 2,
      hotelName: "Sunset Villa Resort",
      checkInTime: "15:00",
      specialRequests: "Sea view room requested"
    },
    {
      id: "BK002",
      destination: "Tokyo, Japan",
      packageName: "Cultural Discovery - 7 Days",
      image: "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?w=400&h=250&fit=crop",
      startDate: "2026-02-14",
      endDate: "2026-02-21",
      status: "pending",
      totalAmount: 3200,
      travelers: 1,
      hotelName: "Tokyo Grand Hotel",
      checkInTime: "14:00",
      specialRequests: "Vegetarian meals"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-success bg-success/10 border-success/20';
      case 'pending':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'cancelled':
        return 'text-error bg-error/10 border-error/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntil = (dateString) => {
    const today = new Date();
    const bookingDate = new Date(dateString);
    const diffTime = bookingDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-xl font-semibold text-foreground">Upcoming Bookings</h2>
        <Link 
          to="/destination-search" 
          className="text-primary hover:text-primary/80 font-body text-sm transition-tourism"
        >
          Book New Trip
        </Link>
      </div>
      {upcomingBookings?.length === 0 ? (
        <div className="text-center py-8">
          <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Icon name="Calendar" size={24} className="text-muted-foreground" />
          </div>
          <h3 className="font-body font-medium text-foreground mb-2">No upcoming bookings</h3>
          <p className="text-muted-foreground mb-4">Start planning your next adventure!</p>
          <Link to="/destination-search">
            <Button variant="default" iconName="Plus" iconPosition="left">
              Explore Destinations
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {upcomingBookings?.map((booking) => (
            <div key={booking?.id} className="border border-border rounded-lg p-4 hover:shadow-tourism transition-tourism">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Image */}
                <div className="w-full lg:w-48 h-32 overflow-hidden rounded-lg flex-shrink-0">
                  <Image 
                    src={booking?.image} 
                    alt={booking?.destination}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-heading font-semibold text-lg text-foreground mb-1">
                        {booking?.destination}
                      </h3>
                      <p className="font-body text-muted-foreground">{booking?.packageName}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking?.status)}`}>
                      {booking?.status?.charAt(0)?.toUpperCase() + booking?.status?.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <Icon name="Calendar" size={16} className="text-muted-foreground" />
                        <span className="font-body text-foreground">
                          {formatDate(booking?.startDate)} - {formatDate(booking?.endDate)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Icon name="Users" size={16} className="text-muted-foreground" />
                        <span className="font-body text-foreground">
                          {booking?.travelers} {booking?.travelers === 1 ? 'Traveler' : 'Travelers'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Icon name="MapPin" size={16} className="text-muted-foreground" />
                        <span className="font-body text-foreground">{booking?.hotelName}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <Icon name="Clock" size={16} className="text-muted-foreground" />
                        <span className="font-body text-foreground">Check-in: {booking?.checkInTime}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Icon name="DollarSign" size={16} className="text-muted-foreground" />
                        <span className="font-body text-foreground font-semibold">
                          ${booking?.totalAmount?.toLocaleString()}
                        </span>
                      </div>
                      {getDaysUntil(booking?.startDate) > 0 && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Icon name="Timer" size={16} className="text-primary" />
                          <span className="font-body text-primary font-medium">
                            {getDaysUntil(booking?.startDate)} days to go
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" iconName="Eye" iconPosition="left">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" iconName="Edit" iconPosition="left">
                      Modify
                    </Button>
                    <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
                      E-Ticket
                    </Button>
                    {booking?.status === 'confirmed' && getDaysUntil(booking?.startDate) <= 1 && (
                      <Button variant="default" size="sm" iconName="CheckCircle" iconPosition="left">
                        Check In
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingBookings;