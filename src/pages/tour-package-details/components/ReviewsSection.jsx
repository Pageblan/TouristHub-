import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ReviewsSection = ({ reviews, averageRating, totalReviews }) => {
  const [filterRating, setFilterRating] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showAllReviews, setShowAllReviews] = useState(false);

  const ratingFilterOptions = [
    { value: '', label: 'All Ratings' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4 Stars' },
    { value: '3', label: '3 Stars' },
    { value: '2', label: '2 Stars' },
    { value: '1', label: '1 Star' }
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'highest', label: 'Highest Rating' },
    { value: 'lowest', label: 'Lowest Rating' }
  ];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars?.push(
        <Icon
          key={i}
          name="Star"
          size={14}
          className={i <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
        />
      );
    }
    return stars;
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews?.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();
  const displayedReviews = showAllReviews ? reviews : reviews?.slice(0, 3);

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-tourism p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading font-semibold text-xl text-foreground">
          Reviews & Ratings
        </h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {renderStars(Math.round(averageRating))}
          </div>
          <span className="font-body font-semibold text-foreground">
            {averageRating}
          </span>
          <span className="text-muted-foreground">
            ({totalReviews} reviews)
          </span>
        </div>
      </div>
      {/* Rating Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Rating Breakdown */}
        <div>
          <h4 className="font-body font-semibold text-foreground mb-4">Rating Breakdown</h4>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1]?.map((rating) => (
              <div key={rating} className="flex items-center space-x-3">
                <span className="font-body text-sm text-muted-foreground w-8">
                  {rating} star
                </span>
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${totalReviews > 0 ? (ratingDistribution?.[rating] / totalReviews) * 100 : 0}%`
                    }}
                  />
                </div>
                <span className="font-mono text-sm text-muted-foreground w-8">
                  {ratingDistribution?.[rating]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Review Highlights */}
        <div>
          <h4 className="font-body font-semibold text-foreground mb-4">What Travelers Say</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-body text-muted-foreground">Service Quality</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-muted rounded-full h-2">
                  <div className="bg-success h-2 rounded-full w-4/5" />
                </div>
                <span className="font-mono text-sm text-muted-foreground">4.2</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-body text-muted-foreground">Value for Money</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-muted rounded-full h-2">
                  <div className="bg-success h-2 rounded-full w-4/5" />
                </div>
                <span className="font-mono text-sm text-muted-foreground">4.1</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-body text-muted-foreground">Organization</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-muted rounded-full h-2">
                  <div className="bg-success h-2 rounded-full w-full" />
                </div>
                <span className="font-mono text-sm text-muted-foreground">4.5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Select
            placeholder="Filter by rating"
            options={ratingFilterOptions}
            value={filterRating}
            onChange={setFilterRating}
          />
        </div>
        <div className="flex-1">
          <Select
            placeholder="Sort reviews"
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
          />
        </div>
      </div>
      {/* Reviews List */}
      <div className="space-y-6">
        {displayedReviews?.map((review, index) => (
          <div key={index} className="border-b border-border pb-6 last:border-b-0">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Image
                  src={review?.avatar}
                  alt={review?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h5 className="font-body font-semibold text-foreground">{review?.name}</h5>
                    <p className="font-body text-sm text-muted-foreground">{review?.location}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 mb-1">
                      {renderStars(review?.rating)}
                    </div>
                    <p className="font-body text-xs text-muted-foreground">
                      {formatDate(review?.date)}
                    </p>
                  </div>
                </div>
                
                <p className="font-body text-muted-foreground leading-relaxed mb-3">
                  {review?.comment}
                </p>
                
                {review?.images && review?.images?.length > 0 && (
                  <div className="flex space-x-2 mb-3">
                    {review?.images?.map((image, imgIndex) => (
                      <div key={imgIndex} className="w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={image}
                          alt={`Review image ${imgIndex + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center space-x-4 text-sm">
                  <button className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-tourism">
                    <Icon name="ThumbsUp" size={14} />
                    <span>Helpful ({review?.helpfulCount})</span>
                  </button>
                  <button className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-tourism">
                    <Icon name="MessageCircle" size={14} />
                    <span>Reply</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Show More/Less Button */}
      {reviews?.length > 3 && (
        <div className="text-center mt-6">
          <Button
            variant="outline"
            onClick={() => setShowAllReviews(!showAllReviews)}
            iconName={showAllReviews ? "ChevronUp" : "ChevronDown"}
          >
            {showAllReviews ? 'Show Less Reviews' : `Show All ${reviews?.length} Reviews`}
          </Button>
        </div>
      )}
      {/* Write Review Button */}
      <div className="mt-6 pt-6 border-t border-border text-center">
        <Button variant="default" iconName="Edit3">
          Write a Review
        </Button>
      </div>
    </div>
  );
};

export default ReviewsSection;