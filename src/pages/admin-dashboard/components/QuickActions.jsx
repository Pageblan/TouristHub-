import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = ({ actions, title = "Quick Actions" }) => {
  const defaultActions = [
    {
      id: 1,
      title: 'Manage Content',
      description: 'Update destinations and packages',
      icon: 'FileText',
      path: '/content-management',
      color: 'bg-primary/10 text-primary',
      count: 12
    },
    {
      id: 2,
      title: 'User Management',
      description: 'View and manage user accounts',
      icon: 'Users',
      path: '/admin-dashboard',
      color: 'bg-accent/10 text-accent',
      count: 1247
    },
    {
      id: 3,
      title: 'Booking Overview',
      description: 'Monitor active bookings',
      icon: 'Calendar',
      path: '/admin-dashboard',
      color: 'bg-success/10 text-success',
      count: 89
    },
    {
      id: 4,
      title: 'System Settings',
      description: 'Configure platform settings',
      icon: 'Settings',
      path: '/admin-dashboard',
      color: 'bg-warning/10 text-warning',
      count: 3
    }
  ];

  const actionData = actions || defaultActions;

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-tourism">
      <h3 className="font-heading text-lg font-semibold text-foreground mb-4">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actionData?.map((action) => (
          <Link
            key={action?.id}
            to={action?.path}
            className="group p-4 border border-border rounded-lg hover:border-primary/30 hover:shadow-tourism transition-tourism"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${action?.color}`}>
                <Icon name={action?.icon} size={20} strokeWidth={2} />
              </div>
              {action?.count && (
                <span className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs font-mono">
                  {action?.count}
                </span>
              )}
            </div>
            
            <h4 className="font-body font-medium text-foreground group-hover:text-primary transition-tourism mb-1">
              {action?.title}
            </h4>
            <p className="text-sm text-muted-foreground">
              {action?.description}
            </p>
          </Link>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <Button 
          variant="outline" 
          fullWidth 
          iconName="Plus" 
          iconPosition="left"
        >
          Create New Action
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;