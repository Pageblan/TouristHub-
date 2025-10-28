import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStats = () => {
  const stats = [
    {
      id: 1,
      title: "Loyalty Points",
      value: "2,450",
      icon: "Star",
      color: "text-warning",
      bgColor: "bg-warning/10",
      change: "+120 this month"
    },
    {
      id: 2,
      title: "Saved Favorites",
      value: "18",
      icon: "Heart",
      color: "text-error",
      bgColor: "bg-error/10",
      change: "3 new destinations"
    },
    {
      id: 3,
      title: "Completed Trips",
      value: "7",
      icon: "CheckCircle",
      color: "text-success",
      bgColor: "bg-success/10",
      change: "Last trip: Bali"
    },
    {
      id: 4,
      title: "Upcoming Bookings",
      value: "2",
      icon: "Calendar",
      color: "text-primary",
      bgColor: "bg-primary/10",
      change: "Next: Dec 20"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats?.map((stat) => (
        <div key={stat?.id} className="bg-card border border-border rounded-lg p-4 hover:shadow-tourism transition-tourism">
          <div className="flex items-center justify-between mb-3">
            <div className={`${stat?.bgColor} ${stat?.color} rounded-lg p-2`}>
              <Icon name={stat?.icon} size={20} />
            </div>
            <span className="font-mono text-2xl font-bold text-foreground">{stat?.value}</span>
          </div>
          <h3 className="font-body font-medium text-foreground mb-1">{stat?.title}</h3>
          <p className="font-caption text-xs text-muted-foreground">{stat?.change}</p>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;