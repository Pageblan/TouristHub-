import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const SearchBar = ({ onSearch, searchQuery, onSearchQueryChange }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(2);
  const [showGuestSelector, setShowGuestSelector] = useState(false);
  const searchRef = useRef(null);
  const guestRef = useRef(null);

  const suggestions = [
    { id: 1, name: 'Paris, France', type: 'City', icon: 'MapPin' },
    { id: 2, name: 'Bali, Indonesia', type: 'Island', icon: 'Palmtree' },
    { id: 3, name: 'Tokyo, Japan', type: 'City', icon: 'Building' },
    { id: 4, name: 'Santorini, Greece', type: 'Island', icon: 'Sun' },
    { id: 5, name: 'Swiss Alps, Switzerland', type: 'Mountain', icon: 'Mountain' },
    { id: 6, name: 'Maldives', type: 'Beach', icon: 'Waves' }
  ];

  const filteredSuggestions = suggestions?.filter(suggestion =>
    suggestion?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef?.current && !searchRef?.current?.contains(event?.target)) {
        setShowSuggestions(false);
      }
      if (guestRef?.current && !guestRef?.current?.contains(event?.target)) {
        setShowGuestSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    const searchData = {
      destination: searchQuery,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: guests
    };
    onSearch(searchData);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    onSearchQueryChange(suggestion?.name);
    setShowSuggestions(false);
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter') {
      handleSearch();
    }
  };

  const adjustGuests = (increment) => {
    const newCount = guests + increment;
    if (newCount >= 1 && newCount <= 20) {
      setGuests(newCount);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-tourism p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Destination Search */}
        <div className="relative" ref={searchRef}>
          <div className="relative">
            <Input
              label="Where to?"
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => {
                onSearchQueryChange(e?.target?.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyPress={handleKeyPress}
              className="pr-10"
            />
            <Icon 
              name="Search" 
              size={20} 
              className="absolute right-3 top-9 text-muted-foreground pointer-events-none"
            />
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && searchQuery && filteredSuggestions?.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-card border border-border rounded-lg shadow-tourism-lg max-h-64 overflow-y-auto">
              {filteredSuggestions?.map((suggestion) => (
                <button
                  key={suggestion?.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-muted transition-tourism"
                >
                  <Icon name={suggestion?.icon} size={18} className="text-muted-foreground" />
                  <div>
                    <p className="font-body font-medium text-foreground">{suggestion?.name}</p>
                    <p className="font-caption text-xs text-muted-foreground">{suggestion?.type}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Check-in Date */}
        <div>
          <Input
            label="Check-in"
            type="date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e?.target?.value)}
            min={new Date()?.toISOString()?.split('T')?.[0]}
          />
        </div>

        {/* Check-out Date */}
        <div>
          <Input
            label="Check-out"
            type="date"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e?.target?.value)}
            min={checkInDate || new Date()?.toISOString()?.split('T')?.[0]}
          />
        </div>

        {/* Guests Selector */}
        <div className="relative" ref={guestRef}>
          <label className="block font-body font-medium text-sm text-foreground mb-2">
            Guests
          </label>
          <button
            onClick={() => setShowGuestSelector(!showGuestSelector)}
            className="w-full flex items-center justify-between px-3 py-2 border border-border rounded-lg bg-input text-foreground hover:bg-muted transition-tourism"
          >
            <span className="font-body">{guests} {guests === 1 ? 'Guest' : 'Guests'}</span>
            <Icon name="ChevronDown" size={16} />
          </button>

          {/* Guest Count Selector */}
          {showGuestSelector && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-card border border-border rounded-lg shadow-tourism-lg p-4">
              <div className="flex items-center justify-between">
                <span className="font-body text-foreground">Guests</span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => adjustGuests(-1)}
                    disabled={guests <= 1}
                    className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-tourism"
                  >
                    <Icon name="Minus" size={14} />
                  </button>
                  <span className="font-mono font-medium text-foreground w-8 text-center">{guests}</span>
                  <button
                    onClick={() => adjustGuests(1)}
                    disabled={guests >= 20}
                    className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-tourism"
                  >
                    <Icon name="Plus" size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Search Button */}
      <div className="mt-6 flex justify-center">
        <Button
          onClick={handleSearch}
          iconName="Search"
          iconPosition="left"
          size="lg"
          className="px-8"
        >
          Search Destinations
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;