import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: "booking_confirmed",
      title: "Booking Confirmed",
      description: "Your Santorini trip has been confirmed",
      timestamp: "2025-09-14T10:30:00Z",
      icon: "CheckCircle",
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      id: 2,
      type: "payment_completed",
      title: "Payment Processed",
      description: "Payment of $2,850 completed successfully",
      timestamp: "2025-09-14T10:25:00Z",
      icon: "CreditCard",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      id: 3,
      type: "review_submitted",
      title: "Review Submitted",
      description: "Thank you for reviewing Paris City Tour",
      timestamp: "2025-09-13T16:45:00Z",
      icon: "Star",
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      id: 4,
      type: "wishlist_added",
      title: "Added to Wishlist",
      description: "Tokyo Cultural Experience saved to favorites",
      timestamp: "2025-09-12T14:20:00Z",
      icon: "Heart",
      color: "text-error",
      bgColor: "bg-error/10"
    },
    {
      id: 5,
      type: "profile_updated",
      title: "Profile Updated",
      description: "Travel preferences have been updated",
      timestamp: "2025-09-11T09:15:00Z",
      icon: "User",
      color: "text-muted-foreground",
      bgColor: "bg-muted"
    }
  ];

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-xl font-semibold text-foreground">Recent Activity</h2>
        <button className="text-primary hover:text-primary/80 font-body text-sm transition-tourism">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {activities?.map((activity, index) => (
          <div key={activity?.id} className="flex items-start space-x-3 group">
            <div className={`${activity?.bgColor} ${activity?.color} rounded-lg p-2 flex-shrink-0`}>
              <Icon name={activity?.icon} size={16} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-body font-medium text-foreground group-hover:text-primary transition-tourism">
                  {activity?.title}
                </h3>
                <span className="font-caption text-xs text-muted-foreground flex-shrink-0">
                  {formatTimestamp(activity?.timestamp)}
                </span>
              </div>
              <p className="font-body text-sm text-muted-foreground mt-1">
                {activity?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border text-center">
        <p className="font-caption text-sm text-muted-foreground">
          Stay updated with all your travel activities and bookings
        </p>
      </div>
    </div>
  );
};

export default RecentActivity;