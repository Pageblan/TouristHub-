import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, value, change, changeType, icon, trend, period = "vs last month" }) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-error';
    return 'text-muted-foreground';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return 'TrendingUp';
    if (changeType === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-tourism hover:shadow-tourism-lg transition-tourism">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Icon name={icon} size={24} className="text-primary" strokeWidth={2} />
        </div>
        {trend && (
          <div className="flex items-center space-x-1">
            <Icon name={getChangeIcon()} size={16} className={getChangeColor()} />
            <span className={`text-sm font-mono ${getChangeColor()}`}>
              {Math.abs(change)}%
            </span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="font-body text-sm text-muted-foreground">{title}</h3>
        <p className="font-heading text-2xl font-bold text-foreground">{value}</p>
        {change !== undefined && (
          <p className="text-xs text-muted-foreground">
            <span className={getChangeColor()}>
              {changeType === 'positive' ? '+' : changeType === 'negative' ? '-' : ''}
              {Math.abs(change)}%
            </span>
            {' '}{period}
          </p>
        )}
      </div>
    </div>
  );
};

export default MetricsCard;