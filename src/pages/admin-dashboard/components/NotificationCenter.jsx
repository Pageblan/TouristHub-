import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationCenter = ({ notifications, title = "Notifications" }) => {
  const [filter, setFilter] = useState('all');

  const defaultNotifications = [
    {
      id: 1,
      type: 'support',
      title: 'Customer Support Request',
      message: 'User needs help with booking modification for trip to Thailand',
      timestamp: new Date(Date.now() - 600000),
      priority: 'high',
      unread: true,
      actionRequired: true
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment Processing Alert',
      message: 'Multiple failed payment attempts detected - possible fraud',
      timestamp: new Date(Date.now() - 1200000),
      priority: 'critical',
      unread: true,
      actionRequired: true
    },
    {
      id: 3,
      type: 'system',
      title: 'System Maintenance Scheduled',
      message: 'Scheduled maintenance window: Sept 16, 2024 02:00-04:00 UTC',
      timestamp: new Date(Date.now() - 3600000),
      priority: 'medium',
      unread: false,
      actionRequired: false
    },
    {
      id: 4,
      type: 'review',
      title: 'Negative Review Alert',
      message: 'New 2-star review requires response - "Maldives Paradise Resort"',
      timestamp: new Date(Date.now() - 7200000),
      priority: 'medium',
      unread: true,
      actionRequired: true
    },
    {
      id: 5,
      type: 'inventory',
      title: 'Low Inventory Warning',
      message: 'Only 3 spots remaining for "Northern Lights Iceland Tour"',
      timestamp: new Date(Date.now() - 10800000),
      priority: 'low',
      unread: false,
      actionRequired: false
    }
  ];

  const notificationData = notifications || defaultNotifications;

  const getTypeIcon = (type) => {
    const icons = {
      support: 'MessageCircle',
      payment: 'CreditCard',
      system: 'Server',
      review: 'Star',
      inventory: 'Package'
    };
    return icons?.[type] || 'Bell';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      critical: 'text-error bg-error/10 border-error/20',
      high: 'text-warning bg-warning/10 border-warning/20',
      medium: 'text-primary bg-primary/10 border-primary/20',
      low: 'text-muted-foreground bg-muted border-border'
    };
    return colors?.[priority] || colors?.medium;
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 60) return `${minutes}m ago`;
    return `${hours}h ago`;
  };

  const filteredNotifications = notificationData?.filter(notification => {
    if (filter === 'unread') return notification?.unread;
    if (filter === 'action') return notification?.actionRequired;
    return true;
  });

  const unreadCount = notificationData?.filter(n => n?.unread)?.length;
  const actionCount = notificationData?.filter(n => n?.actionRequired)?.length;

  return (
    <div className="bg-card border border-border rounded-lg shadow-tourism">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h3 className="font-heading text-lg font-semibold text-foreground">{title}</h3>
            {unreadCount > 0 && (
              <span className="bg-error text-error-foreground px-2 py-1 rounded-full text-xs font-mono">
                {unreadCount}
              </span>
            )}
          </div>
          <Button variant="ghost" size="sm" iconName="Settings">
            Settings
          </Button>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={filter === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All ({notificationData?.length})
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </Button>
          <Button
            variant={filter === 'action' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('action')}
          >
            Action ({actionCount})
          </Button>
        </div>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {filteredNotifications?.map((notification, index) => (
          <div 
            key={notification?.id}
            className={`p-4 hover:bg-muted/50 transition-tourism ${
              notification?.unread ? 'bg-primary/5' : ''
            } ${index !== filteredNotifications?.length - 1 ? 'border-b border-border' : ''}`}
          >
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-muted/50">
                <Icon 
                  name={getTypeIcon(notification?.type)} 
                  size={16} 
                  className="text-muted-foreground"
                  strokeWidth={2} 
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`font-body font-medium text-sm ${
                    notification?.unread ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {notification?.title}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-caption border ${getPriorityColor(notification?.priority)}`}>
                      {notification?.priority}
                    </span>
                    {notification?.unread && (
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {notification?.message}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-mono">
                    {formatTimestamp(notification?.timestamp)}
                  </span>
                  {notification?.actionRequired && (
                    <Button variant="outline" size="xs">
                      Take Action
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationCenter;