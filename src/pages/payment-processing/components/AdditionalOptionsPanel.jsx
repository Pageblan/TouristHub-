import React from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

import Select from '../../../components/ui/Select';

const AdditionalOptionsPanel = ({ 
  travelInsurance, 
  onInsuranceChange, 
  promoCode, 
  onPromoCodeChange, 
  onPromoCodeApply,
  promoCodeStatus,
  specialRequests,
  onSpecialRequestsChange,
  pricing
}) => {
  const insuranceOptions = [
    {
      id: 'basic',
      name: 'Basic Travel Insurance',
      price: 89,
      coverage: ['Trip cancellation up to $5,000', 'Medical emergency coverage', '24/7 travel assistance'],
      popular: false
    },
    {
      id: 'comprehensive',
      name: 'Comprehensive Travel Insurance',
      price: 149,
      coverage: ['Trip cancellation up to $10,000', 'Medical emergency coverage', 'Baggage protection', 'Flight delay compensation', '24/7 travel assistance'],
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium Travel Insurance',
      price: 229,
      coverage: ['Trip cancellation up to $25,000', 'Comprehensive medical coverage', 'Baggage protection', 'Flight delay compensation', 'Adventure sports coverage', 'Cancel for any reason', '24/7 travel assistance'],
      popular: false
    }
  ];

  const requestCategories = [
    { value: 'dietary', label: 'Dietary Requirements' },
    { value: 'accessibility', label: 'Accessibility Needs' },
    { value: 'celebration', label: 'Special Celebration' },
    { value: 'room', label: 'Room Preferences' },
    { value: 'transport', label: 'Transportation' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="space-y-6">
      {/* Travel Insurance */}
      <div className="bg-card border border-border rounded-lg shadow-tourism p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Shield" size={20} className="text-primary" />
          <h3 className="font-heading font-semibold text-lg text-foreground">Travel Insurance</h3>
          <span className="text-xs font-caption text-muted-foreground bg-muted px-2 py-1 rounded">Optional</span>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          Protect your trip investment with comprehensive travel insurance coverage.
        </p>

        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-tourism"
               onClick={() => onInsuranceChange(null)}>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              !travelInsurance ? 'border-primary bg-primary' : 'border-muted-foreground'
            }`}>
              {!travelInsurance && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
            <div className="flex-1">
              <p className="font-body font-medium text-foreground">No Insurance</p>
              <p className="text-sm text-muted-foreground">I don't need travel insurance</p>
            </div>
            <span className="font-mono text-foreground">$0</span>
          </div>

          {insuranceOptions?.map((option) => (
            <div
              key={option?.id}
              className={`relative p-4 border rounded-lg cursor-pointer transition-tourism ${
                travelInsurance?.id === option?.id
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
              }`}
              onClick={() => onInsuranceChange(option)}
            >
              {option?.popular && (
                <div className="absolute -top-2 left-4 bg-accent text-accent-foreground text-xs font-caption px-2 py-1 rounded">
                  Most Popular
                </div>
              )}
              
              <div className="flex items-start space-x-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                  travelInsurance?.id === option?.id ? 'border-primary bg-primary' : 'border-muted-foreground'
                }`}>
                  {travelInsurance?.id === option?.id && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-body font-medium text-foreground">{option?.name}</p>
                    <span className="font-mono font-semibold text-foreground">${option?.price}</span>
                  </div>
                  
                  <ul className="space-y-1">
                    {option?.coverage?.map((item, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Icon name="Check" size={14} className="text-success flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Promo Code */}
      <div className="bg-card border border-border rounded-lg shadow-tourism p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Tag" size={20} className="text-primary" />
          <h3 className="font-heading font-semibold text-lg text-foreground">Promo Code</h3>
        </div>

        <div className="flex space-x-3">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => onPromoCodeChange(e?.target?.value?.toUpperCase())}
              error={promoCodeStatus === 'invalid' ? 'Invalid promo code' : ''}
            />
          </div>
          <button
            onClick={onPromoCodeApply}
            disabled={!promoCode || promoCodeStatus === 'applying'}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-body font-medium transition-tourism hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {promoCodeStatus === 'applying' ? 'Applying...' : 'Apply'}
          </button>
        </div>

        {promoCodeStatus === 'valid' && (
          <div className="mt-3 flex items-center space-x-2 text-success">
            <Icon name="CheckCircle" size={16} />
            <span className="text-sm font-body">Promo code applied! You saved ${pricing?.discount}</span>
          </div>
        )}

        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Available codes:</strong> SAVE10 (10% off), WELCOME50 ($50 off), EARLY20 (20% off early bookings)
          </p>
        </div>
      </div>
      {/* Special Requests */}
      <div className="bg-card border border-border rounded-lg shadow-tourism p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="MessageSquare" size={20} className="text-primary" />
          <h3 className="font-heading font-semibold text-lg text-foreground">Special Requests</h3>
          <span className="text-xs font-caption text-muted-foreground bg-muted px-2 py-1 rounded">Optional</span>
        </div>

        <div className="space-y-4">
          <Select
            label="Request Category"
            options={requestCategories}
            value={specialRequests?.category}
            onChange={(value) => onSpecialRequestsChange({ ...specialRequests, category: value })}
            placeholder="Select category"
          />

          <div>
            <label className="block text-sm font-body font-medium text-foreground mb-2">
              Details
            </label>
            <textarea
              className="w-full p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent transition-tourism"
              rows={4}
              placeholder="Please describe your special requirements or requests..."
              value={specialRequests?.details}
              onChange={(e) => onSpecialRequestsChange({ ...specialRequests, details: e?.target?.value })}
            />
            <p className="text-xs text-muted-foreground mt-1">
              We'll do our best to accommodate your requests, though some may incur additional charges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalOptionsPanel;