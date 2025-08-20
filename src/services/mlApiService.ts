export interface FertilizerPredictionInput {
  Temperature: number;
  Humidity: number;
  Moisture: number;
  Soil_Type: string;
  Crop_Type: string;
  Nitrogen: number;
  Potassium: number;
  Phosphorous: number;
}

export interface FertilizerPredictionOutput {
  fertilizer: string;
  confidence: number;
  prediction_info: {
    accuracy: number;
    n_estimators: number;
    feature_importance: {
      Temperature: number;
      Humidity: number;
      Moisture: number;
      Soil_Type: number;
      Crop_Type: number;
      Nitrogen: number;
      Potassium: number;
      Phosphorous: number;
    };
  };
}

export interface ModelInfo {
  model_type: string;
  accuracy: number;
  n_estimators: number;
  feature_importance: {
    Temperature: number;
    Humidity: number;
    Moisture: number;
    Soil_Type: number;
    Crop_Type: number;
    Nitrogen: number;
    Potassium: number;
    Phosphorous: number;
  };
  available_fertilizers: string[];
  available_soil_types: string[];
  available_crop_types: string[];
}

class MLApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'http://localhost:8000';
  }

  async getPrediction(input: FertilizerPredictionInput): Promise<FertilizerPredictionOutput> {
    try {
      const response = await fetch(`${this.baseUrl}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting prediction:', error);
      throw error;
    }
  }

  async getModelInfo(): Promise<ModelInfo> {
    try {
      const response = await fetch(`${this.baseUrl}/model-info`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting model info:', error);
      throw error;
    }
  }

  async healthCheck(): Promise<{status: string; model_loaded: boolean; model_accuracy: number}> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      return {
        status: 'unhealthy',
        model_loaded: false,
        model_accuracy: 0
      };
    }
  }

  validateInput(input: FertilizerPredictionInput): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (input.Temperature < 0 || input.Temperature > 50) {
      errors.push('Temperature must be between 0 and 50°C');
    }

    if (input.Humidity < 0 || input.Humidity > 100) {
      errors.push('Humidity must be between 0 and 100%');
    }

    if (input.Moisture < 0 || input.Moisture > 100) {
      errors.push('Moisture must be between 0 and 100%');
    }

    if (input.Nitrogen < 0 || input.Nitrogen > 150) {
      errors.push('Nitrogen must be between 0 and 150');
    }

    if (input.Potassium < 0 || input.Potassium > 100) {
      errors.push('Potassium must be between 0 and 100');
    }

    if (input.Phosphorous < 0 || input.Phosphorous > 100) {
      errors.push('Phosphorous must be between 0 and 100');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export const mlApiService = new MLApiService();
export default mlApiService;