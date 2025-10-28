import { supabase } from '../lib/supabase';

export const destinationService = {
  // Get all destinations with optional filtering
  async getDestinations(filters = {}) {
    try {
      let query = supabase
        ?.from('destinations')
        ?.select(`
          *,
          tour_packages:tour_packages(
            id,
            title,
            price_per_person,
            min_price,
            max_price,
            duration_days,
            is_featured
          )
        `)
        ?.eq('is_active', true);

      // Apply filters
      if (filters?.country) {
        query = query?.eq('country', filters?.country);
      }
      
      if (filters?.destination_type) {
        query = query?.eq('destination_type', filters?.destination_type);
      }
      
      if (filters?.featured) {
        query = query?.eq('is_featured', true);
      }

      if (filters?.search) {
        query = query?.or(`name.ilike.%${filters?.search}%,country.ilike.%${filters?.search}%,description.ilike.%${filters?.search}%`);
      }

      const { data, error } = await query?.order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error?.message, data: [] };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      return { success: false, error: 'Failed to fetch destinations', data: [] };
    }
  },

  // Get destination by ID
  async getDestinationById(id) {
    try {
      const { data, error } = await supabase
        ?.from('destinations')
        ?.select(`
          *,
          tour_packages:tour_packages(
            *,
            reviews:reviews(
              rating,
              title,
              content,
              user_profiles:user_profiles(full_name)
            )
          )
        `)
        ?.eq('id', id)
        ?.eq('is_active', true)
        ?.single();

      if (error) {
        return { success: false, error: error?.message, data: null };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to fetch destination', data: null };
    }
  },

  // Get featured destinations
  async getFeaturedDestinations(limit = 6) {
    try {
      const { data, error } = await supabase
        ?.from('destinations')
        ?.select(`
          *,
          tour_packages:tour_packages!inner(
            id,
            title,
            price_per_person,
            min_price,
            max_price,
            duration_days,
            is_featured
          )
        `)
        ?.eq('is_featured', true)
        ?.eq('is_active', true)
        ?.limit(limit);

      if (error) {
        return { success: false, error: error?.message, data: [] };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      return { success: false, error: 'Failed to fetch featured destinations', data: [] };
    }
  },

  // Get countries
  async getCountries() {
    try {
      const { data, error } = await supabase
        ?.from('destinations')
        ?.select('country')
        ?.eq('is_active', true);

      if (error) {
        return { success: false, error: error?.message, data: [] };
      }

      // Get unique countries
      const countries = [...new Set(data?.map(dest => dest?.country))]?.filter(Boolean);
      return { success: true, data: countries };
    } catch (error) {
      return { success: false, error: 'Failed to fetch countries', data: [] };
    }
  },

  // Create destination (admin only)
  async createDestination(destinationData) {
    try {
      const { data, error } = await supabase
        ?.from('destinations')
        ?.insert([destinationData])
        ?.select()
        ?.single();

      if (error) {
        return { success: false, error: error?.message, data: null };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to create destination', data: null };
    }
  },

  // Update destination (admin only)
  async updateDestination(id, updates) {
    try {
      const { data, error } = await supabase
        ?.from('destinations')
        ?.update(updates)
        ?.eq('id', id)
        ?.select()
        ?.single();

      if (error) {
        return { success: false, error: error?.message, data: null };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to update destination', data: null };
    }
  },

  // Delete destination (admin only)
  async deleteDestination(id) {
    try {
      const { error } = await supabase
        ?.from('destinations')
        ?.delete()
        ?.eq('id', id);

      if (error) {
        return { success: false, error: error?.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete destination' };
    }
  }
};