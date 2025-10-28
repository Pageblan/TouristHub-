import React from 'react';
import Icon from '../AppIcon';

const BookingProgressIndicator = ({ currentStep = 1, totalSteps = 3, onStepClick }) => {
  const steps = [
    {
      id: 1,
      title: 'Package Details',
      description: 'Review tour information',
      icon: 'MapPin'
    },
    {
      id: 2,
      title: 'Booking Info',
      description: 'Enter travel details',
      icon: 'Calendar'
    },
    {
      id: 3,
      title: 'Payment',
      description: 'Complete purchase',
      icon: 'CreditCard'
    }
  ];

  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  const getStepClasses = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-success-foreground border-success';
      case 'current':
        return 'bg-primary text-primary-foreground border-primary shadow-tourism';
      case 'upcoming':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getConnectorClasses = (stepId) => {
    return stepId < currentStep ? 'bg-success' : 'bg-border';
  };

  return (
    <div className="sticky top-20 z-30 bg-card border border-border rounded-lg shadow-tourism p-4 mb-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-semibold text-lg text-foreground">Booking Progress</h3>
        <span className="font-mono text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between relative">
          {steps?.map((step, index) => {
            const status = getStepStatus(step?.id);
            const isClickable = onStepClick && step?.id <= currentStep;
            
            return (
              <div key={step?.id} className="flex flex-col items-center flex-1 relative">
                {/* Connector Line */}
                {index < steps?.length - 1 && (
                  <div className="absolute top-6 left-1/2 w-full h-0.5 -translate-y-1/2 z-0">
                    <div className={`h-full transition-tourism ${getConnectorClasses(step?.id)}`} />
                  </div>
                )}
                {/* Step Circle */}
                <button
                  onClick={isClickable ? () => onStepClick(step?.id) : undefined}
                  disabled={!isClickable}
                  className={`relative z-10 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-tourism ${
                    getStepClasses(status)
                  } ${isClickable ? 'hover:scale-105 cursor-pointer' : 'cursor-default'}`}
                >
                  {status === 'completed' ? (
                    <Icon name="Check" size={20} strokeWidth={2.5} />
                  ) : (
                    <Icon name={step?.icon} size={20} strokeWidth={2} />
                  )}
                </button>
                {/* Step Info */}
                <div className="mt-3 text-center max-w-24">
                  <p className={`font-body font-medium text-sm ${
                    status === 'current' ? 'text-primary' : 
                    status === 'completed' ? 'text-success' : 'text-muted-foreground'
                  }`}>
                    {step?.title}
                  </p>
                  <p className="font-caption text-xs text-muted-foreground mt-1 hidden sm:block">
                    {step?.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Progress Bar */}
      <div className="mt-6">
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingProgressIndicator;