import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const BookingSummaryPanel = ({ bookingData, onToggleDetails }) => {
  const {
    packageName,
    destination,
    image,
    dates,
    guests,
    duration,
    pricing,
    isDetailsExpanded
  } = bookingData;

  return (
    <div className="bg-card border border-border rounded-lg shadow-tourism p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-semibold text-lg text-foreground">Booking Summary</h3>
        <button
          onClick={onToggleDetails}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-tourism"
        >
          <Icon name={isDetailsExpanded ? "ChevronUp" : "ChevronDown"} size={20} />
        </button>
      </div>
      {/* Package Overview */}
      <div className="flex space-x-4 mb-6">
        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={image}
            alt={packageName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h4 className="font-body font-semibold text-foreground mb-1">{packageName}</h4>
          <p className="text-sm text-muted-foreground mb-2">{destination}</p>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Calendar" size={14} />
              <span>{duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Users" size={14} />
              <span>{guests} guests</span>
            </div>
          </div>
        </div>
      </div>
      {/* Expanded Details */}
      {isDetailsExpanded && (
        <div className="border-t border-border pt-4 mb-6 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Check-in:</span>
            <span className="font-body font-medium text-foreground">{dates?.checkIn}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Check-out:</span>
            <span className="font-body font-medium text-foreground">{dates?.checkOut}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Room type:</span>
            <span className="font-body font-medium text-foreground">Deluxe Ocean View</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Meal plan:</span>
            <span className="font-body font-medium text-foreground">All Inclusive</span>
          </div>
        </div>
      )}
      {/* Pricing Breakdown */}
      <div className="border-t border-border pt-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Package price ({guests} guests)</span>
          <span className="font-mono text-foreground">${pricing?.basePrice?.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Service fees</span>
          <span className="font-mono text-foreground">${pricing?.serviceFees?.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Taxes & fees</span>
          <span className="font-mono text-foreground">${pricing?.taxes?.toLocaleString()}</span>
        </div>
        {pricing?.discount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-success">Early bird discount</span>
            <span className="font-mono text-success">-${pricing?.discount?.toLocaleString()}</span>
          </div>
        )}
        <div className="border-t border-border pt-3 flex items-center justify-between">
          <span className="font-body font-semibold text-foreground">Total Amount</span>
          <span className="font-heading font-bold text-xl text-primary">
            ${pricing?.total?.toLocaleString()}
          </span>
        </div>
      </div>
      {/* Cancellation Policy */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-body font-medium text-sm text-foreground mb-1">Cancellation Policy</p>
            <p className="text-xs text-muted-foreground">
              Free cancellation until 48 hours before check-in. After that, 50% of the total amount will be charged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummaryPanel;