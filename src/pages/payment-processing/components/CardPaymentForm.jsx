import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CardPaymentForm = ({ formData, onFormChange, errors }) => {
  const [cardType, setCardType] = useState('');

  const detectCardType = (number) => {
    const cleaned = number?.replace(/\s/g, '');
    if (cleaned?.startsWith('4')) return 'visa';
    if (cleaned?.startsWith('5') || cleaned?.startsWith('2')) return 'mastercard';
    if (cleaned?.startsWith('3')) return 'amex';
    return '';
  };

  const formatCardNumber = (value) => {
    const cleaned = value?.replace(/\s/g, '');
    const type = detectCardType(cleaned);
    setCardType(type);
    
    let formatted = cleaned;
    if (type === 'amex') {
      formatted = cleaned?.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
    } else {
      formatted = cleaned?.replace(/(\d{4})(?=\d)/g, '$1 ');
    }
    
    return formatted;
  };

  const handleCardNumberChange = (e) => {
    let formatted = formatCardNumber(e?.target?.value);
    onFormChange('cardNumber', formatted);
  };

  const handleExpiryChange = (e) => {
    let value = e?.target?.value?.replace(/\D/g, '');
    if (value?.length >= 2) {
      value = value?.substring(0, 2) + '/' + value?.substring(2, 4);
    }
    onFormChange('expiry', value);
  };

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1)?.padStart(2, '0'),
    label: String(i + 1)?.padStart(2, '0')
  }));

  const currentYear = new Date()?.getFullYear();
  const yearOptions = Array.from({ length: 20 }, (_, i) => ({
    value: String(currentYear + i),
    label: String(currentYear + i)
  }));

  const countryOptions = [
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'AU', label: 'Australia' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'JP', label: 'Japan' },
    { value: 'IN', label: 'India' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg shadow-tourism p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="CreditCard" size={20} className="text-primary" />
        <h3 className="font-heading font-semibold text-lg text-foreground">Card Information</h3>
        <div className="flex items-center space-x-1 ml-auto">
          <Icon name="Shield" size={16} className="text-success" />
          <span className="text-xs font-caption text-success">Secure</span>
        </div>
      </div>
      <div className="space-y-4">
        {/* Card Number */}
        <div className="relative">
          <Input
            label="Card Number"
            type="text"
            placeholder="1234 5678 9012 3456"
            value={formData?.cardNumber}
            onChange={handleCardNumberChange}
            error={errors?.cardNumber}
            maxLength={cardType === 'amex' ? 17 : 19}
            required
          />
          {cardType && (
            <div className="absolute right-3 top-9 flex items-center">
              <div className={`w-8 h-5 rounded text-xs font-bold flex items-center justify-center ${
                cardType === 'visa' ? 'bg-blue-600 text-white' :
                cardType === 'mastercard' ? 'bg-red-600 text-white' :
                cardType === 'amex' ? 'bg-blue-800 text-white' : ''
              }`}>
                {cardType === 'visa' ? 'VISA' :
                 cardType === 'mastercard' ? 'MC' :
                 cardType === 'amex' ? 'AMEX' : ''}
              </div>
            </div>
          )}
        </div>

        {/* Expiry and CVV */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Expiry Month"
            options={monthOptions}
            value={formData?.expiryMonth}
            onChange={(value) => onFormChange('expiryMonth', value)}
            placeholder="MM"
            error={errors?.expiryMonth}
            required
          />
          
          <Select
            label="Expiry Year"
            options={yearOptions}
            value={formData?.expiryYear}
            onChange={(value) => onFormChange('expiryYear', value)}
            placeholder="YYYY"
            error={errors?.expiryYear}
            required
          />

          <div className="relative">
            <Input
              label="CVV"
              type="text"
              placeholder="123"
              value={formData?.cvv}
              onChange={(e) => onFormChange('cvv', e?.target?.value?.replace(/\D/g, ''))}
              error={errors?.cvv}
              maxLength={cardType === 'amex' ? 4 : 3}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
              title="CVV is the 3-digit security code on the back of your card"
            >
              <Icon name="HelpCircle" size={16} />
            </button>
          </div>
        </div>

        {/* Cardholder Name */}
        <Input
          label="Cardholder Name"
          type="text"
          placeholder="John Doe"
          value={formData?.cardholderName}
          onChange={(e) => onFormChange('cardholderName', e?.target?.value)}
          error={errors?.cardholderName}
          required
        />

        {/* Billing Address */}
        <div className="pt-4 border-t border-border">
          <h4 className="font-body font-medium text-foreground mb-4">Billing Address</h4>
          
          <div className="space-y-4">
            <Input
              label="Address Line 1"
              type="text"
              placeholder="123 Main Street"
              value={formData?.billingAddress?.line1}
              onChange={(e) => onFormChange('billingAddress', { ...formData?.billingAddress, line1: e?.target?.value })}
              error={errors?.billingAddress?.line1}
              required
            />

            <Input
              label="Address Line 2 (Optional)"
              type="text"
              placeholder="Apartment, suite, etc."
              value={formData?.billingAddress?.line2}
              onChange={(e) => onFormChange('billingAddress', { ...formData?.billingAddress, line2: e?.target?.value })}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="City"
                type="text"
                placeholder="New York"
                value={formData?.billingAddress?.city}
                onChange={(e) => onFormChange('billingAddress', { ...formData?.billingAddress, city: e?.target?.value })}
                error={errors?.billingAddress?.city}
                required
              />

              <Input
                label="State/Province"
                type="text"
                placeholder="NY"
                value={formData?.billingAddress?.state}
                onChange={(e) => onFormChange('billingAddress', { ...formData?.billingAddress, state: e?.target?.value })}
                error={errors?.billingAddress?.state}
                required
              />

              <Input
                label="ZIP/Postal Code"
                type="text"
                placeholder="10001"
                value={formData?.billingAddress?.zipCode}
                onChange={(e) => onFormChange('billingAddress', { ...formData?.billingAddress, zipCode: e?.target?.value })}
                error={errors?.billingAddress?.zipCode}
                required
              />
            </div>

            <Select
              label="Country"
              options={countryOptions}
              value={formData?.billingAddress?.country}
              onChange={(value) => onFormChange('billingAddress', { ...formData?.billingAddress, country: value })}
              placeholder="Select country"
              error={errors?.billingAddress?.country}
              searchable
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPaymentForm;