import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import TouristNavigation from '../../components/ui/TouristNavigation';
import ImageGallery from './components/ImageGallery';
import PackageHeader from './components/PackageHeader';
import BookingPanel from './components/BookingPanel';
import PackageDetails from './components/PackageDetails';
import ReviewsSection from './components/ReviewsSection';
import SimilarPackages from './components/SimilarPackages';
import Button from '../../components/ui/Button';


const TourPackageDetails = () => {
  const location = useLocation();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock package data
  const mockPackageData = {
    id: 'pkg-001',
    name: 'Magical Bali Adventure - 7 Days Cultural & Nature Experience',
    destination: 'Bali',
    location: 'Bali, Indonesia',
    category: 'Cultural Tour',
    duration: '7 days, 6 nights',
    price: 1299,
    originalPrice: 1599,
    rating: 4.8,
    reviewCount: 247,
    isPopular: true,
    minGroupSize: 2,
    features: [
      { name: 'Free WiFi', icon: 'Wifi' },
      { name: 'Airport Transfer', icon: 'Plane' },
      { name: 'Tour Guide', icon: 'User' },
      { name: 'Insurance', icon: 'Shield' }
    ],
    description: `Discover the enchanting beauty of Bali through this comprehensive 7-day cultural and nature experience. From ancient temples perched on clifftops to emerald rice terraces cascading down volcanic slopes, this journey showcases the very best of the Island of the Gods.\n\nImmerse yourself in Balinese culture through traditional dance performances, cooking classes, and visits to local artisan villages. Experience the spiritual side of Bali with sunrise temple visits and meditation sessions overlooking pristine landscapes.\n\nThis carefully crafted itinerary balances cultural exploration with natural wonders, ensuring you experience both the spiritual heart and breathtaking beauty that makes Bali one of the world's most beloved destinations.`,
    highlights: [
      'Sunrise visit to iconic Tanah Lot Temple',
      'Traditional Balinese cooking class in Ubud',
      'Guided trek through Jatiluwih Rice Terraces (UNESCO site)',
      'Private cultural performance at local village',
      'Snorkeling adventure at Menjangan Island',
      'Spa treatment with traditional Balinese massage',
      'Visit to Sekumpul Waterfall and hidden gems',
      'Shopping tour through local markets and art galleries'
    ],
    specialFeatures: [
      {
        title: 'Cultural Immersion',
        description: 'Authentic experiences with local families and artisans',
        icon: 'Users'
      },
      {
        title: 'Expert Guides',
        description: 'Local guides with deep cultural knowledge',
        icon: 'Award'
      },
      {
        title: 'Small Groups',
        description: 'Maximum 12 people for personalized experience',
        icon: 'Heart'
      }
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop',
        caption: 'Tanah Lot Temple at sunset'
      },
      {
        url: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&h=600&fit=crop',
        caption: 'Traditional Balinese architecture'
      },
      {
        url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop',
        caption: 'Jatiluwih Rice Terraces'
      },
      {
        url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
        caption: 'Balinese cultural dance'
      },
      {
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
        caption: 'Sekumpul Waterfall'
      }
    ],
    itinerary: [
      {
        title: 'Arrival & Ubud Exploration',
        location: 'Ubud, Bali',
        description: 'Welcome to Bali! Upon arrival at Ngurah Rai International Airport, you\'ll be greeted by our local guide and transferred to your accommodation in Ubud, the cultural heart of Bali.',
        activities: [
          '10:00 AM - Airport pickup and transfer to Ubud (1.5 hours)',
          '12:30 PM - Check-in at traditional Balinese resort',
          '2:00 PM - Welcome lunch featuring local specialties',
          '4:00 PM - Orientation walk through Ubud town center',
          '6:00 PM - Traditional Balinese dinner with cultural performance'
        ],
        meals: 'Lunch, Dinner',
        accommodation: 'Traditional Balinese Resort'
      },
      {
        title: 'Rice Terraces & Cooking Experience',
        location: 'Jatiluwih & Ubud',
        description: 'Explore the stunning UNESCO World Heritage Jatiluwih Rice Terraces and learn the secrets of Balinese cuisine in a hands-on cooking class.',
        activities: [
          '6:00 AM - Early morning departure to Jatiluwih',
          '8:00 AM - Guided trek through rice terraces with local farmer',
          '10:30 AM - Traditional coffee tasting at local plantation',
          '1:00 PM - Authentic Balinese cooking class in village home',
          '4:00 PM - Visit to local market for ingredient shopping',
          '7:00 PM - Enjoy the meal you prepared'
        ],
        meals: 'Breakfast, Lunch (self-prepared), Dinner',
        accommodation: 'Traditional Balinese Resort'
      },
      {
        title: 'Temple Hopping & Artisan Villages',
        location: 'Central Bali',
        description: 'Discover Bali\'s spiritual heritage through visits to ancient temples and meet local artisans preserving traditional crafts.',
        activities: [
          '7:00 AM - Visit to Tirta Empul Holy Water Temple',
          '9:30 AM - Explore Gunung Kawi ancient rock temples',
          '12:00 PM - Lunch at scenic restaurant overlooking valley',
          '2:00 PM - Visit to traditional wood carving village',
          '4:00 PM - Silver jewelry making workshop',
          '6:30 PM - Sunset at Pura Luhur Batukaru temple'
        ],
        meals: 'Breakfast, Lunch, Dinner',
        accommodation: 'Traditional Balinese Resort'
      },
      {
        title: 'Waterfall Adventure & Spa Day',
        location: 'North Bali',
        description: 'Experience Bali\'s natural beauty with waterfall trekking followed by traditional spa treatments for ultimate relaxation.',
        activities: [
          '6:30 AM - Departure to Sekumpul Waterfall region',
          '9:00 AM - Guided trek to hidden Sekumpul Waterfall',
          '11:30 AM - Swimming and photography at waterfall pools',
          '1:00 PM - Picnic lunch in nature setting',
          '3:00 PM - Return to resort',
          '5:00 PM - Traditional Balinese spa treatment (2 hours)'
        ],
        meals: 'Breakfast, Picnic Lunch, Dinner',
        accommodation: 'Traditional Balinese Resort'
      },
      {
        title: 'Coastal Temples & Beach Time',
        location: 'Tanah Lot & Canggu',
        description: 'Visit the iconic Tanah Lot temple and enjoy beach time at one of Bali\'s most beautiful coastal areas.',
        activities: [
          '8:00 AM - Departure to Tanah Lot Temple',
          '10:00 AM - Explore Tanah Lot and surrounding temples',
          '12:30 PM - Seafood lunch at beachfront restaurant',
          '2:30 PM - Free time at Canggu Beach',
          '4:00 PM - Surfing lesson or beach relaxation',
          '6:00 PM - Sunset viewing at Tanah Lot Temple'
        ],
        meals: 'Breakfast, Lunch, Dinner',
        accommodation: 'Beachfront Resort'
      },
      {
        title: 'Island Excursion & Snorkeling',
        location: 'Menjangan Island',
        description: 'Take a boat trip to pristine Menjangan Island for world-class snorkeling and marine life observation.',
        activities: [
          '6:00 AM - Early departure to Pemuteran Harbor',
          '9:00 AM - Boat departure to Menjangan Island',
          '10:00 AM - Snorkeling at coral reef sites',
          '12:30 PM - Beach picnic lunch on island',
          '2:00 PM - Second snorkeling session',
          '4:00 PM - Return boat journey with dolphin watching'
        ],
        meals: 'Breakfast, Picnic Lunch, Dinner',
        accommodation: 'Beachfront Resort'
      },
      {
        title: 'Departure & Shopping',
        location: 'Denpasar & Airport',
        description: 'Final day for souvenir shopping and departure preparations before your flight home.',
        activities: [
          '9:00 AM - Check-out and departure to Denpasar',
          '10:30 AM - Visit to traditional Sukawati Art Market',
          '12:00 PM - Lunch at local restaurant',
          '1:30 PM - Shopping at modern Beachwalk Shopping Center',
          '3:30 PM - Transfer to airport',
          '5:00 PM - Airport departure assistance'
        ],
        meals: 'Breakfast, Lunch',
        accommodation: 'N/A'
      }
    ],
    inclusions: [
      '6 nights accommodation in selected hotels/resorts',
      'Daily breakfast and 5 lunches, 6 dinners',
      'Airport transfers and all transportation',
      'English-speaking local guide throughout',
      'All entrance fees to temples and attractions',
      'Cooking class and cultural performances',
      'Snorkeling equipment and boat trips',
      'Traditional spa treatment session',
      'Travel insurance coverage',
      'All taxes and service charges'
    ],
    exclusions: [
      'International flights to/from Bali',
      'Visa fees (if applicable)',
      'Personal expenses and souvenirs',
      'Alcoholic beverages (unless specified)',
      'Tips for guides and drivers',
      'Optional activities not mentioned',
      'Travel insurance for pre-existing conditions',
      'Single room supplement charges'
    ],
    terms: [
      {
        title: 'Booking & Payment',
        content: 'A deposit of 30% is required to confirm your booking. Full payment is due 45 days before departure. Bookings made within 45 days require immediate full payment.'
      },
      {
        title: 'Cancellation Policy',
        content: 'Free cancellation up to 30 days before departure. 50% refund for cancellations 15-30 days before. No refund for cancellations within 15 days of departure.'
      },
      {
        title: 'Travel Requirements',
        content: 'Valid passport required with at least 6 months validity. Visa may be required depending on nationality. Travel insurance is highly recommended.'
      },
      {
        title: 'Health & Safety',
        content: 'No specific vaccinations required for Bali. Basic fitness level recommended for trekking activities. All activities are conducted with safety measures in place.'
      }
    ]
  };

  // Mock reviews data
  const mockReviews = [
    {
      name: 'Sarah Johnson',
      location: 'California, USA',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
      rating: 5,
      date: '2024-09-01',
      comment: `This was absolutely the best vacation I've ever taken! The cultural experiences were authentic and meaningful. Our guide Made was incredibly knowledgeable and passionate about sharing Balinese culture. The cooking class was a highlight - I still make the dishes I learned! The accommodations were beautiful and the itinerary was perfectly paced.`,
      helpfulCount: 23,
      images: [
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100&h=100&fit=crop'
      ]
    },
    {
      name: 'Michael Chen',
      location: 'Singapore',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      rating: 5,
      date: '2024-08-15',
      comment: `Exceeded all expectations! The small group size made it feel very personal. The rice terrace trek was breathtaking, and the waterfall adventure was incredible. The spa treatment was the perfect way to relax. Every detail was thoughtfully planned. Highly recommend this tour!`,
      helpfulCount: 18
    },
    {
      name: 'Emma Rodriguez',
      location: 'Madrid, Spain',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
      rating: 4,
      date: '2024-08-02',
      comment: `Wonderful experience overall! The cultural immersion was exactly what I was looking for. The temples were magnificent and our guide explained the history beautifully. The only minor issue was that some activities felt a bit rushed, but the quality of experiences was excellent. The snorkeling at Menjangan Island was unforgettable!`,
      helpfulCount: 15,
      images: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop'
      ]
    },
    {
      name: 'David Thompson',
      location: 'London, UK',
      avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
      rating: 5,
      date: '2024-07-20',
      comment: `This tour perfectly balanced culture, nature, and relaxation. The accommodations were authentic yet comfortable. The food experiences were incredible - both the cooking class and all the meals provided. The guide was fantastic and really made the difference. Worth every penny!`,
      helpfulCount: 12
    },
    {
      name: 'Lisa Park',
      location: 'Seoul, South Korea',
      avatar: 'https://randomuser.me/api/portraits/women/35.jpg',
      rating: 4,
      date: '2024-07-08',
      comment: `Beautiful tour with amazing experiences. The temple visits were spiritual and moving. The rice terraces were like something from a postcard. The group was small and friendly. My only suggestion would be to have more free time for personal exploration, but overall it was a fantastic trip!`,
      helpfulCount: 9
    }
  ];

  // Mock similar packages data
  const mockSimilarPackages = [
    {
      name: 'Java Cultural Heritage Tour',
      location: 'Java, Indonesia',
      category: 'Cultural',
      duration: '5 days',
      price: 899,
      originalPrice: 1099,
      discount: 18,
      rating: 4.6,
      reviewCount: 156,
      groupSize: 8,
      isPopular: true,
      image: 'https://images.unsplash.com/photo-1555400082-8c5b8c4e5b6e?w=400&h=300&fit=crop'
    },
    {
      name: 'Lombok Adventure & Beaches',
      location: 'Lombok, Indonesia',
      category: 'Adventure',
      duration: '6 days',
      price: 1099,
      rating: 4.7,
      reviewCount: 203,
      groupSize: 5,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
    },
    {
      name: 'Yogyakarta Art & Culture',
      location: 'Yogyakarta, Indonesia',
      category: 'Cultural',
      duration: '4 days',
      price: 699,
      originalPrice: 849,
      discount: 15,
      rating: 4.5,
      reviewCount: 89,
      groupSize: 12,
      image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=300&fit=crop'
    }
  ];

  useEffect(() => {
    // Simulate loading package data
    const loadPackageData = async () => {
      setLoading(true);
      // In a real app, this would fetch data based on package ID from URL params
      setTimeout(() => {
        setPackageData(mockPackageData);
        setLoading(false);
      }, 1000);
    };

    loadPackageData();
  }, [location]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <TouristNavigation />
        <div className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-96 bg-muted rounded-lg"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="h-64 bg-muted rounded-lg"></div>
                  <div className="h-48 bg-muted rounded-lg"></div>
                </div>
                <div className="h-96 bg-muted rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen bg-background">
        <TouristNavigation />
        <div className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center py-12">
              <h1 className="font-heading font-bold text-2xl text-foreground mb-4">
                Package Not Found
              </h1>
              <p className="text-muted-foreground mb-6">
                The tour package you're looking for doesn't exist or has been removed.
              </p>
              <Button variant="default" iconName="ArrowLeft" asChild>
                <Link to="/destination-search">Back to Search</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TouristNavigation />
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Package Header */}
          <PackageHeader packageData={packageData} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <ImageGallery 
                images={packageData?.images} 
                packageName={packageData?.name} 
              />

              {/* Package Details Tabs */}
              <PackageDetails packageData={packageData} />

              {/* Reviews Section */}
              <ReviewsSection 
                reviews={mockReviews}
                averageRating={packageData?.rating}
                totalReviews={packageData?.reviewCount}
              />
            </div>

            {/* Right Column - Booking Panel */}
            <div className="lg:col-span-1">
              <BookingPanel packageData={packageData} />
            </div>
          </div>

          {/* Similar Packages */}
          <div className="mt-12">
            <SimilarPackages packages={mockSimilarPackages} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default TourPackageDetails;