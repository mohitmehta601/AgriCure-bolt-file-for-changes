import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { RefreshCw, Wifi, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchThingSpeakHistoricalData, ThingSpeakData } from "@/services/thingSpeakService";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useLanguage } from "@/contexts/LanguageContext";
import { useRealTimeData } from "@/contexts/RealTimeDataContext";

const RealTimeSoilAnalysis = () => {
  const { t } = useLanguage();
  const { realTimeData: data, isLoading: loading, isConnected, refreshData } = useRealTimeData();
  const [historicalData, setHistoricalData] = useState<any[]>([]);

  const loadHistoricalData = async () => {
    try {
      const historicalData = await fetchThingSpeakHistoricalData(24);
      if (historicalData && historicalData.length > 0) {
        const chartData = historicalData.map((item, index) => {
          const timestamp = new Date(item.timestamp);
          const now = new Date();
          const hoursAgo = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60 * 60));
          
          return {
            time: hoursAgo <= 0 ? 'Now' : `${hoursAgo}h ago`,
            nitrogen: item.nitrogen,
            phosphorus: item.phosphorus,
            potassium: item.potassium,
            moisture: item.soilMoisture,
            temperature: item.temperature,
            humidity: item.humidity,
            ph: item.soilPH
          };
        }).reverse();
        setHistoricalData(chartData);
      }
    } catch (error) {
      console.error('Error loading historical data:', error);
      const mockHistorical = Array.from({ length: 24 }, (_, i) => ({
        time: `${23 - i}h ago`,
        nitrogen: 40 + Math.random() * 20,
        phosphorus: 20 + Math.random() * 15,
        potassium: 140 + Math.random() * 40,
        moisture: 60 + Math.random() * 20,
        temperature: 20 + Math.random() * 10,
        humidity: 65 + Math.random() * 20,
        ph: 6.5
      }));
      setHistoricalData(mockHistorical);
    }
  };

  useEffect(() => {
    loadHistoricalData();

    const interval = setInterval(() => {
      loadHistoricalData();
    }, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  type NutrientType = 'nitrogen' | 'phosphorus' | 'potassium';

  const getNutrientStatus = (type: NutrientType, value: number) => {
    if (type === 'nitrogen') {
      if (value > 180) return { status: 'critical', color: 'text-red-600' };
      if (value >= 81) return { status: 'optimal', color: 'text-green-600' };
      return { status: 'warning', color: 'text-yellow-600' };
    }
    if (value > 350) return { status: 'critical', color: 'text-red-600' };
    if (value >= 111) return { status: 'optimal', color: 'text-green-600' };
    return { status: 'warning', color: 'text-yellow-600' };
  };

  const clampPercent = (percent: number) => Math.max(0, Math.min(100, percent));

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-3 sm:p-6">
                <div className="h-3 sm:h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 sm:h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Connection Status and Refresh */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <>
              <Wifi className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              <span className="text-xs sm:text-sm text-green-600">{t('dashboard.connectedToThingSpeak')}</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
              <span className="text-xs sm:text-sm text-red-600">{t('dashboard.usingDemoData')}</span>
            </>
          )}
        </div>
        <Button onClick={() => { refreshData(); loadHistoricalData(); }} variant="outline" size="sm" disabled={loading} className="text-xs sm:text-sm">
          <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {t('dashboard.refreshData')}
        </Button>
      </div>

      {/* Real-time Parameter Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium">{t('dashboard.nitrogen')}</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-2xl font-bold mb-2">{data?.nitrogen.toFixed(1)} mg/kg</div>
            <Progress value={clampPercent(((data?.nitrogen ?? 0) / 240) * 100)} className="h-1 sm:h-2 mb-2" />
            {(() => { const s = getNutrientStatus('nitrogen', data?.nitrogen ?? 0); return (
              <div className={`text-xs ${s.color}`}>{s.status.toUpperCase()}</div>
            ); })()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium">{t('dashboard.phosphorus')}</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-2xl font-bold mb-2">{data?.phosphorus.toFixed(1)} mg/kg</div>
            <Progress value={clampPercent(((data?.phosphorus ?? 0) / 400) * 100)} className="h-1 sm:h-2 mb-2" />
            {(() => { const s = getNutrientStatus('phosphorus', data?.phosphorus ?? 0); return (
              <div className={`text-xs ${s.color}`}>{s.status.toUpperCase()}</div>
            ); })()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium">{t('dashboard.potassium')}</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-2xl font-bold mb-2">{data?.potassium.toFixed(1)} mg/kg</div>
            <Progress value={clampPercent(((data?.potassium ?? 0) / 400) * 100)} className="h-1 sm:h-2 mb-2" />
            {(() => { const s = getNutrientStatus('potassium', data?.potassium ?? 0); return (
              <div className={`text-xs ${s.color}`}>{s.status.toUpperCase()}</div>
            ); })()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium">{t('dashboard.soilPH')}</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-2xl font-bold mb-2">{data?.soilPH.toFixed(1)}</div>
            <Progress value={clampPercent(((data?.soilPH ?? 0) / 14) * 100)} className="h-1 sm:h-2 mb-2" />
            {(() => {
              const value = data?.soilPH ?? 0;
              const min = 6.0, max = 7.5;
              const status = (value >= min && value <= max) ? 'optimal' : (value < min * 0.8 || value > max * 1.2) ? 'critical' : 'warning';
              const color = status === 'optimal' ? 'text-green-600' : status === 'critical' ? 'text-red-600' : 'text-yellow-600';
              return <div className={`text-xs ${color}`}>{status.toUpperCase()}</div>;
            })()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium">{t('dashboard.soilMoisture')}</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-2xl font-bold mb-2">{data?.soilMoisture.toFixed(1)}%</div>
            <Progress value={clampPercent(data?.soilMoisture ?? 0)} className="h-1 sm:h-2 mb-2" />
            {(() => {
              const value = data?.soilMoisture ?? 0;
              const min = 40, max = 80;
              const status = (value >= min && value <= max) ? 'optimal' : (value < min * 0.8 || value > max * 1.2) ? 'critical' : 'warning';
              const color = status === 'optimal' ? 'text-green-600' : status === 'critical' ? 'text-red-600' : 'text-yellow-600';
              return <div className={`text-xs ${color}`}>{status.toUpperCase()}</div>;
            })()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium">{t('dashboard.temperature')}</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-2xl font-bold mb-2">{data?.temperature.toFixed(1)}°C</div>
            <Progress value={clampPercent(((data?.temperature ?? 0) / 50) * 100)} className="h-1 sm:h-2 mb-2" />
            {(() => {
              const value = data?.temperature ?? 0;
              const min = 15, max = 35;
              const status = (value >= min && value <= max) ? 'optimal' : (value < min * 0.8 || value > max * 1.2) ? 'critical' : 'warning';
              const color = status === 'optimal' ? 'text-green-600' : status === 'critical' ? 'text-red-600' : 'text-yellow-600';
              return <div className={`text-xs ${color}`}>{status.toUpperCase()}</div>;
            })()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium">{t('dashboard.humidity')}</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-2xl font-bold mb-2">{data?.humidity.toFixed(1)}%</div>
            <Progress value={clampPercent(data?.humidity ?? 0)} className="h-1 sm:h-2 mb-2" />
            {(() => {
              const value = data?.humidity ?? 0;
              const min = 50, max = 80;
              const status = (value >= min && value <= max) ? 'optimal' : (value < min * 0.8 || value > max * 1.2) ? 'critical' : 'warning';
              const color = status === 'optimal' ? 'text-green-600' : status === 'critical' ? 'text-red-600' : 'text-yellow-600';
              return <div className={`text-xs ${color}`}>{status.toUpperCase()}</div>;
            })()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium">{t('dashboard.lastUpdated')}</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-sm font-medium">
              {data ? new Date(data.timestamp).toLocaleTimeString() : 'N/A'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {data ? new Date(data.timestamp).toLocaleDateString() : 'N/A'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl">{t('dashboard.npkLevelsTrend')}</CardTitle>
            <CardDescription className="text-sm sm:text-base">{t('dashboard.historicalNutrientLevels')}</CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="nitrogen" stroke="#22c55e" strokeWidth={2} />
                <Line type="monotone" dataKey="phosphorus" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="potassium" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl">{t('dashboard.environmentalConditions')}</CardTitle>
            <CardDescription className="text-sm sm:text-base">{t('dashboard.temperatureHumidityMoisture')}</CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={historicalData.slice(-6)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="temperature" fill="#ef4444" />
                <Bar dataKey="humidity" fill="#06b6d4" />
                <Bar dataKey="moisture" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeSoilAnalysis;