import React, { useState, useEffect } from 'react';
import DestinationCard from './DestinationCard';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DestinationGrid = ({ destinations, viewMode, loading, onLoadMore, hasMore }) => {
  const [visibleDestinations, setVisibleDestinations] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    setVisibleDestinations(12);
  }, [destinations]);

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    setVisibleDestinations(prev => prev + 12);
    setIsLoadingMore(false);
    if (onLoadMore) {
      onLoadMore();
    }
  };

  const SkeletonCard = () => (
    <div className="bg-card border border-border rounded-lg shadow-tourism overflow-hidden animate-pulse">
      <div className="h-48 bg-muted"></div>
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="h-5 bg-muted rounded w-32"></div>
            <div className="h-4 bg-muted rounded w-24"></div>
          </div>
          <div className="h-6 bg-muted rounded w-16"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {[...Array(5)]?.map((_, i) => (
              <div key={i} className="w-3 h-3 bg-muted rounded"></div>
            ))}
          </div>
          <div className="h-4 bg-muted rounded w-20"></div>
        </div>
        <div className="h-4 bg-muted rounded w-full"></div>
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="flex space-x-2">
          <div className="h-10 bg-muted rounded flex-1"></div>
          <div className="h-10 w-10 bg-muted rounded"></div>
          <div className="h-10 w-10 bg-muted rounded"></div>
        </div>
      </div>
    </div>
  );

  const ListCard = ({ destination }) => (
    <div className="bg-card border border-border rounded-lg shadow-tourism overflow-hidden hover:shadow-tourism-lg transition-all duration-300">
      <div className="flex">
        <div className="w-48 h-32 flex-shrink-0 overflow-hidden">
          <img
            src={destination?.image}
            alt={`${destination?.name}, ${destination?.country}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = '/assets/images/no_image.png';
            }}
          />
        </div>
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-heading font-semibold text-lg text-foreground hover:text-primary transition-tourism">
                  {destination?.name}
                </h3>
                <p className="font-caption text-sm text-muted-foreground flex items-center">
                  <Icon name="MapPin" size={14} className="mr-1" />
                  {destination?.country}
                </p>
              </div>
              <div className="text-right">
                <p className="font-heading font-bold text-lg text-primary">{destination?.priceRange}</p>
                <p className="font-caption text-xs text-muted-foreground">per person</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex items-center space-x-1">
                {[...Array(5)]?.map((_, i) => (
                  <Icon
                    key={i}
                    name="Star"
                    size={14}
                    className={i < Math.floor(destination?.rating) ? "text-warning fill-current" : "text-muted-foreground"}
                  />
                ))}
              </div>
              <span className="font-mono text-sm font-medium text-foreground">{destination?.rating}</span>
              <span className="font-caption text-sm text-muted-foreground">
                ({destination?.reviewCount?.toLocaleString()} reviews)
              </span>
            </div>
            
            <p className="font-body text-sm text-muted-foreground line-clamp-2">
              {destination?.description}
            </p>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-wrap gap-2">
              {destination?.activities?.slice(0, 2)?.map((activity, index) => (
                <span
                  key={index}
                  className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs font-caption"
                >
                  {activity}
                </span>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="default" size="sm">
                View Details
              </Button>
              <button className="p-2 border border-border rounded-lg hover:bg-muted transition-tourism">
                <Icon name="Heart" size={16} className="text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`grid gap-6 ${
        viewMode === 'grid' ?'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :'grid-cols-1'
      }`}>
        {[...Array(12)]?.map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (!destinations || destinations?.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Search" size={32} className="text-muted-foreground" />
        </div>
        <h3 className="font-heading font-semibold text-xl text-foreground mb-2">
          No destinations found
        </h3>
        <p className="font-body text-muted-foreground mb-6 max-w-md mx-auto">
          Try adjusting your search criteria or filters to find more destinations that match your preferences.
        </p>
        <Button variant="outline" iconName="RotateCcw" iconPosition="left">
          Clear Filters
        </Button>
      </div>
    );
  }

  const displayedDestinations = destinations?.slice(0, visibleDestinations);
  const showLoadMore = visibleDestinations < destinations?.length || hasMore;

  return (
    <div>
      {/* Results Grid/List */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' ?'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :'grid-cols-1'
      }`}>
        {displayedDestinations?.map((destination) => (
          viewMode === 'grid' ? (
            <DestinationCard key={destination?.id} destination={destination} />
          ) : (
            <ListCard key={destination?.id} destination={destination} />
          )
        ))}
      </div>
      {/* Load More Button */}
      {showLoadMore && (
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            onClick={handleLoadMore}
            loading={isLoadingMore}
            iconName="ChevronDown"
            iconPosition="right"
            className="px-8"
          >
            {isLoadingMore ? 'Loading...' : 'Load More Destinations'}
          </Button>
          <p className="font-caption text-sm text-muted-foreground mt-2">
            Showing {displayedDestinations?.length} of {destinations?.length}+ destinations
          </p>
        </div>
      )}
    </div>
  );
};

export default DestinationGrid;