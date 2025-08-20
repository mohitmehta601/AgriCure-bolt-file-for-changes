
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, AlertCircle, DollarSign, Calendar } from "lucide-react";

const FertilizerRecommendations = ({ recommendations, soilData }) => {
  if (!recommendations || !soilData) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recommendations Yet</h3>
          <p className="text-gray-600 text-center">
            Please complete the soil analysis first to get personalized fertilizer recommendations.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Leaf className="h-5 w-5 text-grass-600" />
              <span>Primary Fertilizer</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-lg">{recommendations.primaryFertilizer.name}</h3>
                <p className="text-grass-600 font-medium">{recommendations.primaryFertilizer.amount}</p>
              </div>
              <p className="text-gray-600">{recommendations.primaryFertilizer.reason}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Leaf className="h-5 w-5 text-grass-600" />
              <span>Secondary Fertilizer</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-lg">{recommendations.secondaryFertilizer.name}</h3>
                <p className="text-grass-600 font-medium">{recommendations.secondaryFertilizer.amount}</p>
              </div>
              <p className="text-gray-600">{recommendations.secondaryFertilizer.reason}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organic Alternatives</CardTitle>
          <CardDescription>
            Sustainable options for long-term soil health
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {recommendations.organicOptions.map((option, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{option.name}</h4>
                  <Badge variant="secondary">{option.amount}</Badge>
                </div>
                <p className="text-sm text-gray-600">{option.benefits}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-grass-600" />
              <span>Application Timing</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{recommendations.applicationTiming}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-grass-600" />
              <span>Cost Estimate</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-grass-600">{recommendations.costEstimate}</p>
            <p className="text-sm text-gray-600 mt-1">For {soilData.fieldSize} hectares</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FertilizerRecommendations;
