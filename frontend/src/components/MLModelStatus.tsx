import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, CheckCircle, XCircle, RefreshCw, AlertTriangle } from "lucide-react";
import { mlApiService, ModelInfo } from "@/services/mlApiService";
import { useToast } from "@/hooks/use-toast";

const MLModelStatus = () => {
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const { toast } = useToast();

  const checkModelStatus = async () => {
    setIsLoading(true);
    try {
      const health = await mlApiService.healthCheck();
      setIsConnected(health.model_loaded);
      
      if (health.model_loaded) {
        const info = await mlApiService.getModelInfo();
        setModelInfo(info);
      }
      
      setLastChecked(new Date());
    } catch (error) {
      console.error('Failed to check ML model status:', error);
      setIsConnected(false);
      setModelInfo(null);
      toast({
        title: "ML Model Status",
        description: "Unable to connect to ML model. Using fallback predictions.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkModelStatus();
    
    const interval = setInterval(checkModelStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
          <Brain className="h-5 w-5 text-purple-600" />
          <span>ML Model Status</span>
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Real-time status of the machine learning prediction model
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="font-medium">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <Button
              onClick={checkModelStatus}
              variant="outline"
              size="sm"
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
          </div>

          {/* Model Information */}
          {modelInfo && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Model Type:</span>
                  <Badge variant="secondary">{modelInfo.model_type}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Available Features:</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {modelInfo.available_soil_types.length + modelInfo.available_crop_types.length + modelInfo.available_fertilizers.length}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Soil Types:</span>
                  <span className="text-sm font-medium">{modelInfo.available_soil_types.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Crop Types:</span>
                  <span className="text-sm font-medium">{modelInfo.available_crop_types.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Fertilizers:</span>
                  <span className="text-sm font-medium">{modelInfo.available_fertilizers.length}</span>
                </div>
              </div>
            </div>
          )}

          {/* Fallback Warning */}
          {!isConnected && (
            <div className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Using Fallback Predictions</p>
                <p className="text-xs text-yellow-700 mt-1">
                  The ML model is unavailable. Predictions are using rule-based algorithms with reduced accuracy.
                </p>
              </div>
            </div>
          )}

          {/* Last Checked */}
          {lastChecked && (
            <div className="text-xs text-gray-500 flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span>Last checked: {lastChecked.toLocaleTimeString()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MLModelStatus;