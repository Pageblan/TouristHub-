import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';

const SearchFilters = ({ filters, onFiltersChange, onClearFilters, isVisible, onToggle }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const destinationTypes = [
    { value: 'beach', label: 'Beach' },
    { value: 'mountain', label: 'Mountain' },
    { value: 'city', label: 'City' },
    { value: 'countryside', label: 'Countryside' },
    { value: 'desert', label: 'Desert' },
    { value: 'island', label: 'Island' }
  ];

  const budgetRanges = [
    { value: '0-500', label: 'Under $500' },
    { value: '500-1000', label: '$500 - $1,000' },
    { value: '1000-2000', label: '$1,000 - $2,000' },
    { value: '2000-5000', label: '$2,000 - $5,000' },
    { value: '5000+', label: 'Above $5,000' }
  ];

  const activities = [
    'Adventure Sports',
    'Cultural Tours',
    'Wildlife Safari',
    'Water Sports',
    'Photography',
    'Food & Wine',
    'Spa & Wellness',
    'Shopping'
  ];

  const accommodationRatings = [
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4+ Stars' },
    { value: '3', label: '3+ Stars' },
    { value: '2', label: '2+ Stars' }
  ];

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleActivityToggle = (activity) => {
    const currentActivities = localFilters?.activities || [];
    const updatedActivities = currentActivities?.includes(activity)
      ? currentActivities?.filter(a => a !== activity)
      : [...currentActivities, activity];
    
    handleFilterChange('activities', updatedActivities);
  };

  const handleClearAll = () => {
    const clearedFilters = {
      destinationType: '',
      budgetRange: '',
      activities: [],
      accommodationRating: '',
      duration: ''
    };
    setLocalFilters(clearedFilters);
    onClearFilters();
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-semibold text-lg text-foreground">Filters</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
          <button
            onClick={onToggle}
            className="md:hidden p-1 text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={20} />
          </button>
        </div>
      </div>

      {/* Destination Type */}
      <div>
        <Select
          label="Destination Type"
          placeholder="Select destination type"
          options={destinationTypes}
          value={localFilters?.destinationType || ''}
          onChange={(value) => handleFilterChange('destinationType', value)}
          className="w-full"
        />
      </div>

      {/* Budget Range */}
      <div>
        <Select
          label="Budget Range"
          placeholder="Select budget range"
          options={budgetRanges}
          value={localFilters?.budgetRange || ''}
          onChange={(value) => handleFilterChange('budgetRange', value)}
          className="w-full"
        />
      </div>

      {/* Duration */}
      <div>
        <Input
          label="Duration (Days)"
          type="number"
          placeholder="Enter number of days"
          value={localFilters?.duration || ''}
          onChange={(e) => handleFilterChange('duration', e?.target?.value)}
          min="1"
          max="30"
        />
      </div>

      {/* Activities */}
      <div>
        <label className="block font-body font-medium text-sm text-foreground mb-3">
          Activities
        </label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {activities?.map((activity) => (
            <Checkbox
              key={activity}
              label={activity}
              checked={(localFilters?.activities || [])?.includes(activity)}
              onChange={() => handleActivityToggle(activity)}
            />
          ))}
        </div>
      </div>

      {/* Accommodation Rating */}
      <div>
        <Select
          label="Accommodation Rating"
          placeholder="Select minimum rating"
          options={accommodationRatings}
          value={localFilters?.accommodationRating || ''}
          onChange={(value) => handleFilterChange('accommodationRating', value)}
          className="w-full"
        />
      </div>

      {/* Results Count */}
      <div className="pt-4 border-t border-border">
        <p className="font-caption text-sm text-muted-foreground">
          Showing 24 destinations matching your criteria
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-80 bg-card border border-border rounded-lg shadow-tourism p-6 h-fit sticky top-24">
        <FilterContent />
      </div>
      {/* Mobile Overlay */}
      {isVisible && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={onToggle}>
          <div 
            className="absolute right-0 top-0 h-full w-80 bg-card shadow-tourism-lg overflow-y-auto"
            onClick={(e) => e?.stopPropagation()}
          >
            <div className="p-6">
              <FilterContent />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchFilters;