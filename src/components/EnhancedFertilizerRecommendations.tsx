import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, AlertCircle, DollarSign, Calendar, Droplets, Thermometer, Brain } from "lucide-react";
import { FERTILIZER_INFO } from "@/services/fertilizerMLService";
import { useLanguage } from "@/contexts/LanguageContext";

interface FormData {
  fieldName: string;
  fieldSize: string;
  sizeUnit: string;
  cropType: string;
  soilPH: string;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  soilType: string;
  temperature: string;
  humidity: string;
  soilMoisture: string;
}

interface EnhancedRecommendation {
  primaryFertilizer: {
    name: string;
    amount: string;
    reason: string;
    applicationMethod: string;
  };
  secondaryFertilizer: {
    name: string;
    amount: string;
    reason: string;
    applicationMethod: string;
  };
  organicOptions: Array<{
    name: string;
    amount: string;
    benefits: string;
    applicationTiming: string;
  }>;
  applicationTiming: {
    primary: string;
    secondary: string;
    organic: string;
  };
  costEstimate: {
    primary: string;
    secondary: string;
    organic: string;
    total: string;
  };
  soilConditionAnalysis: {
    phStatus: string;
    nutrientDeficiency: string[];
    moistureStatus: string;
    recommendations: string[];
  };
  mlPrediction: {
    fertilizer: string;
    confidence: number;
  };
}

interface EnhancedFertilizerRecommendationsProps {
  recommendations: EnhancedRecommendation | null;
  formData: FormData | null;
}

const EnhancedFertilizerRecommendations = ({ recommendations, formData }: EnhancedFertilizerRecommendationsProps) => {
  const { t } = useLanguage();
  
  if (!recommendations || !formData) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
          <AlertCircle className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{t('dashboard.noRecommendationsYet')}</h3>
          <p className="text-sm sm:text-base text-gray-600 text-center">
            {t('dashboard.completeFormForRecommendations')}
          </p>
        </CardContent>
      </Card>
    );
  }

  const convertToHectares = (size: number, unit: string): number => {
    switch (unit) {
      case 'acres': return size * 0.404686;
      case 'bigha': return size * 0.1338;
      case 'hectares':
      default: return size;
    }
  };

  const fieldSizeInHectares = convertToHectares(parseFloat(formData.fieldSize), formData.sizeUnit);
  const fertilizerInfo = FERTILIZER_INFO[recommendations.mlPrediction.fertilizer as keyof typeof FERTILIZER_INFO];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ML Prediction Card */}
      <Card className="border-2 border-grass-200 bg-grass-50">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
            <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-grass-600" />
            <span>{t('dashboard.mlModelPrediction')}</span>
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            {t('dashboard.aiPoweredRecommendation')}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-grass-800 mb-2">
                {recommendations.mlPrediction.fertilizer}
              </h3>
              {fertilizerInfo && (
                <div className="space-y-1">
                  <p className="text-sm sm:text-base text-gray-600">{fertilizerInfo.description}</p>
                  <Badge variant="secondary" className="text-xs sm:text-sm">
                    NPK: {fertilizerInfo.npk}
                  </Badge>
                </div>
              )}
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-grass-600">
                {recommendations.mlPrediction.confidence}%
              </div>
              <div className="text-xs sm:text-sm text-gray-500">{t('dashboard.confidence')}</div>
            </div>
          </div>
        </CardContent>
      </Card>



      {/* Soil Condition Analysis */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl">{t('dashboard.soilConditionAnalysis')}</CardTitle>
          <CardDescription className="text-sm sm:text-base">{t('dashboard.detailedSoilAnalysis')}</CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-sm sm:text-base">{t('dashboard.currentStatus')}</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base">{t('dashboard.phStatus')}:</span>
                  <Badge variant="secondary" className="text-xs sm:text-sm">{recommendations.soilConditionAnalysis.phStatus}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base">{t('dashboard.moistureStatus')}:</span>
                  <Badge variant="secondary" className="text-xs sm:text-sm">{recommendations.soilConditionAnalysis.moistureStatus}</Badge>
                </div>
                <div>
                  <span className="font-medium text-sm sm:text-base">{t('dashboard.nutrientDeficiencies')}:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {recommendations.soilConditionAnalysis.nutrientDeficiency.length > 0 ? (
                      recommendations.soilConditionAnalysis.nutrientDeficiency.map((nutrient, index) => (
                        <Badge key={index} variant="destructive" className="text-xs">
                          {nutrient}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="secondary" className="text-xs">{t('dashboard.noneDetected')}</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm sm:text-base">{t('dashboard.recommendations')}</h4>
              <ul className="space-y-1 text-xs sm:text-sm">
                {recommendations.soilConditionAnalysis.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-grass-600 mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fertilizer Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <Leaf className="h-5 w-5 text-grass-600" />
              <span>{t('dashboard.primaryFertilizer')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-base sm:text-lg">{recommendations.primaryFertilizer.name}</h3>
                <p className="text-grass-600 font-medium text-sm sm:text-base">{recommendations.primaryFertilizer.amount}</p>
              </div>
              <div>
                <h4 className="font-medium text-xs sm:text-sm text-gray-600">{t('dashboard.reason')}:</h4>
                <p className="text-xs sm:text-sm">{recommendations.primaryFertilizer.reason}</p>
              </div>
              <div>
                <h4 className="font-medium text-xs sm:text-sm text-gray-600">{t('dashboard.applicationMethod')}:</h4>
                <p className="text-xs sm:text-sm">{recommendations.primaryFertilizer.applicationMethod}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <Leaf className="h-5 w-5 text-blue-600" />
              <span>{t('dashboard.secondaryFertilizer')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-base sm:text-lg">{recommendations.secondaryFertilizer.name}</h3>
                <p className="text-blue-600 font-medium text-sm sm:text-base">{recommendations.secondaryFertilizer.amount}</p>
              </div>
              <div>
                <h4 className="font-medium text-xs sm:text-sm text-gray-600">{t('dashboard.reason')}:</h4>
                <p className="text-xs sm:text-sm">{recommendations.secondaryFertilizer.reason}</p>
              </div>
              <div>
                <h4 className="font-medium text-xs sm:text-sm text-gray-600">{t('dashboard.applicationMethod')}:</h4>
                <p className="text-xs sm:text-sm">{recommendations.secondaryFertilizer.applicationMethod}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Organic Alternatives */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl">{t('dashboard.organicAlternatives')}</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            {t('dashboard.sustainableOptions')}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.organicOptions.map((option, index) => (
              <div key={index} className="p-4 border rounded-lg bg-green-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm sm:text-base">{option.name}</h4>
                  <Badge variant="secondary" className="text-xs">{option.amount}</Badge>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mb-2">{option.benefits}</p>
                <div className="text-xs text-green-700">
                  <strong>{t('dashboard.timing')}:</strong> {option.applicationTiming}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Application Timing and Cost */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <Calendar className="h-5 w-5 text-grass-600" />
              <span>{t('dashboard.applicationTiming')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-xs sm:text-sm text-gray-600">{t('dashboard.primaryFertilizer')}:</h4>
                <p className="text-xs sm:text-sm">{recommendations.applicationTiming.primary}</p>
              </div>
              <div>
                <h4 className="font-medium text-xs sm:text-sm text-gray-600">{t('dashboard.secondaryFertilizer')}:</h4>
                <p className="text-xs sm:text-sm">{recommendations.applicationTiming.secondary}</p>
              </div>
              <div>
                <h4 className="font-medium text-xs sm:text-sm text-gray-600">{t('dashboard.organicOptions')}:</h4>
                <p className="text-xs sm:text-sm">{recommendations.applicationTiming.organic}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <DollarSign className="h-5 w-5 text-grass-600" />
              <span>{t('dashboard.costEstimate')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-xs sm:text-sm">{t('dashboard.primaryFertilizer')}:</span>
                <span className="font-medium text-sm sm:text-base">{recommendations.costEstimate.primary}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs sm:text-sm">{t('dashboard.secondaryFertilizer')}:</span>
                <span className="font-medium text-sm sm:text-base">{recommendations.costEstimate.secondary}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs sm:text-sm">{t('dashboard.organicOptions')}:</span>
                <span className="font-medium text-sm sm:text-base">{recommendations.costEstimate.organic}</span>
              </div>
              <hr />
              <div className="flex justify-between">
                <span className="font-semibold text-sm sm:text-base">{t('dashboard.totalEstimate')}:</span>
                <span className="font-bold text-grass-600 text-sm sm:text-base">{recommendations.costEstimate.total}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {t('dashboard.for')} {fieldSizeInHectares.toFixed(2)} {t('dashboard.hectares')} ({formData.fieldSize} {formData.sizeUnit})
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedFertilizerRecommendations;