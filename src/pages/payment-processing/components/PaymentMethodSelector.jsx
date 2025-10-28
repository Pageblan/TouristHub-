import React from 'react';
import Icon from '../../../components/AppIcon';


const PaymentMethodSelector = ({ selectedMethod, onMethodChange, availableMethods }) => {
  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, American Express',
      icon: 'CreditCard',
      enabled: availableMethods?.includes('card')
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay with your PayPal account',
      icon: 'Wallet',
      enabled: availableMethods?.includes('paypal')
    },
    {
      id: 'apple_pay',
      name: 'Apple Pay',
      description: 'Touch ID or Face ID required',
      icon: 'Smartphone',
      enabled: availableMethods?.includes('apple_pay')
    },
    {
      id: 'google_pay',
      name: 'Google Pay',
      description: 'Pay with Google',
      icon: 'Smartphone',
      enabled: availableMethods?.includes('google_pay')
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      description: 'Direct bank account transfer',
      icon: 'Building2',
      enabled: availableMethods?.includes('bank_transfer')
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg shadow-tourism p-6">
      <h3 className="font-heading font-semibold text-lg text-foreground mb-4">Payment Method</h3>
      <div className="space-y-3">
        {paymentMethods?.map((method) => (
          <div
            key={method?.id}
            className={`relative border rounded-lg p-4 cursor-pointer transition-tourism ${
              method?.enabled 
                ? selectedMethod === method?.id
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border hover:border-primary/50 hover:bg-muted/50' :'border-border bg-muted/30 cursor-not-allowed opacity-60'
            }`}
            onClick={() => method?.enabled && onMethodChange(method?.id)}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedMethod === method?.id && method?.enabled
                  ? 'border-primary bg-primary' :'border-muted-foreground'
              }`}>
                {selectedMethod === method?.id && method?.enabled && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              
              <div className="flex items-center space-x-3 flex-1">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  method?.enabled ? 'bg-muted' : 'bg-muted/50'
                }`}>
                  <Icon 
                    name={method?.icon} 
                    size={20} 
                    className={method?.enabled ? 'text-foreground' : 'text-muted-foreground'} 
                  />
                </div>
                
                <div className="flex-1">
                  <p className={`font-body font-medium ${
                    method?.enabled ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {method?.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{method?.description}</p>
                </div>
              </div>

              {!method?.enabled && (
                <span className="text-xs font-caption text-muted-foreground bg-muted px-2 py-1 rounded">
                  Coming Soon
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Digital Wallet Quick Access */}
      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-sm text-muted-foreground mb-3">Quick Payment Options</p>
        <div className="flex space-x-3">
          {['paypal', 'apple_pay', 'google_pay']?.map((methodId) => {
            const method = paymentMethods?.find(m => m?.id === methodId);
            if (!method?.enabled) return null;
            
            return (
              <button
                key={methodId}
                onClick={() => onMethodChange(methodId)}
                className={`flex-1 p-3 border rounded-lg transition-tourism ${
                  selectedMethod === methodId
                    ? 'border-primary bg-primary/5 text-primary' :'border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={method?.icon} size={24} className="mx-auto" />
                <p className="text-xs font-caption mt-1">{method?.name}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;