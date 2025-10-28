import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PackageHeader = ({ packageData }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const shareOptions = [
    { name: 'Facebook', icon: 'Facebook', color: 'text-blue-600' },
    { name: 'Twitter', icon: 'Twitter', color: 'text-blue-400' },
    { name: 'WhatsApp', icon: 'MessageCircle', color: 'text-green-600' },
    { name: 'Copy Link', icon: 'Link', color: 'text-gray-600' }
  ];

  const handleShare = (platform) => {
    // Mock share functionality
    console.log(`Sharing to ${platform}`);
    setShowShareMenu(false);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars?.push(
        <Icon key={i} name="Star" size={16} className="text-yellow-400 fill-current" />
      );
    }

    if (hasHalfStar) {
      stars?.push(
        <Icon key="half" name="Star" size={16} className="text-yellow-400 fill-current opacity-50" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars?.push(
        <Icon key={`empty-${i}`} name="Star" size={16} className="text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
        <span>Home</span>
        <Icon name="ChevronRight" size={14} />
        <span>Destinations</span>
        <Icon name="ChevronRight" size={14} />
        <span>{packageData?.destination}</span>
        <Icon name="ChevronRight" size={14} />
        <span className="text-foreground font-medium">{packageData?.name}</span>
      </nav>
      {/* Main Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
              {packageData?.category}
            </span>
            {packageData?.isPopular && (
              <span className="bg-accent/10 text-accent px-2 py-1 rounded-full text-xs font-medium">
                Popular Choice
              </span>
            )}
          </div>

          <h1 className="font-heading font-bold text-2xl lg:text-3xl text-foreground mb-3">
            {packageData?.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mb-4">
            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {renderStars(packageData?.rating)}
              </div>
              <span className="font-body font-semibold text-foreground">
                {packageData?.rating}
              </span>
              <span className="text-muted-foreground">
                ({packageData?.reviewCount} reviews)
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Icon name="MapPin" size={16} />
              <span className="font-body">{packageData?.location}</span>
            </div>

            {/* Duration */}
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Icon name="Clock" size={16} />
              <span className="font-body">{packageData?.duration}</span>
            </div>
          </div>

          {/* Quick Features */}
          <div className="flex flex-wrap gap-2">
            {packageData?.features?.map((feature, index) => (
              <span
                key={index}
                className="flex items-center space-x-1 bg-muted px-3 py-1 rounded-full text-sm text-muted-foreground"
              >
                <Icon name={feature?.icon} size={14} />
                <span>{feature?.name}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 lg:flex-col lg:space-x-0 lg:space-y-2">
          <Button
            variant={isWishlisted ? "default" : "outline"}
            size="sm"
            onClick={toggleWishlist}
            iconName={isWishlisted ? "Heart" : "Heart"}
            className={isWishlisted ? "text-red-500" : ""}
          >
            {isWishlisted ? "Saved" : "Save"}
          </Button>

          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowShareMenu(!showShareMenu)}
              iconName="Share2"
            >
              Share
            </Button>

            {showShareMenu && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-tourism-lg z-10">
                <div className="p-2">
                  {shareOptions?.map((option) => (
                    <button
                      key={option?.name}
                      onClick={() => handleShare(option?.name)}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-muted rounded-lg transition-tourism"
                    >
                      <Icon name={option?.icon} size={16} className={option?.color} />
                      <span className="font-body text-sm">{option?.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            iconName="BarChart3"
          >
            Compare
          </Button>
        </div>
      </div>
      {/* Pricing Display */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="font-heading font-bold text-2xl text-foreground">
                ${packageData?.price}
              </span>
              {packageData?.originalPrice && (
                <span className="font-body text-lg text-muted-foreground line-through">
                  ${packageData?.originalPrice}
                </span>
              )}
              <span className="text-muted-foreground font-body">per person</span>
            </div>
            {packageData?.originalPrice && (
              <span className="text-success font-medium text-sm">
                Save ${packageData?.originalPrice - packageData?.price}
              </span>
            )}
          </div>
          
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Starting from</div>
            <div className="font-body font-medium text-foreground">
              Group of {packageData?.minGroupSize}+
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageHeader;