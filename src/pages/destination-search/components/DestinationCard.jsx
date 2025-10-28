import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const DestinationCard = ({ destination }) => {
  const [isHovered, setIsHovered] = useState(false);

  const {
    id,
    name,
    country,
    image,
    rating,
    reviewCount,
    priceRange,
    description,
    weather,
    activities,
    specialOffers,
    coordinates
  } = destination;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars?.push(
        <Icon key={i} name="Star" size={14} className="text-warning fill-current" />
      );
    }

    if (hasHalfStar) {
      stars?.push(
        <Icon key="half" name="Star" size={14} className="text-warning fill-current opacity-50" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars?.push(
        <Icon key={`empty-${i}`} name="Star" size={14} className="text-muted-foreground" />
      );
    }

    return stars;
  };

  return (
    <div
      className="bg-card border border-border rounded-lg shadow-tourism hover:shadow-tourism-lg transition-all duration-300 overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image}
          alt={`${name}, ${country}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Special Offer Badge */}
        {specialOffers && (
          <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-caption font-medium">
            {specialOffers}
          </div>
        )}

        {/* Weather Info */}
        <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs font-caption flex items-center space-x-1">
          <Icon name="Sun" size={12} />
          <span>{weather}</span>
        </div>

        {/* Hover Overlay */}
        <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex flex-wrap gap-2">
              {activities?.slice(0, 3)?.map((activity, index) => (
                <span
                  key={index}
                  className="bg-white/90 text-foreground px-2 py-1 rounded-full text-xs font-caption"
                >
                  {activity}
                </span>
              ))}
              {activities?.length > 3 && (
                <span className="bg-white/90 text-foreground px-2 py-1 rounded-full text-xs font-caption">
                  +{activities?.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground group-hover:text-primary transition-tourism">
              {name}
            </h3>
            <p className="font-caption text-sm text-muted-foreground flex items-center">
              <Icon name="MapPin" size={14} className="mr-1" />
              {country}
            </p>
          </div>
          <div className="text-right">
            <p className="font-heading font-bold text-lg text-primary">{priceRange}</p>
            <p className="font-caption text-xs text-muted-foreground">per person</p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center space-x-1">
            {renderStars(rating)}
          </div>
          <span className="font-mono text-sm font-medium text-foreground">{rating}</span>
          <span className="font-caption text-sm text-muted-foreground">
            ({reviewCount?.toLocaleString()} reviews)
          </span>
        </div>

        {/* Description */}
        <p className="font-body text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Link to="/tour-package-details" className="flex-1">
            <Button variant="default" fullWidth>
              View Details
            </Button>
          </Link>
          <button className="p-2 border border-border rounded-lg hover:bg-muted transition-tourism">
            <Icon name="Heart" size={18} className="text-muted-foreground hover:text-accent" />
          </button>
          <button className="p-2 border border-border rounded-lg hover:bg-muted transition-tourism">
            <Icon name="Share" size={18} className="text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;