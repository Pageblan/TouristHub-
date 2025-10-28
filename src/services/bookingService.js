import { supabase } from '../lib/supabase';

export const bookingService = {
  // Get user's bookings
  async getUserBookings(userId, status = null) {
    try {
      let query = supabase
        ?.from('bookings')?.select(`*,tour_packages:tour_packages(id,title,duration_days,image_url,destinations:destinations(name,country,image_url))`)?.eq('user_id', userId);

      if (status) {
        query = query?.eq('status', status);
      }

      const { data, error } = await query?.order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error?.message, data: [] };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      return { success: false, error: 'Failed to fetch bookings', data: [] };
    }
  },

  // Get booking by ID
  async getBookingById(id) {
    try {
      const { data, error } = await supabase
        ?.from('bookings')
        ?.select(`
          *,
          tour_packages:tour_packages(
            *,
            destinations:destinations(*)
          )
        `)
        ?.eq('id', id)
        ?.single();

      if (error) {
        return { success: false, error: error?.message, data: null };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to fetch booking', data: null };
    }
  },

  // Create new booking
  async createBooking(bookingData) {
    try {
      // Generate booking reference
      const bookingRef = 'TH' + new Date()?.toISOString()?.slice(0, 10)?.replace(/-/g, '') + 
                         Math.floor(Math.random() * 10000)?.toString()?.padStart(4, '0');

      const booking = {
        ...bookingData,
        booking_reference: bookingRef,
        status: 'pending'
      };

      const { data, error } = await supabase
        ?.from('bookings')
        ?.insert([booking])
        ?.select(`
          *,
          tour_packages:tour_packages(
            *,
            destinations:destinations(*)
          )
        `)
        ?.single();

      if (error) {
        return { success: false, error: error?.message, data: null };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to create booking', data: null };
    }
  },

  // Update booking
  async updateBooking(id, updates) {
    try {
      const { data, error } = await supabase
        ?.from('bookings')
        ?.update(updates)
        ?.eq('id', id)
        ?.select(`
          *,
          tour_packages:tour_packages(
            *,
            destinations:destinations(*)
          )
        `)
        ?.single();

      if (error) {
        return { success: false, error: error?.message, data: null };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to update booking', data: null };
    }
  },

  // Cancel booking
  async cancelBooking(id, reason = '') {
    try {
      const { data, error } = await supabase
        ?.from('bookings')
        ?.update({
          status: 'cancelled',
          cancelled_at: new Date()?.toISOString(),
          cancelled_reason: reason
        })
        ?.eq('id', id)
        ?.select()
        ?.single();

      if (error) {
        return { success: false, error: error?.message, data: null };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to cancel booking', data: null };
    }
  },

  // Confirm booking (admin/agent only)
  async confirmBooking(id) {
    try {
      const { data, error } = await supabase
        ?.from('bookings')
        ?.update({ status: 'confirmed' })
        ?.eq('id', id)
        ?.select()
        ?.single();

      if (error) {
        return { success: false, error: error?.message, data: null };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to confirm booking', data: null };
    }
  },

  // Get booking statistics (admin only)
  async getBookingStats() {
    try {
      const { data: allBookings, error: allError } = await supabase
        ?.from('bookings')
        ?.select('status, total_amount');

      if (allError) {
        return { success: false, error: allError?.message, data: null };
      }

      const stats = {
        total: allBookings?.length || 0,
        pending: allBookings?.filter(b => b?.status === 'pending')?.length || 0,
        confirmed: allBookings?.filter(b => b?.status === 'confirmed')?.length || 0,
        cancelled: allBookings?.filter(b => b?.status === 'cancelled')?.length || 0,
        completed: allBookings?.filter(b => b?.status === 'completed')?.length || 0,
        totalRevenue: allBookings?.reduce((sum, b) => {
          return b?.status === 'confirmed' || b?.status === 'completed' 
            ? sum + (parseFloat(b?.total_amount) || 0) 
            : sum;
        }, 0)
      };

      return { success: true, data: stats };
    } catch (error) {
      return { success: false, error: 'Failed to fetch booking statistics', data: null };
    }
  }
};