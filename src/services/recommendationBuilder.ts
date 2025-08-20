import { FertilizerRecommendation } from "@/services/supabaseClient";
import { FERTILIZER_INFO, CROP_TYPES, SOIL_TYPES } from "@/services/fertilizerMLService";

export interface EnhancedRecommendation {
  primaryFertilizer: { name: string; amount: string; reason: string; applicationMethod: string };
  secondaryFertilizer: { name: string; amount: string; reason: string; applicationMethod: string };
  organicOptions: Array<{ name: string; amount: string; benefits: string; applicationTiming: string }>;
  applicationTiming: { primary: string; secondary: string; organic: string };
  costEstimate: { primary: string; secondary: string; organic: string; total: string };
  soilConditionAnalysis: { phStatus: string; nutrientDeficiency: string[]; moistureStatus: string; recommendations: string[] };
  mlPrediction: { fertilizer: string; confidence: number };
}

const convertToHectares = (size: number, unit: string): number => {
  switch (unit) {
    case 'acres': return size * 0.404686;
    case 'bigha': return size * 0.1338;
    case 'hectares':
    default: return size;
  }
};

export const buildEnhancedRecommendationFromRecord = (rec: FertilizerRecommendation): { recommendations: EnhancedRecommendation; formData: any } => {
  const pH = rec.soil_ph;
  const nitrogen = rec.nitrogen;
  const phosphorus = rec.phosphorus;
  const potassium = rec.potassium;
  const moisture = rec.soil_moisture;
  const fieldSize = rec.field_size;
  const sizeUnit = rec.field_size_unit;

  const hectares = convertToHectares(fieldSize, sizeUnit);

  const phStatus = pH < 6.0 ? 'Acidic' : pH > 7.5 ? 'Alkaline' : 'Optimal';
  const moistureStatus = moisture < 40 ? 'Low' : moisture > 80 ? 'High' : 'Optimal';
  const nutrientDeficiency: string[] = [];
  if (nitrogen < 30) nutrientDeficiency.push('Nitrogen');
  if (phosphorus < 15) nutrientDeficiency.push('Phosphorus');
  if (potassium < 120) nutrientDeficiency.push('Potassium');

  const cropName = Object.keys(CROP_TYPES).find(key => CROP_TYPES[key as keyof typeof CROP_TYPES] === parseInt(rec.crop_type)) || 'Unknown';
  const soilName = Object.keys(SOIL_TYPES).find(key => SOIL_TYPES[key as keyof typeof SOIL_TYPES] === parseInt(rec.soil_type)) || 'Unknown';

  const fertilizerInfo = FERTILIZER_INFO[rec.ml_prediction as keyof typeof FERTILIZER_INFO];

  const primaryFertilizer = {
    name: rec.primary_fertilizer || rec.ml_prediction,
    amount: `${Math.round(100 * hectares)} kg`,
    reason: fertilizerInfo ? fertilizerInfo.description : `ML model recommends this fertilizer for ${cropName} in ${soilName} soil`,
    applicationMethod: fertilizerInfo ? fertilizerInfo.application : 'Apply as per standard agricultural practices'
  };

  let secondaryFertilizer = {
    name: rec.secondary_fertilizer || 'Organic Compost',
    amount: `${Math.round(1000 * hectares)} kg`,
    reason: 'Improves soil structure and provides slow-release nutrients',
    applicationMethod: 'Apply 2-3 weeks before planting and incorporate into soil'
  };
  if (nutrientDeficiency.includes('Phosphorus')) {
    secondaryFertilizer = {
      name: 'DAP',
      amount: `${Math.round(50 * hectares)} kg`,
      reason: 'Addresses phosphorus deficiency identified in soil analysis',
      applicationMethod: 'Apply as basal dose during soil preparation'
    };
  } else if (nutrientDeficiency.includes('Potassium')) {
    secondaryFertilizer = {
      name: 'Potassium sulfate',
      amount: `${Math.round(40 * hectares)} kg`,
      reason: 'Addresses potassium deficiency for better fruit quality',
      applicationMethod: 'Apply during fruit development stage'
    };
  }

  const primaryCost = Math.round(hectares * 4000);
  const secondaryCost = Math.round(hectares * 2500);
  const organicCost = Math.round(hectares * 2000);
  const totalCost = primaryCost + secondaryCost + organicCost;

  const recommendations: EnhancedRecommendation = {
    primaryFertilizer,
    secondaryFertilizer,
    organicOptions: [
      { name: 'Vermicompost', amount: `${Math.round(1000 * hectares)} kg`, benefits: 'Rich in nutrients, improves soil structure and water retention', applicationTiming: 'Apply 3-4 weeks before planting' },
      { name: 'Neem Cake', amount: `${Math.round(200 * hectares)} kg`, benefits: 'Natural pest deterrent and slow-release nitrogen source', applicationTiming: 'Apply at the time of land preparation' },
      { name: 'Bone Meal', amount: `${Math.round(150 * hectares)} kg`, benefits: 'Excellent source of phosphorus and calcium', applicationTiming: 'Apply as basal dose before sowing' }
    ],
    applicationTiming: {
      primary: 'Apply 1-2 weeks before planting for optimal nutrient availability',
      secondary: 'Apply during active growth phase or as recommended for specific fertilizer',
      organic: 'Apply 3-4 weeks before planting to allow decomposition'
    },
    costEstimate: {
      primary: `₹${primaryCost.toLocaleString('en-IN')}`,
      secondary: `₹${secondaryCost.toLocaleString('en-IN')}`,
      organic: `₹${organicCost.toLocaleString('en-IN')}`,
      total: rec.cost_estimate || `₹${totalCost.toLocaleString('en-IN')}`
    },
    soilConditionAnalysis: {
      phStatus,
      nutrientDeficiency,
      moistureStatus,
      recommendations: [
        phStatus !== 'Optimal' ? `Adjust soil pH using ${pH < 6.0 ? 'lime' : 'sulfur'}` : 'Maintain current pH levels',
        moistureStatus === 'Low' ? 'Increase irrigation frequency' : moistureStatus === 'High' ? 'Improve drainage' : 'Maintain current moisture levels',
        nutrientDeficiency.length > 0 ? `Address ${nutrientDeficiency.join(', ')} deficiency` : 'Nutrient levels are adequate',
        'Regular soil testing every 6 months is recommended',
        'Consider crop rotation to maintain soil health'
      ].filter(Boolean) as string[]
    },
    mlPrediction: {
      fertilizer: rec.ml_prediction,
      confidence: rec.confidence_score
    }
  };

  const formData = {
    fieldName: rec.field_name,
    fieldSize: String(rec.field_size),
    sizeUnit: rec.field_size_unit,
    cropType: rec.crop_type,
    soilPH: String(rec.soil_ph),
    nitrogen: String(rec.nitrogen),
    phosphorus: String(rec.phosphorus),
    potassium: String(rec.potassium),
    soilType: rec.soil_type,
    temperature: String(rec.temperature),
    humidity: String(rec.humidity),
    soilMoisture: String(rec.soil_moisture)
  };

  return { recommendations, formData };
};


