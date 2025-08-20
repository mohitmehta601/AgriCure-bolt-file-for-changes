import { supabase, FertilizerRecommendation } from './supabaseClient';

export interface CreateRecommendationData {
  user_id: string;
  field_name: string;
  field_size: number;
  field_size_unit: string;
  crop_type: string;
  soil_type: string;
  soil_ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  humidity: number;
  soil_moisture: number;
  primary_fertilizer: string;
  secondary_fertilizer?: string;
  ml_prediction: string;
  confidence_score: number;
  cost_estimate?: string;
  status?: 'pending' | 'applied' | 'scheduled';
}

export const recommendationService = {
  // Create new recommendation
  async createRecommendation(data: CreateRecommendationData) {
    try {
      const { data: recommendation, error } = await supabase
        .from('fertilizer_recommendations')
        .insert(data)
        .select()
        .single();

      return { data: recommendation, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get user's recommendations
  async getUserRecommendations(userId: string): Promise<{ data: FertilizerRecommendation[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('fertilizer_recommendations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get a single recommendation by id
  async getRecommendationById(id: string): Promise<{ data: FertilizerRecommendation | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('fertilizer_recommendations')
        .select('*')
        .eq('id', id)
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update recommendation status
  async updateRecommendationStatus(recommendationId: string, status: 'pending' | 'applied' | 'scheduled') {
    try {
      const { data, error } = await supabase
        .from('fertilizer_recommendations')
        .update({ status })
        .eq('id', recommendationId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Delete recommendation
  async deleteRecommendation(recommendationId: string) {
    try {
      const { error } = await supabase
        .from('fertilizer_recommendations')
        .delete()
        .eq('id', recommendationId);

      return { error };
    } catch (error) {
      return { error };
    }
  },

  // Get recent recommendations (for overview)
  async getRecentRecommendations(userId: string, limit: number = 5) {
    try {
      const { data, error } = await supabase
        .from('fertilizer_recommendations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }
};