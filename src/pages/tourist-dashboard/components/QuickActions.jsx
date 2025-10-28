import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const quickActions = [
    {
      id: 1,
      title: "Search Destinations",
      description: "Discover amazing places to visit",
      icon: "Search",
      color: "text-primary",
      bgColor: "bg-primary/10",
      link: "/destination-search",
      featured: true
    },
    {
      id: 2,
      title: "Book Hotels",
      description: "Find perfect accommodations",
      icon: "Building",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      link: "/destination-search",
      featured: false
    },
    {
      id: 3,
      title: "Flight Search",
      description: "Compare and book flights",
      icon: "Plane",
      color: "text-accent",
      bgColor: "bg-accent/10",
      link: "/destination-search",
      featured: false
    },
    {
      id: 4,
      title: "Activities & Tours",
      description: "Book unique experiences",
      icon: "Camera",
      color: "text-success",
      bgColor: "bg-success/10",
      link: "/destination-search",
      featured: false
    },
    {
      id: 5,
      title: "Travel Insurance",
      description: "Protect your journey",
      icon: "Shield",
      color: "text-warning",
      bgColor: "bg-warning/10",
      link: "/destination-search",
      featured: false
    },
    {
      id: 6,
      title: "Car Rentals",
      description: "Rent vehicles worldwide",
      icon: "Car",
      color: "text-error",
      bgColor: "bg-error/10",
      link: "/destination-search",
      featured: false
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions?.map((action) => (
          <Link key={action?.id} to={action?.link} className="group">
            <div className={`p-4 rounded-lg border border-border hover:shadow-tourism transition-tourism ${
              action?.featured ? 'ring-2 ring-primary/20 bg-primary/5' : 'hover:border-primary/30'
            }`}>
              <div className="flex items-center space-x-3 mb-3">
                <div className={`${action?.bgColor} ${action?.color} rounded-lg p-2 group-hover:scale-110 transition-transform`}>
                  <Icon name={action?.icon} size={20} />
                </div>
                {action?.featured && (
                  <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                    Popular
                  </span>
                )}
              </div>
              <h3 className="font-body font-semibold text-foreground mb-1 group-hover:text-primary transition-tourism">
                {action?.title}
              </h3>
              <p className="font-caption text-sm text-muted-foreground">{action?.description}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/destination-search" className="flex-1">
            <Button variant="default" fullWidth iconName="MapPin" iconPosition="left">
              Explore All Destinations
            </Button>
          </Link>
          <Button variant="outline" iconName="Phone" iconPosition="left">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;