import { supabase } from '../lib/supabase';

export const reviewService = {
  // Get reviews for a tour package
  async getTourPackageReviews(tourPackageId, limit = 10, offset = 0) {
    try {
      const { data, error } = await supabase
        ?.from('reviews')
        ?.select(`
          *,
          user_profiles:user_profiles(
            id,
            full_name,
            profile_image
          )
        `)
        ?.eq('tour_package_id', tourPackageId)
        ?.order('created_at', { ascending: false })
        ?.range(offset, offset + limit - 1);

      if (error) {
        return { success: false, error: error.message, data: [] };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      return { success: false, error: 'Failed to fetch reviews', data: [] };
    }
  },

  // Get reviews for a destination
  async getDestinationReviews(destinationId, limit = 10, offset = 0) {
    try {
      const { data, error } = await supabase
        ?.from('reviews')
        ?.select(`
          *,
          user_profiles:user_profiles(
            id,
            full_name,
            profile_image
          ),
          tour_packages:tour_packages(
            id,
            title
          )
        `)
        ?.eq('destination_id', destinationId)
        ?.order('created_at', { ascending: false })
        ?.range(offset, offset + limit - 1);

      if (error) {
        return { success: false, error: error.message, data: [] };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      return { success: false, error: 'Failed to fetch reviews', data: [] };
    }
  },

  // Get user's reviews
  async getUserReviews(userId) {
    try {
      const { data, error } = await supabase
        ?.from('reviews')
        ?.select(`
          *,
          tour_packages:tour_packages(
            id,
            title,
            destinations:destinations(
              name,
              country
            )
          )
        `)
        ?.eq('user_id', userId)
        ?.order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message, data: [] };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      return { success: false, error: 'Failed to fetch user reviews', data: [] };
    }
  },

  // Create new review
  async createReview(reviewData) {
    try {
      const { data, error } = await supabase
        ?.from('reviews')
        ?.insert([reviewData])
        ?.select(`
          *,
          user_profiles:user_profiles(
            id,
            full_name,
            profile_image
          ),
          tour_packages:tour_packages(
            id,
            title
          )
        `)
        ?.single();

      if (error) {
        return { success: false, error: error.message, data: null };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to create review', data: null };
    }
  },

  // Update review
  async updateReview(id, updates) {
    try {
      const { data, error } = await supabase
        ?.from('reviews')
        ?.update(updates)
        ?.eq('id', id)
        ?.select(`
          *,
          user_profiles:user_profiles(
            id,
            full_name,
            profile_image
          )
        `)
        ?.single();

      if (error) {
        return { success: false, error: error.message, data: null };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to update review', data: null };
    }
  },

  // Delete review
  async deleteReview(id) {
    try {
      const { error } = await supabase
        ?.from('reviews')
        ?.delete()
        ?.eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete review' };
    }
  },

  // Get review statistics for a tour package
  async getTourPackageReviewStats(tourPackageId) {
    try {
      const { data, error } = await supabase
        ?.from('reviews')
        ?.select('rating')
        ?.eq('tour_package_id', tourPackageId);

      if (error) {
        return { success: false, error: error.message, data: null };
      }

      const reviews = data || [];
      const totalReviews = reviews?.length;
      const averageRating = totalReviews > 0 
        ? reviews?.reduce((sum, review) => sum + review?.rating, 0) / totalReviews 
        : 0;

      // Rating distribution
      const ratingDistribution = {
        5: reviews?.filter(r => r?.rating === 5)?.length || 0,
        4: reviews?.filter(r => r?.rating === 4)?.length || 0,
        3: reviews?.filter(r => r?.rating === 3)?.length || 0,
        2: reviews?.filter(r => r?.rating === 2)?.length || 0,
        1: reviews?.filter(r => r?.rating === 1)?.length || 0
      };

      const stats = {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution
      };

      return { success: true, data: stats };
    } catch (error) {
      return { success: false, error: 'Failed to fetch review statistics', data: null };
    }
  },

  // Mark review as helpful
  async markReviewHelpful(id) {
    try {
      const { data, error } = await supabase
        ?.from('reviews')
        ?.update({ helpful_count: supabase.sql`helpful_count + 1` })
        ?.eq('id', id)
        ?.select()
        ?.single();

      if (error) {
        return { success: false, error: error.message, data: null };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to mark review as helpful', data: null };
    }
  }
};