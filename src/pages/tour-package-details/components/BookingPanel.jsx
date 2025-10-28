import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

import Select from '../../../components/ui/Select';

const BookingPanel = ({ packageData }) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('');
  const [groupSize, setGroupSize] = useState(2);
  const [roomType, setRoomType] = useState('');
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  const roomOptions = [
    { value: 'single', label: 'Single Room (+$50/night)' },
    { value: 'double', label: 'Double Room (Included)' },
    { value: 'suite', label: 'Suite (+$150/night)' }
  ];

  const availableDates = [
    { value: '2024-10-15', label: 'October 15, 2024' },
    { value: '2024-10-22', label: 'October 22, 2024' },
    { value: '2024-10-29', label: 'October 29, 2024' },
    { value: '2024-11-05', label: 'November 5, 2024' },
    { value: '2024-11-12', label: 'November 12, 2024' }
  ];

  const calculateTotalPrice = () => {
    let basePrice = packageData?.price * groupSize;
    
    if (roomType === 'single') {
      basePrice += 50 * parseInt(packageData?.duration) * groupSize;
    } else if (roomType === 'suite') {
      basePrice += 150 * parseInt(packageData?.duration) * groupSize;
    }
    
    return basePrice;
  };

  const handleBookNow = () => {
    if (!selectedDate || !roomType) {
      alert('Please select a date and room type');
      return;
    }
    
    // Navigate to payment processing with booking details
    navigate('/payment-processing', {
      state: {
        packageData,
        bookingDetails: {
          date: selectedDate,
          groupSize,
          roomType,
          totalPrice: calculateTotalPrice()
        }
      }
    });
  };

  const checkAvailability = async () => {
    setIsCheckingAvailability(true);
    // Mock availability check
    setTimeout(() => {
      setIsCheckingAvailability(false);
    }, 1500);
  };

  return (
    <div className="sticky top-24 bg-card border border-border rounded-lg shadow-tourism-lg p-6 space-y-6">
      <div className="text-center border-b border-border pb-4">
        <h3 className="font-heading font-semibold text-xl text-foreground mb-2">
          Book This Package
        </h3>
        <div className="flex items-center justify-center space-x-2">
          <Icon name="Shield" size={16} className="text-success" />
          <span className="text-sm text-success font-medium">Instant Confirmation</span>
        </div>
      </div>
      {/* Date Selection */}
      <div>
        <Select
          label="Select Date"
          placeholder="Choose your travel date"
          options={availableDates}
          value={selectedDate}
          onChange={setSelectedDate}
          required
        />
      </div>
      {/* Group Size */}
      <div>
        <label className="block font-body font-medium text-foreground mb-2">
          Group Size
        </label>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setGroupSize(Math.max(1, groupSize - 1))}
            className="w-10 h-10 border border-border rounded-lg flex items-center justify-center hover:bg-muted transition-tourism"
          >
            <Icon name="Minus" size={16} />
          </button>
          <span className="font-mono font-semibold text-lg w-12 text-center">
            {groupSize}
          </span>
          <button
            onClick={() => setGroupSize(Math.min(20, groupSize + 1))}
            className="w-10 h-10 border border-border rounded-lg flex items-center justify-center hover:bg-muted transition-tourism"
          >
            <Icon name="Plus" size={16} />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Maximum 20 people per booking
        </p>
      </div>
      {/* Room Type */}
      <div>
        <Select
          label="Room Type"
          placeholder="Select accommodation"
          options={roomOptions}
          value={roomType}
          onChange={setRoomType}
          required
        />
      </div>
      {/* Price Breakdown */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Base price ({groupSize} × ${packageData?.price})</span>
          <span>${packageData?.price * groupSize}</span>
        </div>
        
        {roomType === 'single' && (
          <div className="flex justify-between text-sm">
            <span>Single room upgrade</span>
            <span>+${50 * parseInt(packageData?.duration) * groupSize}</span>
          </div>
        )}
        
        {roomType === 'suite' && (
          <div className="flex justify-between text-sm">
            <span>Suite upgrade</span>
            <span>+${150 * parseInt(packageData?.duration) * groupSize}</span>
          </div>
        )}
        
        <div className="border-t border-border pt-2 flex justify-between font-semibold">
          <span>Total</span>
          <span className="text-primary">${calculateTotalPrice()}</span>
        </div>
      </div>
      {/* Availability Check */}
      <Button
        variant="outline"
        fullWidth
        onClick={checkAvailability}
        loading={isCheckingAvailability}
        iconName="Calendar"
      >
        Check Availability
      </Button>
      {/* Book Now Button */}
      <Button
        variant="default"
        fullWidth
        onClick={handleBookNow}
        iconName="CreditCard"
        size="lg"
      >
        Book Now - ${calculateTotalPrice()}
      </Button>
      {/* Trust Signals */}
      <div className="space-y-3 pt-4 border-t border-border">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Shield" size={16} className="text-success" />
          <span>Free cancellation up to 24 hours</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Clock" size={16} className="text-primary" />
          <span>Instant booking confirmation</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Phone" size={16} className="text-accent" />
          <span>24/7 customer support</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Award" size={16} className="text-warning" />
          <span>Best price guarantee</span>
        </div>
      </div>
      {/* Contact Info */}
      <div className="text-center pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground mb-2">Need help?</p>
        <Button variant="ghost" size="sm" iconName="Phone">
          Call +1 (555) 123-4567
        </Button>
      </div>
    </div>
  );
};

export default BookingPanel;