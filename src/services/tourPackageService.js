import { supabase } from '../lib/supabase';

export const tourPackageService = {
  // Get all tour packages with filtering
  async getTourPackages(filters = {}) {
    try {
      let query = supabase
        ?.from('tour_packages')
        ?.select(`
          *,
          destinations:destinations(
            id,
            name,
            country,
            city,
            destination_type,
            image_url,
            latitude,
            longitude
          ),
          reviews:reviews(
            id,
            rating,
            title,
            content,
            user_profiles:user_profiles(full_name)
          )
        `)
        ?.eq('is_active', true);

      // Apply filters
      if (filters?.destination_id) {
        query = query?.eq('destination_id', filters?.destination_id);
      }
      
      if (filters?.min_price) {
        query = query?.gte('price_per_person', filters?.min_price);
      }
      
      if (filters?.max_price) {
        query = query?.lte('price_per_person', filters?.max_price);
      }
      
      if (filters?.duration) {
        query = query?.eq('duration_days', filters?.duration);
      }
      
      if (filters?.featured) {
        query = query?.eq('is_featured', true);
      }

      if (filters?.search) {
        query = query?.or(`title.ilike.%${filters?.search}%,description.ilike.%${filters?.search}%`);
      }

      // Apply sorting
      if (filters?.sort_by) {
        switch (filters?.sort_by) {
          case 'price_low':
            query = query?.order('price_per_person', { ascending: true });
            break;
          case 'price_high':
            query = query?.order('price_per_person', { ascending: false });
            break;
          case 'duration':
            query = query?.order('duration_days', { ascending: true });
            break;
          case 'newest':
            query = query?.order('created_at', { ascending: false });
            break;
          default:
            query = query?.order('is_featured', { ascending: false });
        }
      }

      const { data, error } = await query;

      if (error) {
        return { success: false, error: error?.message, data: [] };
      }

      // Calculate average rating for each package
      const packagesWithRating = data?.map(pkg => {
        const reviews = pkg?.reviews || [];
        const avgRating = reviews?.length > 0 
          ? reviews?.reduce((sum, review) => sum + review?.rating, 0) / reviews?.length 
          : 0;
        
        return {
          ...pkg,
          rating: Math.round(avgRating * 10) / 10,
          reviewCount: reviews?.length
        };
      });

      return { success: true, data: packagesWithRating || [] };
    } catch (error) {
      return { success: false, error: 'Failed to fetch tour packages', data: [] };
    }
  },

  // Get tour package by ID
  async getTourPackageById(id) {
    try {
      const { data, error } = await supabase
        ?.from('tour_packages')
        ?.select(`
          *,
          destinations:destinations(*),
          reviews:reviews(
            *,
            user_profiles:user_profiles(
              id,
              full_name,
              profile_image
            )
          )
        `)
        ?.eq('id', id)
        ?.eq('is_active', true)
        ?.single();

      if (error) {
        return { success: false, error: error?.message, data: null };
      }

      // Calculate average rating
      const reviews = data?.reviews || [];
      const avgRating = reviews?.length > 0 
        ? reviews?.reduce((sum, review) => sum + review?.rating, 0) / reviews?.length 
        : 0;

      const packageWithRating = {
        ...data,
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews?.length
      };

      return { success: true, data: packageWithRating };
    } catch (error) {
      return { success: false, error: 'Failed to fetch tour package', data: null };
    }
  },

  // Get featured tour packages
  async getFeaturedTourPackages(limit = 6) {
    try {
      const { data, error } = await supabase
        ?.from('tour_packages')
        ?.select(`
          *,
          destinations:destinations(
            id,
            name,
            country,
            city,
            destination_type,
            image_url
          ),
          reviews:reviews(rating)
        `)
        ?.eq('is_featured', true)
        ?.eq('is_active', true)
        ?.limit(limit);

      if (error) {
        return { success: false, error: error?.message, data: [] };
      }

      // Calculate average rating for each package
      const packagesWithRating = data?.map(pkg => {
        const reviews = pkg?.reviews || [];
        const avgRating = reviews?.length > 0 
          ? reviews?.reduce((sum, review) => sum + review?.rating, 0) / reviews?.length 
          : 0;
        
        return {
          ...pkg,
          rating: Math.round(avgRating * 10) / 10,
          reviewCount: reviews?.length
        };
      });

      return { success: true, data: packagesWithRating || [] };
    } catch (error) {
      return { success: false, error: 'Failed to fetch featured tour packages', data: [] };
    }
  },

  // Create tour package (admin/agent only)
  async createTourPackage(packageData) {
    try {
      const { data, error } = await supabase
        ?.from('tour_packages')
        ?.insert([packageData])
        ?.select(`
          *,
          destinations:destinations(*)
        `)
        ?.single();

      if (error) {
        return { success: false, error: error?.message, data: null };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to create tour package', data: null };
    }
  },

  // Update tour package (admin/agent only)
  async updateTourPackage(id, updates) {
    try {
      const { data, error } = await supabase
        ?.from('tour_packages')
        ?.update(updates)
        ?.eq('id', id)
        ?.select(`
          *,
          destinations:destinations(*)
        `)
        ?.single();

      if (error) {
        return { success: false, error: error?.message, data: null };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to update tour package', data: null };
    }
  },

  // Delete tour package (admin only)
  async deleteTourPackage(id) {
    try {
      const { error } = await supabase
        ?.from('tour_packages')
        ?.delete()
        ?.eq('id', id);

      if (error) {
        return { success: false, error: error?.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete tour package' };
    }
  }
};