import { supabase } from '../lib/supabase';

export const wishlistService = {
  // Get user's wishlist
  async getUserWishlist(userId) {
    try {
      const { data, error } = await supabase
        ?.from('wishlists')?.select(`*,tour_packages:tour_packages(*,destinations:destinations(id,name,country,image_url),reviews:reviews(rating))`)?.eq('user_id', userId)?.order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error?.message, data: [] };
      }

      // Calculate average rating for each package
      const wishlistWithRating = data?.map(item => {
        const reviews = item?.tour_packages?.reviews || [];
        const avgRating = reviews?.length > 0 
          ? reviews?.reduce((sum, review) => sum + review?.rating, 0) / reviews?.length 
          : 0;
        
        return {
          ...item,
          tour_packages: {
            ...item?.tour_packages,
            rating: Math.round(avgRating * 10) / 10,
            reviewCount: reviews?.length
          }
        };
      });

      return { success: true, data: wishlistWithRating || [] };
    } catch (error) {
      return { success: false, error: 'Failed to fetch wishlist', data: [] };
    }
  },

  // Add to wishlist
  async addToWishlist(userId, tourPackageId) {
    try {
      const { data, error } = await supabase
        ?.from('wishlists')
        ?.insert([{
          user_id: userId,
          tour_package_id: tourPackageId
        }])
        ?.select(`
          *,
          tour_packages:tour_packages(
            id,
            title,
            price_per_person,
            destinations:destinations(
              name,
              country
            )
          )
        `)
        ?.single();

      if (error) {
        // Handle unique constraint violation (already in wishlist)
        if (error?.code === '23505') {
          return { success: false, error: 'Item is already in your wishlist' };
        }
        return { success: false, error: error?.message, data: null };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to add to wishlist', data: null };
    }
  },

  // Remove from wishlist
  async removeFromWishlist(userId, tourPackageId) {
    try {
      const { error } = await supabase
        ?.from('wishlists')
        ?.delete()
        ?.eq('user_id', userId)
        ?.eq('tour_package_id', tourPackageId);

      if (error) {
        return { success: false, error: error?.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to remove from wishlist' };
    }
  },

  // Check if item is in wishlist
  async isInWishlist(userId, tourPackageId) {
    try {
      const { data, error } = await supabase
        ?.from('wishlists')
        ?.select('id')
        ?.eq('user_id', userId)
        ?.eq('tour_package_id', tourPackageId)
        ?.single();

      if (error && error?.code !== 'PGRST116') {
        return { success: false, error: error?.message, data: false };
      }

      return { success: true, data: !!data };
    } catch (error) {
      return { success: false, error: 'Failed to check wishlist status', data: false };
    }
  },

  // Clear entire wishlist
  async clearWishlist(userId) {
    try {
      const { error } = await supabase
        ?.from('wishlists')
        ?.delete()
        ?.eq('user_id', userId);

      if (error) {
        return { success: false, error: error?.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to clear wishlist' };
    }
  },

  // Get wishlist count
  async getWishlistCount(userId) {
    try {
      const { count, error } = await supabase
        ?.from('wishlists')
        ?.select('id', { count: 'exact', head: true })
        ?.eq('user_id', userId);

      if (error) {
        return { success: false, error: error?.message, data: 0 };
      }

      return { success: true, data: count || 0 };
    } catch (error) {
      return { success: false, error: 'Failed to get wishlist count', data: 0 };
    }
  }
};