import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeed = ({ activities, title = "Recent Activity" }) => {
  const defaultActivities = [
    {
      id: 1,
      type: 'booking',
      title: 'New booking confirmed',
      description: 'Sarah Johnson booked "Bali Adventure Package" for 4 guests',
      timestamp: new Date(Date.now() - 300000),
      priority: 'normal',
      icon: 'Calendar',
      iconColor: 'text-success'
    },
    {
      id: 2,
      type: 'user',
      title: 'New user registration',
      description: 'Michael Chen registered from New York, USA',
      timestamp: new Date(Date.now() - 900000),
      priority: 'low',
      icon: 'UserPlus',
      iconColor: 'text-primary'
    },
    {
      id: 3,
      type: 'payment',
      title: 'Payment issue detected',
      description: 'Failed payment for booking #TB-2024-0892 - requires attention',
      timestamp: new Date(Date.now() - 1800000),
      priority: 'high',
      icon: 'AlertTriangle',
      iconColor: 'text-warning'
    },
    {
      id: 4,
      type: 'cancellation',
      title: 'Booking cancelled',
      description: 'Emma Wilson cancelled "Tokyo City Tour" - refund processed',
      timestamp: new Date(Date.now() - 3600000),
      priority: 'normal',
      icon: 'X',
      iconColor: 'text-error'
    },
    {
      id: 5,
      type: 'review',
      title: 'New 5-star review',
      description: 'David Martinez left excellent review for "Swiss Alps Trek"',
      timestamp: new Date(Date.now() - 7200000),
      priority: 'low',
      icon: 'Star',
      iconColor: 'text-accent'
    }
  ];

  const activityData = activities || defaultActivities;

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      high: 'bg-error/10 text-error border-error/20',
      normal: 'bg-primary/10 text-primary border-primary/20',
      low: 'bg-muted text-muted-foreground border-border'
    };
    return badges?.[priority] || badges?.normal;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-tourism">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold text-foreground">{title}</h3>
          <button className="text-primary hover:text-primary/80 font-body text-sm transition-tourism">
            View All
          </button>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {activityData?.map((activity, index) => (
          <div 
            key={activity?.id} 
            className={`p-4 hover:bg-muted/50 transition-tourism ${
              index !== activityData?.length - 1 ? 'border-b border-border' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg bg-muted/50 ${activity?.iconColor}`}>
                <Icon name={activity?.icon} size={16} strokeWidth={2} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-body font-medium text-sm text-foreground truncate">
                    {activity?.title}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-caption border ${getPriorityBadge(activity?.priority)}`}>
                    {activity?.priority}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {activity?.description}
                </p>
                
                <span className="text-xs text-muted-foreground font-mono">
                  {formatTimestamp(activity?.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;