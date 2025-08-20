const THINGSPEAK_API_KEY = 'H249ISKWNBTX3MEV';
const THINGSPEAK_CHANNEL_ID = '3014718'; 

export interface ThingSpeakData {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  soilMoisture: number;
  soilPH: number;
  temperature: number;
  humidity: number;
  timestamp: string;
}

export const fetchThingSpeakData = async (): Promise<ThingSpeakData | null> => {
  try {
    const response = await fetch(
      `https://api.thingspeak.com/channels/${THINGSPEAK_CHANNEL_ID}/feeds.json?api_key=${THINGSPEAK_API_KEY}&results=1`
    );
    
    if (!response.ok) {
      console.warn(`ThingSpeak API returned status ${response.status}. Using mock data instead.`);
      return getMockThingSpeakData();
    }
    
    const data = await response.json();
    
    if (data.feeds && data.feeds.length > 0) {
      const feed = data.feeds[0];
      return {
        nitrogen: parseFloat(feed.field1) || 0,
        phosphorus: parseFloat(feed.field2) || 0,
        potassium: parseFloat(feed.field3) || 0,
        temperature: parseFloat(feed.field4) || 0,
        humidity: parseFloat(feed.field5) || 0,
        soilMoisture: parseFloat(feed.field6) || 0,
        soilPH: 6.5, // constant value as requested
        timestamp: feed.created_at
      };
    }
    
    console.warn('No data feeds found in ThingSpeak response. Using mock data instead.');
    return getMockThingSpeakData();
  } catch (error) {
    console.warn('ThingSpeak API unavailable. Using mock data for demonstration:', error);
    return getMockThingSpeakData();
  }
};

export const fetchThingSpeakHistoricalData = async (results: number = 24): Promise<ThingSpeakData[]> => {
  try {
    const response = await fetch(
      `https://api.thingspeak.com/channels/${THINGSPEAK_CHANNEL_ID}/feeds.json?api_key=${THINGSPEAK_API_KEY}&results=${results}`
    );
    
    if (!response.ok) {
      console.warn(`ThingSpeak API returned status ${response.status}. Using mock historical data instead.`);
      return getMockHistoricalData(results);
    }
    
    const data = await response.json();
    
    if (data.feeds && data.feeds.length > 0) {
      return data.feeds.map((feed: any) => ({
        nitrogen: parseFloat(feed.field1) || 0,
        phosphorus: parseFloat(feed.field2) || 0,
        potassium: parseFloat(feed.field3) || 0,
        temperature: parseFloat(feed.field4) || 0,
        humidity: parseFloat(feed.field5) || 0,
        soilMoisture: parseFloat(feed.field6) || 0,
        soilPH: 6.5, // constant value as requested
        timestamp: feed.created_at
      }));
    }
    
    console.warn('No data feeds found in ThingSpeak response. Using mock historical data instead.');
    return getMockHistoricalData(results);
  } catch (error) {
    console.warn('ThingSpeak API unavailable. Using mock historical data for demonstration:', error);
    return getMockHistoricalData(results);
  }
};

// Mock data for demonstration when API is not available
export const getMockThingSpeakData = (): ThingSpeakData => ({
  nitrogen: 45.2,
  phosphorus: 23.8,
  potassium: 156.4, // Now consistently in mg/kg
  soilMoisture: 68.5,
  soilPH: 6.5, // constant value as requested
  temperature: 24.3,
  humidity: 72.1,
  timestamp: new Date().toISOString()
});

// Mock historical data for demonstration when API is not available
export const getMockHistoricalData = (results: number = 24): ThingSpeakData[] => {
  const now = new Date();
  return Array.from({ length: results }, (_, i) => {
    const timestamp = new Date(now.getTime() - (results - 1 - i) * 60 * 60 * 1000); // Hourly intervals
    return {
      nitrogen: 40 + Math.random() * 20,
      phosphorus: 20 + Math.random() * 15,
      potassium: 140 + Math.random() * 40,
      soilMoisture: 60 + Math.random() * 20,
      soilPH: 6.5, // constant value as requested
      temperature: 20 + Math.random() * 10,
      humidity: 65 + Math.random() * 20,
      timestamp: timestamp.toISOString()
    };
  });
};