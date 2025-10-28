import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityIndicators = ({ showDetailed = false }) => {
  const securityFeatures = [
    {
      icon: 'Shield',
      title: '256-bit SSL Encryption',
      description: 'Your payment information is encrypted and secure',
      color: 'text-success'
    },
    {
      icon: 'Lock',
      title: 'PCI DSS Compliant',
      description: 'We meet the highest security standards',
      color: 'text-primary'
    },
    {
      icon: 'CheckCircle',
      title: 'Verified Secure',
      description: 'Trusted by thousands of travelers worldwide',
      color: 'text-success'
    }
  ];

  const trustBadges = [
    { name: 'SSL Secured', icon: 'Shield' },
    { name: 'PCI Compliant', icon: 'Lock' },
    { name: 'Verified', icon: 'CheckCircle' }
  ];

  if (!showDetailed) {
    return (
      <div className="flex items-center justify-center space-x-6 py-4 bg-muted/30 rounded-lg">
        {trustBadges?.map((badge, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Icon name={badge?.icon} size={16} className="text-success" />
            <span className="text-xs font-caption text-muted-foreground">{badge?.name}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-tourism p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Shield" size={20} className="text-success" />
        <h3 className="font-heading font-semibold text-lg text-foreground">Secure Payment</h3>
      </div>
      <div className="space-y-4">
        {securityFeatures?.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3">
            <Icon name={feature?.icon} size={20} className={feature?.color} />
            <div>
              <p className="font-body font-medium text-foreground">{feature?.title}</p>
              <p className="text-sm text-muted-foreground">{feature?.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Payment processed by:</span>
          <span className="font-body font-medium text-foreground">TourismHub Secure</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Your payment information is never stored on our servers and is processed through industry-leading secure payment gateways.
        </p>
      </div>
      {/* Security Certifications */}
      <div className="mt-4 flex items-center justify-center space-x-4 py-3 bg-muted/30 rounded-lg">
        <div className="flex items-center space-x-1">
          <Icon name="Shield" size={14} className="text-success" />
          <span className="text-xs font-mono text-success">SSL</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center space-x-1">
          <Icon name="Lock" size={14} className="text-primary" />
          <span className="text-xs font-mono text-primary">PCI DSS</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center space-x-1">
          <Icon name="CheckCircle" size={14} className="text-success" />
          <span className="text-xs font-mono text-success">VERIFIED</span>
        </div>
      </div>
    </div>
  );
};

export default SecurityIndicators;