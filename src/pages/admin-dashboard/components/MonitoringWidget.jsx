import React from 'react';
import Icon from '../../../components/AppIcon';

const MonitoringWidget = ({ widgets, title = "System Monitoring" }) => {
  const defaultWidgets = [
    {
      id: 1,
      title: 'System Performance',
      value: '99.8%',
      status: 'excellent',
      icon: 'Activity',
      description: 'Uptime last 30 days',
      trend: '+0.2%'
    },
    {
      id: 2,
      title: 'Payment Processing',
      value: '98.5%',
      status: 'good',
      icon: 'CreditCard',
      description: 'Success rate today',
      trend: '-0.3%'
    },
    {
      id: 3,
      title: 'Customer Satisfaction',
      value: '4.7/5',
      status: 'excellent',
      icon: 'Heart',
      description: 'Average rating',
      trend: '+0.1'
    },
    {
      id: 4,
      title: 'Response Time',
      value: '1.2s',
      status: 'warning',
      icon: 'Clock',
      description: 'Average API response',
      trend: '+0.3s'
    }
  ];

  const widgetData = widgets || defaultWidgets;

  const getStatusColor = (status) => {
    const colors = {
      excellent: 'text-success bg-success/10 border-success/20',
      good: 'text-primary bg-primary/10 border-primary/20',
      warning: 'text-warning bg-warning/10 border-warning/20',
      critical: 'text-error bg-error/10 border-error/20'
    };
    return colors?.[status] || colors?.good;
  };

  const getStatusIcon = (status) => {
    const icons = {
      excellent: 'CheckCircle',
      good: 'Circle',
      warning: 'AlertTriangle',
      critical: 'XCircle'
    };
    return icons?.[status] || 'Circle';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-tourism">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading text-lg font-semibold text-foreground">{title}</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground font-mono">Live</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {widgetData?.map((widget) => (
          <div 
            key={widget?.id}
            className="p-4 border border-border rounded-lg hover:border-primary/30 transition-tourism"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Icon 
                  name={widget?.icon} 
                  size={18} 
                  className="text-muted-foreground" 
                  strokeWidth={2} 
                />
                <h4 className="font-body font-medium text-sm text-foreground">
                  {widget?.title}
                </h4>
              </div>
              <div className={`p-1 rounded-full border ${getStatusColor(widget?.status)}`}>
                <Icon 
                  name={getStatusIcon(widget?.status)} 
                  size={12} 
                  strokeWidth={2} 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="font-heading text-xl font-bold text-foreground">
                  {widget?.value}
                </span>
                <span className={`text-xs font-mono ${
                  widget?.trend?.startsWith('+') && widget?.status === 'excellent' 
                    ? 'text-success' : widget?.trend?.startsWith('+') 
                    ? 'text-warning' :'text-error'
                }`}>
                  {widget?.trend}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {widget?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Last updated:</span>
          <span className="font-mono text-foreground">
            {new Date()?.toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MonitoringWidget;