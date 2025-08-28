import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mlApiService, FertilizerPredictionInput } from "@/services/mlApiService";
import { useToast } from "@/hooks/use-toast";

export const MLTestComponent = () => {
  const [formData, setFormData] = useState<FertilizerPredictionInput>({
    Temperature: 25,
    Humidity: 70,
    Moisture: 45,
    Soil_Type: "Loamy",
    Crop_Type: "Wheat",
    Nitrogen: 45,
    Potassium: 30,
    Phosphorous: 35
  });

  const [prediction, setPrediction] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<string>("Unknown");
  const { toast } = useToast();

  const handleChange = (field: keyof FertilizerPredictionInput, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: typeof value === 'string' && !isNaN(Number(value)) ? Number(value) : value
    }));
  };

  const checkApiHealth = async () => {
    try {
      const isHealthy = await mlApiService.healthCheck();
      setApiStatus(isHealthy ? "Healthy" : "Unhealthy");
      toast({
        title: "API Health Check",
        description: isHealthy ? "ML API is running and healthy!" : "ML API is not responding",
        variant: isHealthy ? "default" : "destructive"
      });
    } catch (error) {
      setApiStatus("Error");
      toast({
        title: "Health Check Failed",
        description: "Failed to check API health",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validation = mlApiService.validateInput(formData);
      if (!validation.isValid) {
        toast({
          title: "Validation Error",
          description: validation.errors.join(", "),
          variant: "destructive"
        });
        return;
      }

      const result = await mlApiService.getPrediction(formData);
      setPrediction(result.fertilizer);
      
      toast({
        title: "Prediction Successful!",
        description: `Recommended fertilizer: ${result.fertilizer}`,
      });
      
    } catch (error) {
      console.error('Prediction failed:', error);
      toast({
        title: "Prediction Failed",
        description: error instanceof Error ? error.message : "Failed to get prediction",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-800">
            🧠 ML Fertilizer Recommendation Test
          </CardTitle>
          <CardDescription>
            Test the machine learning model integration with your FastAPI backend
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* API Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-semibold">API Status</h3>
              <p className="text-sm text-gray-600">Check if the ML API is running</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                apiStatus === "Healthy" ? "bg-green-100 text-green-800" :
                apiStatus === "Unhealthy" ? "bg-red-100 text-red-800" :
                "bg-gray-100 text-gray-800"
              }`}>
                {apiStatus}
              </span>
              <Button onClick={checkApiHealth} variant="outline" size="sm">
                Check Health
              </Button>
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Environmental Conditions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-800">Environmental Conditions</h3>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="temperature">Temperature (°C)</Label>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      value={formData.Temperature}
                      onChange={(e) => handleChange("Temperature", e.target.value)}
                      placeholder="25"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="humidity">Humidity (%)</Label>
                    <Input
                      id="humidity"
                      type="number"
                      step="0.1"
                      value={formData.Humidity}
                      onChange={(e) => handleChange("Humidity", e.target.value)}
                      placeholder="70"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="moisture">Moisture (%)</Label>
                    <Input
                      id="moisture"
                      type="number"
                      step="0.1"
                      value={formData.Moisture}
                      onChange={(e) => handleChange("Moisture", e.target.value)}
                      placeholder="45"
                    />
                  </div>
                </div>
              </div>

              {/* Soil and Crop */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-800">Soil & Crop Information</h3>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="soilType">Soil Type</Label>
                    <Select value={formData.Soil_Type} onValueChange={(value) => handleChange("Soil_Type", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Clayey">Clayey</SelectItem>
                        <SelectItem value="Loamy">Loamy</SelectItem>
                        <SelectItem value="Red">Red</SelectItem>
                        <SelectItem value="Black">Black</SelectItem>
                        <SelectItem value="Sandy">Sandy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="cropType">Crop Type</Label>
                    <Select value={formData.Crop_Type} onValueChange={(value) => handleChange("Crop_Type", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rice">Rice</SelectItem>
                        <SelectItem value="Wheat">Wheat</SelectItem>
                        <SelectItem value="Sugarcane">Sugarcane</SelectItem>
                        <SelectItem value="Cotton">Cotton</SelectItem>
                        <SelectItem value="coffee">Coffee</SelectItem>
                        <SelectItem value="watermelon">Watermelon</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Soil Chemistry */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-purple-800">Soil Chemistry (mg/kg)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="nitrogen">Nitrogen</Label>
                  <Input
                    id="nitrogen"
                    type="number"
                    step="0.1"
                    value={formData.Nitrogen}
                    onChange={(e) => handleChange("Nitrogen", e.target.value)}
                    placeholder="45"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phosphorous">Phosphorous</Label>
                  <Input
                    id="phosphorous"
                    type="number"
                    step="0.1"
                    value={formData.Phosphorous}
                    onChange={(e) => handleChange("Phosphorous", e.target.value)}
                    placeholder="35"
                  />
                </div>
                
                <div>
                  <Label htmlFor="potassium">Potassium</Label>
                  <Input
                    id="potassium"
                    type="number"
                    step="0.1"
                    value={formData.Potassium}
                    onChange={(e) => handleChange("Potassium", e.target.value)}
                    placeholder="30"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300"
              >
                {isLoading ? "Getting Prediction..." : "Get Fertilizer Recommendation"}
              </Button>
            </div>
          </form>

          {/* Results */}
          {prediction && (
            <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200">
              <h3 className="text-xl font-bold text-green-800 mb-2">🎯 ML Recommendation</h3>
              <p className="text-lg text-green-700">
                <span className="font-semibold">Recommended Fertilizer:</span> {prediction}
              </p>
              <p className="text-sm text-green-600 mt-2">
                This recommendation is based on the soil conditions, crop type, and environmental factors you provided.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
