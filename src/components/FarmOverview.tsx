
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Droplets, Thermometer, Activity } from "lucide-react";

const FarmOverview = ({ soilData, recommendations }) => {
  const getHealthScore = () => {
    if (!soilData) return 0;
    
    let score = 0;
    const pH = parseFloat(soilData.pH);
    const nitrogen = parseFloat(soilData.nitrogen);
    const phosphorus = parseFloat(soilData.phosphorus);
    const potassium = parseFloat(soilData.potassium);
    const organicMatter = parseFloat(soilData.organicMatter);
    
    if (pH >= 6.0 && pH <= 7.5) score += 20;
    else if (pH >= 5.5 && pH <= 8.0) score += 15;
    else score += 5;
    
    if (nitrogen >= 20) score += 20;
    else if (nitrogen >= 10) score += 15;
    else score += 5;
    
    if (phosphorus >= 15) score += 20;
    else if (phosphorus >= 10) score += 15;
    else score += 5;
    
    if (potassium >= 100) score += 20;
    else if (potassium >= 50) score += 15;
    else score += 5;
    
    if (organicMatter >= 3) score += 20;
    else if (organicMatter >= 2) score += 15;
    else score += 5;
    
    return Math.min(score, 100);
  };

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

  const healthScore = getHealthScore();

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Soil Health Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-grass-600" />
              <span className="text-2xl font-bold">{healthScore}%</span>
            </div>
            <Progress value={healthScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Fields Analyzed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-grass-600" />
              <span className="text-2xl font-bold">{soilData ? "1" : "0"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg. Moisture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Droplets className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold">{soilData?.moisture || "0"}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Soil Temp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Thermometer className="h-5 w-5 text-orange-600" />
              <span className="text-2xl font-bold">{soilData?.temperature || "0"}°C</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {soilData ? (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Soil Analysis</CardTitle>
              <CardDescription>Latest data from {soilData.fieldName}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">pH Level:</span>
                  <span className="font-medium">{soilData.pH}</span>
                </div>
                <div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nitrogen:</span>
                    <span className="font-medium">{soilData.nitrogen} ppm</span>
                  </div>
                  <Progress value={clampPercent(((parseFloat(soilData.nitrogen) || 0) / 240) * 100)} className="h-2 mt-1" />
                  {(() => { const v = parseFloat(soilData.nitrogen) || 0; const s = getNutrientStatus('nitrogen', v); return (
                    <div className={`text-xs mt-1 ${s.color}`}>{s.status.toUpperCase()}</div>
                  ); })()}
                </div>
                <div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phosphorus:</span>
                    <span className="font-medium">{soilData.phosphorus} ppm</span>
                  </div>
                  <Progress value={clampPercent(((parseFloat(soilData.phosphorus) || 0) / 400) * 100)} className="h-2 mt-1" />
                  {(() => { const v = parseFloat(soilData.phosphorus) || 0; const s = getNutrientStatus('phosphorus', v); return (
                    <div className={`text-xs mt-1 ${s.color}`}>{s.status.toUpperCase()}</div>
                  ); })()}
                </div>
                <div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Potassium:</span>
                    <span className="font-medium">{soilData.potassium} ppm</span>
                  </div>
                  <Progress value={clampPercent(((parseFloat(soilData.potassium) || 0) / 400) * 100)} className="h-2 mt-1" />
                  {(() => { const v = parseFloat(soilData.potassium) || 0; const s = getNutrientStatus('potassium', v); return (
                    <div className={`text-xs mt-1 ${s.color}`}>{s.status.toUpperCase()}</div>
                  ); })()}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Organic Matter:</span>
                  <span className="font-medium">{soilData.organicMatter}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {recommendations && (
            <Card>
              <CardHeader>
                <CardTitle>Quick Recommendations</CardTitle>
                <CardDescription>Key fertilizer suggestions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-grass-50 rounded-lg">
                    <h4 className="font-semibold text-grass-800">{recommendations.primaryFertilizer.name}</h4>
                    <p className="text-sm text-grass-600">{recommendations.primaryFertilizer.amount}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800">{recommendations.secondaryFertilizer.name}</h4>
                    <p className="text-sm text-blue-600">{recommendations.secondaryFertilizer.amount}</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-800">Cost Estimate</h4>
                    <p className="text-sm text-orange-600">{recommendations.costEstimate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to AgriCure</h3>
            <p className="text-gray-600 text-center max-w-md">
              Get started by analyzing your soil data. Our AI will provide personalized fertilizer recommendations to maximize your crop yields.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FarmOverview;
