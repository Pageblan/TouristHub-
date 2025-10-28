import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const SimilarPackages = ({ packages }) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars?.push(
        <Icon key={i} name="Star" size={12} className="text-yellow-400 fill-current" />
      );
    }

    if (hasHalfStar) {
      stars?.push(
        <Icon key="half" name="Star" size={12} className="text-yellow-400 fill-current opacity-50" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars?.push(
        <Icon key={`empty-${i}`} name="Star" size={12} className="text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-tourism p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading font-semibold text-xl text-foreground">
          Similar Packages
        </h3>
        <Link
          to="/destination-search"
          className="text-primary hover:text-primary/80 font-body font-medium text-sm transition-tourism"
        >
          View All
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages?.map((pkg, index) => (
          <div key={index} className="bg-muted/30 rounded-lg overflow-hidden hover:shadow-tourism-lg transition-tourism group">
            <div className="relative h-48 overflow-hidden">
              <Image
                src={pkg?.image}
                alt={pkg?.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Discount Badge */}
              {pkg?.discount && (
                <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-semibold">
                  {pkg?.discount}% OFF
                </div>
              )}
              
              {/* Wishlist Button */}
              <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-tourism">
                <Icon name="Heart" size={16} className="text-muted-foreground hover:text-red-500" />
              </button>
            </div>

            <div className="p-4">
              <div className="flex items-center space-x-1 mb-2">
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                  {pkg?.category}
                </span>
                {pkg?.isPopular && (
                  <span className="bg-success/10 text-success px-2 py-1 rounded-full text-xs font-medium">
                    Popular
                  </span>
                )}
              </div>

              <h4 className="font-body font-semibold text-foreground mb-2 line-clamp-2">
                {pkg?.name}
              </h4>

              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center space-x-1">
                  {renderStars(pkg?.rating)}
                </div>
                <span className="font-body text-sm text-muted-foreground">
                  {pkg?.rating} ({pkg?.reviewCount})
                </span>
              </div>

              <div className="flex items-center space-x-4 mb-3 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Icon name="MapPin" size={14} />
                  <span>{pkg?.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={14} />
                  <span>{pkg?.duration}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-baseline space-x-2">
                    <span className="font-heading font-bold text-lg text-foreground">
                      ${pkg?.price}
                    </span>
                    {pkg?.originalPrice && (
                      <span className="font-body text-sm text-muted-foreground line-through">
                        ${pkg?.originalPrice}
                      </span>
                    )}
                  </div>
                  <span className="font-body text-xs text-muted-foreground">per person</span>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-xs text-success">
                    <Icon name="Users" size={12} />
                    <span>{pkg?.groupSize} spots left</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  iconName="Eye"
                  asChild
                >
                  <Link to="/tour-package-details">View Details</Link>
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  fullWidth
                  iconName="Calendar"
                >
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* View More Button */}
      <div className="text-center mt-6">
        <Button
          variant="outline"
          iconName="ArrowRight"
          asChild
        >
          <Link to="/destination-search">
            Explore More Packages
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default SimilarPackages;