import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PersonalizedRecommendations = () => {
  const recommendations = [
    {
      id: 1,
      title: "Bali Adventure Package",
      destination: "Bali, Indonesia",
      image: "https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?w=400&h=250&fit=crop",
      price: 1850,
      originalPrice: 2200,
      duration: "6 Days, 5 Nights",
      rating: 4.8,
      reviews: 324,
      highlights: ["Beach Resort", "Cultural Tours", "Spa Included"],
      discount: 16,
      reason: "Based on your love for beach destinations",
      featured: true
    },
    {
      id: 2,
      title: "Swiss Alps Experience",
      destination: "Interlaken, Switzerland",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
      price: 3200,
      originalPrice: 3600,
      duration: "5 Days, 4 Nights",
      rating: 4.9,
      reviews: 189,
      highlights: ["Mountain Views", "Adventure Sports", "Luxury Lodge"],
      discount: 11,
      reason: "Perfect for adventure seekers",
      featured: false
    },
    {
      id: 3,
      title: "Tuscany Wine Tour",
      destination: "Florence, Italy",
      image: "https://images.pixabay.com/photo/2016/11/29/05/45/architecture-1867187_1280.jpg?w=400&h=250&fit=crop",
      price: 2400,
      originalPrice: 2800,
      duration: "4 Days, 3 Nights",
      rating: 4.7,
      reviews: 256,
      highlights: ["Wine Tasting", "Historic Sites", "Cooking Class"],
      discount: 14,
      reason: "Matches your cultural interests",
      featured: false
    }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    })?.format(price);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-heading text-xl font-semibold text-foreground mb-1">
            Recommended For You
          </h2>
          <p className="font-body text-sm text-muted-foreground">
            Personalized suggestions based on your preferences
          </p>
        </div>
        <Link 
          to="/destination-search" 
          className="text-primary hover:text-primary/80 font-body text-sm transition-tourism"
        >
          View All
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {recommendations?.map((rec) => (
          <div key={rec?.id} className="group cursor-pointer">
            <div className="border border-border rounded-lg overflow-hidden hover:shadow-tourism-lg transition-tourism">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image 
                  src={rec?.image} 
                  alt={rec?.destination}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {rec?.featured && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                      Trending
                    </span>
                  </div>
                )}
                {rec?.discount > 0 && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-error text-error-foreground text-xs px-2 py-1 rounded-full font-medium">
                      {rec?.discount}% OFF
                    </span>
                  </div>
                )}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="bg-black/60 text-white rounded-lg p-2 backdrop-blur-sm">
                    <p className="font-caption text-xs">{rec?.reason}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-heading font-semibold text-foreground mb-1 group-hover:text-primary transition-tourism">
                      {rec?.title}
                    </h3>
                    <p className="font-body text-sm text-muted-foreground flex items-center">
                      <Icon name="MapPin" size={14} className="mr-1" />
                      {rec?.destination}
                    </p>
                  </div>
                  <button className="p-1 text-muted-foreground hover:text-error transition-tourism">
                    <Icon name="Heart" size={18} />
                  </button>
                </div>

                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={14} className="text-warning fill-current" />
                    <span className="font-mono text-sm font-medium text-foreground">{rec?.rating}</span>
                  </div>
                  <span className="font-caption text-xs text-muted-foreground">
                    ({rec?.reviews} reviews)
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="font-caption text-xs text-muted-foreground">{rec?.duration}</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {rec?.highlights?.slice(0, 3)?.map((highlight, index) => (
                    <span key={index} className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                      {highlight}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-lg font-bold text-foreground">
                      {formatPrice(rec?.price)}
                    </span>
                    {rec?.originalPrice > rec?.price && (
                      <span className="font-mono text-sm text-muted-foreground line-through">
                        {formatPrice(rec?.originalPrice)}
                      </span>
                    )}
                  </div>
                  <Link to="/tour-package-details">
                    <Button variant="outline" size="sm" iconName="ArrowRight" iconPosition="right">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <Link to="/destination-search">
          <Button variant="outline" iconName="Sparkles" iconPosition="left">
            Discover More Recommendations
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PersonalizedRecommendations;