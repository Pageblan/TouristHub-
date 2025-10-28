import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InteractiveMap = ({ destinations, selectedDestination, onDestinationSelect, isVisible, onToggle }) => {
  const [mapCenter] = useState({ lat: 20.0, lng: 0.0 });
  const [zoomLevel] = useState(2);

  const handleMarkerClick = (destination) => {
    onDestinationSelect(destination);
  };

  const MapContent = () => (
    <div className="h-full relative">
      {/* Map Header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
        <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2">
          <h3 className="font-heading font-semibold text-foreground">Map View</h3>
          <p className="font-caption text-xs text-muted-foreground">
            {destinations?.length} destinations found
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location?.reload()}
            iconName="RotateCcw"
            className="bg-card/90 backdrop-blur-sm"
          >
            Reset
          </Button>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 bg-card/90 backdrop-blur-sm border border-border rounded-lg hover:bg-muted transition-tourism"
          >
            <Icon name="X" size={20} />
          </button>
        </div>
      </div>

      {/* Google Maps Iframe */}
      <iframe
        width="100%"
        height="100%"
        loading="lazy"
        title="Destinations Map"
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps?q=${mapCenter?.lat},${mapCenter?.lng}&z=${zoomLevel}&output=embed`}
        className="rounded-lg"
      />

      {/* Map Markers Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {destinations?.slice(0, 6)?.map((destination, index) => (
          <button
            key={destination?.id}
            onClick={() => handleMarkerClick(destination)}
            className={`absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
              selectedDestination?.id === destination?.id
                ? 'scale-125 z-20' :'hover:scale-110 z-10'
            }`}
            style={{
              left: `${20 + (index % 3) * 30}%`,
              top: `${30 + Math.floor(index / 3) * 25}%`
            }}
          >
            <div className={`relative ${
              selectedDestination?.id === destination?.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-foreground hover:bg-primary hover:text-primary-foreground'
            } border-2 border-white rounded-full p-2 shadow-tourism-lg transition-tourism`}>
              <Icon name="MapPin" size={16} />
              
              {/* Price Badge */}
              <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-caption font-medium px-1.5 py-0.5 rounded-full">
                {destination?.priceRange?.split(' ')?.[0]}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Selected Destination Info */}
      {selectedDestination && (
        <div className="absolute bottom-4 left-4 right-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-tourism-lg">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={selectedDestination?.image}
                alt={selectedDestination?.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/assets/images/no_image.png';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-heading font-semibold text-foreground truncate">
                {selectedDestination?.name}
              </h4>
              <p className="font-caption text-sm text-muted-foreground flex items-center">
                <Icon name="MapPin" size={12} className="mr-1" />
                {selectedDestination?.country}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={12} className="text-warning fill-current" />
                  <span className="font-mono text-xs text-foreground">{selectedDestination?.rating}</span>
                </div>
                <span className="font-heading font-bold text-sm text-primary">
                  {selectedDestination?.priceRange}
                </span>
              </div>
            </div>
            <Button
              variant="default"
              size="sm"
              onClick={() => window.open('/tour-package-details', '_blank')}
            >
              View
            </Button>
          </div>
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute bottom-20 right-4 flex flex-col space-y-2">
        <button className="p-2 bg-card/90 backdrop-blur-sm border border-border rounded-lg hover:bg-muted transition-tourism">
          <Icon name="Plus" size={16} />
        </button>
        <button className="p-2 bg-card/90 backdrop-blur-sm border border-border rounded-lg hover:bg-muted transition-tourism">
          <Icon name="Minus" size={16} />
        </button>
        <button className="p-2 bg-card/90 backdrop-blur-sm border border-border rounded-lg hover:bg-muted transition-tourism">
          <Icon name="Locate" size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Map */}
      <div className="hidden lg:block h-96 bg-muted rounded-lg overflow-hidden border border-border">
        <MapContent />
      </div>
      {/* Mobile Map Overlay */}
      {isVisible && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={onToggle}>
          <div 
            className="absolute inset-4 bg-card rounded-lg overflow-hidden shadow-tourism-lg"
            onClick={(e) => e?.stopPropagation()}
          >
            <MapContent />
          </div>
        </div>
      )}
    </>
  );
};

export default InteractiveMap;