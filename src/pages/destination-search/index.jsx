import React, { useState, useEffect } from 'react';
import TouristNavigation from '../../components/ui/TouristNavigation';
import SearchBar from './components/SearchBar';
import SearchFilters from './components/SearchFilters';
import SortControls from './components/SortControls';
import DestinationGrid from './components/DestinationGrid';
import InteractiveMap from './components/InteractiveMap';
import { tourPackageService } from '../../services/tourPackageService';


const DestinationSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    destinationType: '',
    budgetRange: '',
    activities: [],
    accommodationRating: '',
    duration: ''
  });
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);

  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);

  useEffect(() => {
    loadDestinations();
  }, []);

  useEffect(() => {
    filterDestinations();
  }, [searchQuery, filters, sortBy, destinations]);

  const loadDestinations = async () => {
    setLoading(true);
    try {
      const result = await tourPackageService?.getTourPackages();
      
      if (result?.success) {
        // Transform tour packages to match destination card format
        const transformedData = result?.data?.map(pkg => ({
          id: pkg?.id,
          name: pkg?.destinations?.name || 'Unknown Destination',
          country: pkg?.destinations?.country || 'Unknown Country',
          image: pkg?.image_url || pkg?.destinations?.image_url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
          rating: pkg?.rating || 0,
          reviewCount: pkg?.reviewCount || 0,
          priceRange: `$${pkg?.min_price || pkg?.price_per_person} - $${pkg?.max_price || pkg?.price_per_person}`,
          description: pkg?.description || 'Discover amazing experiences at this destination.',
          weather: '25°C', // Default weather
          activities: pkg?.includes?.slice(0, 4) || ['Sightseeing', 'Local Cuisine'],
          specialOffers: pkg?.special_offers || null,
          coordinates: { 
            lat: pkg?.destinations?.latitude || 0, 
            lng: pkg?.destinations?.longitude || 0 
          },
          duration: pkg?.duration_days,
          tourPackage: pkg // Store full package data
        }));
        
        setDestinations(transformedData);
      } else {
        console.error('Failed to load destinations:', result?.error);
      }
    } catch (error) {
      console.error('Error loading destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDestinations = () => {
    setLoading(true);
    
    setTimeout(() => {
      let filtered = [...destinations];

      // Search query filter
      if (searchQuery) {
        filtered = filtered?.filter(dest =>
          dest?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
          dest?.country?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
          dest?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase())
        );
      }

      // Destination type filter
      if (filters?.destinationType) {
        filtered = filtered?.filter(dest => {
          const activities = dest?.activities?.join(' ')?.toLowerCase();
          switch (filters?.destinationType) {
            case 'beach':
              return activities?.includes('beach') || activities?.includes('water') || activities?.includes('diving');
            case 'mountain':
              return activities?.includes('hiking') || activities?.includes('skiing') || activities?.includes('climbing');
            case 'city':
              return activities?.includes('cultural') || activities?.includes('shopping') || activities?.includes('museum');
            default:
              return true;
          }
        });
      }

      // Budget range filter
      if (filters?.budgetRange) {
        filtered = filtered?.filter(dest => {
          const priceMatch = dest?.priceRange?.match(/\$(\d+,?\d*)/g);
          if (priceMatch && priceMatch?.length > 0) {
            const minPrice = parseInt(priceMatch?.[0]?.replace(/[$,]/g, ''));
            switch (filters?.budgetRange) {
              case '0-500':
                return minPrice <= 500;
              case '500-1000':
                return minPrice >= 500 && minPrice <= 1000;
              case '1000-2000':
                return minPrice >= 1000 && minPrice <= 2000;
              case '2000-5000':
                return minPrice >= 2000 && minPrice <= 5000;
              case '5000+':
                return minPrice >= 5000;
              default:
                return true;
            }
          }
          return true;
        });
      }

      // Activities filter
      if (filters?.activities && filters?.activities?.length > 0) {
        filtered = filtered?.filter(dest =>
          filters?.activities?.some(activity =>
            dest?.activities?.some(destActivity =>
              destActivity?.toLowerCase()?.includes(activity?.toLowerCase())
            )
          )
        );
      }

      // Rating filter
      if (filters?.accommodationRating) {
        const minRating = parseInt(filters?.accommodationRating);
        filtered = filtered?.filter(dest => dest?.rating >= minRating);
      }

      // Duration filter
      if (filters?.duration) {
        const durationDays = parseInt(filters?.duration);
        filtered = filtered?.filter(dest => dest?.duration === durationDays);
      }

      // Sort destinations
      filtered?.sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            const aPriceLow = parseInt(a?.priceRange?.match(/\$(\d+,?\d*)/)?.[1]?.replace(',', ''));
            const bPriceLow = parseInt(b?.priceRange?.match(/\$(\d+,?\d*)/)?.[1]?.replace(',', ''));
            return aPriceLow - bPriceLow;
          case 'price-high':
            const aPriceHigh = parseInt(a?.priceRange?.match(/\$(\d+,?\d*)/)?.[1]?.replace(',', ''));
            const bPriceHigh = parseInt(b?.priceRange?.match(/\$(\d+,?\d*)/)?.[1]?.replace(',', ''));
            return bPriceHigh - aPriceHigh;
          case 'rating':
            return b?.rating - a?.rating;
          case 'popularity':
            return b?.reviewCount - a?.reviewCount;
          case 'newest':
            return b?.id - a?.id;
          default:
            return 0;
        }
      });

      setFilteredDestinations(filtered);
      setLoading(false);
    }, 500);
  };

  const handleSearch = (searchData) => {
    setSearchQuery(searchData?.destination || '');
    filterDestinations();
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      destinationType: '',
      budgetRange: '',
      activities: [],
      accommodationRating: '',
      duration: ''
    });
  };

  const handleDestinationSelect = (destination) => {
    setSelectedDestination(destination);
  };

  return (
    <div className="min-h-screen bg-background">
      <TouristNavigation />
      <main className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <SearchBar
            onSearch={handleSearch}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
          />

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <SearchFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              isVisible={showFilters}
              onToggle={() => setShowFilters(!showFilters)}
            />

            {/* Main Content */}
            <div className="flex-1">
              {/* Sort Controls */}
              <SortControls
                sortBy={sortBy}
                onSortChange={setSortBy}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                resultCount={filteredDestinations?.length}
                onToggleFilters={() => setShowFilters(!showFilters)}
                onToggleMap={() => setShowMap(!showMap)}
              />

              {/* Map Section */}
              <div className="mb-8">
                <InteractiveMap
                  destinations={filteredDestinations}
                  selectedDestination={selectedDestination}
                  onDestinationSelect={handleDestinationSelect}
                  isVisible={showMap}
                  onToggle={() => setShowMap(!showMap)}
                />
              </div>

              {/* Results Grid */}
              <DestinationGrid
                destinations={filteredDestinations}
                viewMode={viewMode}
                loading={loading}
                hasMore={false}
                onLoadMore={() => {}}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DestinationSearch;