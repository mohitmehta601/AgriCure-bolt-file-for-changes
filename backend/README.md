# Fertilizer Recommendation API

A FastAPI backend that provides fertilizer recommendations based on soil and crop conditions using machine learning.

## Features

- *ML Model*: Random Forest Classifier trained on agricultural dataset
- *Real-time Prediction*: Get fertilizer recommendations instantly
- *Input Validation*: Comprehensive validation for all input parameters
- *Model Information*: Access model accuracy and feature importance
- *Retraining*: Ability to retrain the model with updated data

## API Endpoints

### GET /
- Root endpoint with API information
- Returns API status and model information

### GET /health
- Health check endpoint
- Returns model status and accuracy

### POST /predict
- Main prediction endpoint
- Accepts soil and crop parameters
- Returns fertilizer recommendation with confidence

### GET /model-info
- Detailed model information
- Feature importance and available categories

### POST /retrain
- Retrain the model with current dataset
- Useful for model updates

## Input Format

json
{
  "Temperature": 25.0,
  "Humidity": 80.0,
  "Moisture": 30.0,
  "Soil_Type": "Loamy",
  "Crop_Type": "rice",
  "Nitrogen": 85.0,
  "Potassium": 45.0,
  "Phosphorous": 35.0
}


## Output Format

json
{
  "fertilizer": "Urea",
  "confidence": 0.85,
  "model_info": {
    "accuracy": 0.92,
    "n_estimators": 100,
    "feature_importance": {
      "Temperature": 0.15,
      "Humidity": 0.12,
      "Moisture": 0.18,
      "Soil_Type": 0.10,
      "Crop_Type": 0.08,
      "Nitrogen": 0.20,
      "Potassium": 0.08,
      "Phosphorous": 0.09
    }
  }
}


## Installation

1. Install Python dependencies:
bash
pip install -r requirements.txt


2. Run the API:
bash
python main.py


3. Test the model:
bash
python test_model.py


## Model Details

- *Algorithm*: Random Forest Classifier
- *Dataset*: f2.csv (agricultural data)
- *Features*: 8 input parameters
- *Target*: Fertilizer type prediction
- *Accuracy*: Typically 90%+ on test data

## Available Categories

### Soil Types
- Clayey, Loamy, Red, Black, Sandy

### Crop Types
- rice, Wheat, Sugarcane, Pulses, Paddy, pomegranate, Oil seeds, Millets, Maize, Ground Nuts, Cotton, coffee, watermelon, Barley, Tobacco, Jute, Tea

### Fertilizers
- Urea, TSP, Superphosphate, Potassium sulfate, Potassium chloride, DAP, 28-28, 20-20, 17-17-17

## Input Validation

- Temperature: 0-50°C
- Humidity: 0-100%
- Moisture: 0-100%
- Nitrogen: 0-150
- Potassium: 0-100
- Phosphorous: 0-100
- Soil_Type: Must be one of the available soil types
- Crop_Type: Must be one of the available crop types

## CORS Support

The API includes CORS middleware to allow frontend applications to make requests from different origins.

## Error Handling

- Comprehensive input validation
- Detailed error messages
- Graceful fallbacks for model failures
- HTTP status codes for different error types