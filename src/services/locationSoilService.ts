// Location and soil data service for frontend
export interface LocationData {
  latitude: number;
  longitude: number;
}

export interface SoilData {
  location: {
    latitude: number;
    longitude: number;
    timestamp: string;
  };
  soil_type: string;
  soil_properties: {
    clay?: number;
    sand?: number;
    silt?: number;
    phh2o?: number;
    cec?: number;
    nitrogen?: number;
    soc?: number;
  };
  confidence: number;
  sources: string[];
  success: boolean;
  location_info: {
    city: string;
    locality: string;
    region: string;
    country: string;
    formatted_address: string[];
  };
}

export interface GeolocationError {
  code: number;
  message: string;
}

const API_BASE_URL = 'http://localhost:8000';

export class LocationSoilService {
  /**
   * Get user's current location using browser geolocation API
   */
  static async getCurrentLocation(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes cache
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          let message = 'Unknown geolocation error';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              message = 'Location information is unavailable';
              break;
            case error.TIMEOUT:
              message = 'Location request timed out';
              break;
          }
          reject(new Error(message));
        },
        options
      );
    });
  }

  /**
   * Get soil data from backend API based on coordinates
   */
  static async getSoilDataByLocation(location: LocationData): Promise<SoilData> {
    try {
      const response = await fetch(`${API_BASE_URL}/soil-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(location)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const soilData: SoilData = await response.json();
      return soilData;
    } catch (error) {
      console.error('Error fetching soil data:', error);
      throw new Error(`Failed to fetch soil data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Combined function to get location and soil data
   */
  static async getLocationAndSoilData(): Promise<{
    location: LocationData;
    soilData: SoilData;
    locationString: string;
  }> {
    try {
      // Step 1: Get current location
      const location = await this.getCurrentLocation();
      
      // Step 2: Get soil data for the location
      const soilData = await this.getSoilDataByLocation(location);
      
      // Step 3: Format location string
      const locationString = this.formatLocationString(soilData.location_info);
      
      return {
        location,
        soilData,
        locationString
      };
    } catch (error) {
      console.error('Error getting location and soil data:', error);
      throw error;
    }
  }

  /**
   * Format location info into a readable string
   */
  static formatLocationString(locationInfo: SoilData['location_info']): string {
    const parts = [];
    
    if (locationInfo.locality) parts.push(locationInfo.locality);
    if (locationInfo.city && locationInfo.city !== locationInfo.locality) parts.push(locationInfo.city);
    if (locationInfo.region) parts.push(locationInfo.region);
    if (locationInfo.country) parts.push(locationInfo.country);
    
    return parts.length > 0 ? parts.join(', ') : 'Unknown Location';
  }

  /**
   * Check if geolocation is supported
   */
  static isGeolocationSupported(): boolean {
    return 'geolocation' in navigator;
  }

  /**
   * Get soil type confidence level description
   */
  static getConfidenceDescription(confidence: number): string {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    if (confidence >= 0.4) return 'Low';
    return 'Very Low';
  }

  /**
   * Get soil type emoji for display
   */
  static getSoilTypeEmoji(soilType: string): string {
    const soilEmojis: Record<string, string> = {
      'Clay': '🧱',
      'Sandy': '🏖️', 
      'Loamy': '🌱',
      'Silt': '💨',
      'Sand': '🏜️',
      'Loam': '🌿',
      'Clay Loam': '🟤',
      'Sandy Loam': '🟡',
      'Silty Clay': '🔸',
      'Silty Clay Loam': '🔹',
      'Sandy Clay': '🟠',
      'Sandy Clay Loam': '🟢',
      'Silt Loam': '⚪'
    };
    
    return soilEmojis[soilType] || '🌍';
  }
}
