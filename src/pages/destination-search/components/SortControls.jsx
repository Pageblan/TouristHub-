import React from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const SortControls = ({ 
  sortBy, 
  onSortChange, 
  viewMode, 
  onViewModeChange, 
  resultCount,
  onToggleFilters,
  onToggleMap 
}) => {
  const sortOptions = [
    { value: 'popularity', label: 'Most Popular' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'distance', label: 'Nearest First' },
    { value: 'newest', label: 'Newest First' }
  ];

  const viewModes = [
    { id: 'grid', icon: 'Grid3X3', label: 'Grid View' },
    { id: 'list', icon: 'List', label: 'List View' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg shadow-tourism p-4 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        {/* Left Section - Results Count */}
        <div className="flex items-center space-x-4">
          <div>
            <h2 className="font-heading font-semibold text-lg text-foreground">
              Search Results
            </h2>
            <p className="font-caption text-sm text-muted-foreground">
              {resultCount?.toLocaleString()} destinations found
            </p>
          </div>

          {/* Mobile Filter Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleFilters}
            iconName="Filter"
            iconPosition="left"
            className="md:hidden"
          >
            Filters
          </Button>
        </div>

        {/* Right Section - Controls */}
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          {/* Sort Dropdown */}
          <div className="flex-1 sm:flex-none sm:w-48">
            <Select
              placeholder="Sort by"
              options={sortOptions}
              value={sortBy}
              onChange={onSortChange}
              className="w-full"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center bg-muted rounded-lg p-1">
            {viewModes?.map((mode) => (
              <button
                key={mode?.id}
                onClick={() => onViewModeChange(mode?.id)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-md transition-tourism ${
                  viewMode === mode?.id
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title={mode?.label}
              >
                <Icon name={mode?.icon} size={16} />
                <span className="font-caption text-xs hidden lg:inline">{mode?.label?.split(' ')?.[0]}</span>
              </button>
            ))}
          </div>

          {/* Map Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleMap}
            iconName="Map"
            iconPosition="left"
            className="lg:hidden"
          >
            Map
          </Button>

          {/* Additional Actions */}
          <div className="hidden sm:flex items-center space-x-2">
            <button
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-tourism"
              title="Save Search"
            >
              <Icon name="Bookmark" size={18} />
            </button>
            <button
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-tourism"
              title="Share Results"
            >
              <Icon name="Share" size={18} />
            </button>
          </div>
        </div>
      </div>
      {/* Mobile View Mode Toggle */}
      <div className="sm:hidden mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="font-body font-medium text-sm text-foreground">View Mode</span>
          <div className="flex items-center bg-muted rounded-lg p-1">
            {viewModes?.map((mode) => (
              <button
                key={mode?.id}
                onClick={() => onViewModeChange(mode?.id)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-md transition-tourism ${
                  viewMode === mode?.id
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={mode?.icon} size={16} />
                <span className="font-caption text-xs">{mode?.label?.split(' ')?.[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortControls;