import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchThingSpeakData, ThingSpeakData } from '@/services/thingSpeakService';

interface RealTimeDataContextType {
  realTimeData: ThingSpeakData | null;
  isLoading: boolean;
  isConnected: boolean;
  refreshData: () => Promise<void>;
}

const RealTimeDataContext = createContext<RealTimeDataContextType | undefined>(undefined);

export const useRealTimeData = () => {
  const context = useContext(RealTimeDataContext);
  if (context === undefined) {
    throw new Error('useRealTimeData must be used within a RealTimeDataProvider');
  }
  return context;
};

interface RealTimeDataProviderProps {
  children: ReactNode;
}

export const RealTimeDataProvider: React.FC<RealTimeDataProviderProps> = ({ children }) => {
  const [realTimeData, setRealTimeData] = useState<ThingSpeakData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchThingSpeakData();
      if (data) {
        setRealTimeData(data);
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      console.error('Error loading real-time data:', error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  useEffect(() => {
    loadData();
    
    const interval = setInterval(loadData, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const value: RealTimeDataContextType = {
    realTimeData,
    isLoading,
    isConnected,
    refreshData
  };

  return (
    <RealTimeDataContext.Provider value={value}>
      {children}
    </RealTimeDataContext.Provider>
  );
}; 