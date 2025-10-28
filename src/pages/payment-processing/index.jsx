import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TouristNavigation from '../../components/ui/TouristNavigation';
import BookingProgressIndicator from '../../components/ui/BookingProgressIndicator';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

// Import components
import BookingSummaryPanel from './components/BookingSummaryPanel';
import PaymentMethodSelector from './components/PaymentMethodSelector';
import CardPaymentForm from './components/CardPaymentForm';
import SecurityIndicators from './components/SecurityIndicators';
import AdditionalOptionsPanel from './components/AdditionalOptionsPanel';

const PaymentProcessing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Mock booking data
  const [bookingData, setBookingData] = useState({
    packageName: "Tropical Paradise Getaway",
    destination: "Maldives • 5 Days, 4 Nights",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    dates: {
      checkIn: "March 15, 2025",
      checkOut: "March 20, 2025"
    },
    guests: 2,
    duration: "5 Days, 4 Nights",
    pricing: {
      basePrice: 2800,
      serviceFees: 150,
      taxes: 280,
      discount: 0,
      insurance: 0,
      total: 3230
    },
    isDetailsExpanded: false
  });

  // Payment form state
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [cardFormData, setCardFormData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  // Additional options state
  const [travelInsurance, setTravelInsurance] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoCodeStatus, setPromoCodeStatus] = useState('');
  const [specialRequests, setSpecialRequests] = useState({
    category: '',
    details: ''
  });

  // UI state
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentPricing, setCurrentPricing] = useState(bookingData?.pricing);

  const availablePaymentMethods = ['card', 'paypal', 'apple_pay', 'google_pay'];

  useEffect(() => {
    // Calculate total pricing including insurance and discounts
    let newTotal = bookingData?.pricing?.basePrice + bookingData?.pricing?.serviceFees + bookingData?.pricing?.taxes;
    let discount = bookingData?.pricing?.discount;
    let insurance = travelInsurance ? travelInsurance?.price : 0;

    // Apply promo code discount
    if (promoCodeStatus === 'valid') {
      if (promoCode === 'SAVE10') {
        discount = Math.round(newTotal * 0.1);
      } else if (promoCode === 'WELCOME50') {
        discount = 50;
      } else if (promoCode === 'EARLY20') {
        discount = Math.round(newTotal * 0.2);
      }
    }

    newTotal = newTotal + insurance - discount;

    setCurrentPricing({
      ...bookingData?.pricing,
      insurance,
      discount,
      total: newTotal
    });
  }, [travelInsurance, promoCodeStatus, promoCode, bookingData?.pricing]);

  const handleBookingDetailsToggle = () => {
    setBookingData(prev => ({
      ...prev,
      isDetailsExpanded: !prev?.isDetailsExpanded
    }));
  };

  const handleCardFormChange = (field, value) => {
    setCardFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field-specific errors
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handlePromoCodeApply = () => {
    if (!promoCode) return;
    
    setPromoCodeStatus('applying');
    
    // Simulate API call
    setTimeout(() => {
      const validCodes = ['SAVE10', 'WELCOME50', 'EARLY20'];
      if (validCodes?.includes(promoCode)) {
        setPromoCodeStatus('valid');
      } else {
        setPromoCodeStatus('invalid');
      }
    }, 1000);
  };

  const validateCardForm = () => {
    const newErrors = {};
    
    if (!cardFormData?.cardNumber || cardFormData?.cardNumber?.replace(/\s/g, '')?.length < 13) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }
    
    if (!cardFormData?.expiryMonth) {
      newErrors.expiryMonth = 'Required';
    }
    
    if (!cardFormData?.expiryYear) {
      newErrors.expiryYear = 'Required';
    }
    
    if (!cardFormData?.cvv || cardFormData?.cvv?.length < 3) {
      newErrors.cvv = 'Please enter a valid CVV';
    }
    
    if (!cardFormData?.cardholderName?.trim()) {
      newErrors.cardholderName = 'Please enter the cardholder name';
    }
    
    if (!cardFormData?.billingAddress?.line1?.trim()) {
      newErrors.billingAddress = { ...newErrors?.billingAddress, line1: 'Address is required' };
    }
    
    if (!cardFormData?.billingAddress?.city?.trim()) {
      newErrors.billingAddress = { ...newErrors?.billingAddress, city: 'City is required' };
    }
    
    if (!cardFormData?.billingAddress?.state?.trim()) {
      newErrors.billingAddress = { ...newErrors?.billingAddress, state: 'State is required' };
    }
    
    if (!cardFormData?.billingAddress?.zipCode?.trim()) {
      newErrors.billingAddress = { ...newErrors?.billingAddress, zipCode: 'ZIP code is required' };
    }
    
    if (!cardFormData?.billingAddress?.country) {
      newErrors.billingAddress = { ...newErrors?.billingAddress, country: 'Country is required' };
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleStepClick = (stepNumber) => {
    // Handle step navigation logic here
    console.log('Navigate to step:', stepNumber);
  };

  const handlePayment = async () => {
    if (selectedPaymentMethod === 'card' && !validateCardForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Navigate to success page or tourist dashboard
      navigate('/tourist-dashboard', { 
        state: { 
          paymentSuccess: true,
          bookingId: 'TH' + Date.now(),
          amount: currentPricing?.total
        }
      });
    } catch (error) {
      console.error('Payment failed:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TouristNavigation />
      <main className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Indicator */}
          <BookingProgressIndicator 
            currentStep={3} 
            totalSteps={3}
            onStepClick={handleStepClick}
          />

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
              <button 
                onClick={() => navigate('/tour-package-details')}
                className="hover:text-foreground transition-tourism"
              >
                Package Details
              </button>
              <Icon name="ChevronRight" size={14} />
              <span className="text-foreground font-medium">Payment</span>
            </div>
            <h1 className="font-heading font-bold text-3xl text-foreground">Complete Your Booking</h1>
            <p className="text-muted-foreground mt-2">
              Secure payment processing for your tropical paradise getaway
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Payment Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Payment Method Selection */}
              <PaymentMethodSelector
                selectedMethod={selectedPaymentMethod}
                onMethodChange={setSelectedPaymentMethod}
                availableMethods={availablePaymentMethods}
              />

              {/* Card Payment Form */}
              {selectedPaymentMethod === 'card' && (
                <CardPaymentForm
                  formData={cardFormData}
                  onFormChange={handleCardFormChange}
                  errors={errors}
                />
              )}

              {/* Digital Wallet Message */}
              {['paypal', 'apple_pay', 'google_pay']?.includes(selectedPaymentMethod) && (
                <div className="bg-card border border-border rounded-lg shadow-tourism p-6">
                  <div className="flex items-center space-x-3">
                    <Icon name="Smartphone" size={24} className="text-primary" />
                    <div>
                      <h3 className="font-body font-semibold text-foreground">
                        {selectedPaymentMethod === 'paypal' ? 'PayPal' :
                         selectedPaymentMethod === 'apple_pay' ? 'Apple Pay' : 'Google Pay'} Payment
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        You'll be redirected to complete your payment securely.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Options */}
              <AdditionalOptionsPanel
                travelInsurance={travelInsurance}
                onInsuranceChange={setTravelInsurance}
                promoCode={promoCode}
                onPromoCodeChange={setPromoCode}
                onPromoCodeApply={handlePromoCodeApply}
                promoCodeStatus={promoCodeStatus}
                specialRequests={specialRequests}
                onSpecialRequestsChange={setSpecialRequests}
                pricing={currentPricing}
              />

              {/* Security Indicators */}
              <SecurityIndicators showDetailed={true} />
            </div>

            {/* Right Column - Booking Summary */}
            <div className="space-y-6">
              <BookingSummaryPanel
                bookingData={{
                  ...bookingData,
                  pricing: currentPricing
                }}
                onToggleDetails={handleBookingDetailsToggle}
              />

              {/* Payment Button */}
              <div className="sticky top-96">
                <Button
                  variant="default"
                  size="lg"
                  fullWidth
                  loading={isProcessing}
                  onClick={handlePayment}
                  iconName="CreditCard"
                  iconPosition="left"
                  className="mb-4"
                >
                  {isProcessing ? 'Processing Payment...' : `Pay $${currentPricing?.total?.toLocaleString()}`}
                </Button>

                <SecurityIndicators showDetailed={false} />

                <div className="mt-4 text-center">
                  <p className="text-xs text-muted-foreground">
                    By completing this purchase, you agree to our{' '}
                    <button className="text-primary hover:underline">Terms of Service</button>
                    {' '}and{' '}
                    <button className="text-primary hover:underline">Privacy Policy</button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentProcessing;