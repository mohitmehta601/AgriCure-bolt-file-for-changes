import sys
import pickle
import numpy as np
import warnings
warnings.filterwarnings('ignore')

def load_models():
    """Load the trained models"""
    try:
        # Load the classifier model
        with open('classifier.pkl', 'rb') as f:
            model = pickle.load(f)
        
        # Load the fertilizer encoder
        with open('fertilizer.pkl', 'rb') as f:
            fertilizer_encoder = pickle.load(f)
        
        return model, fertilizer_encoder
    except FileNotFoundError as e:
        print(f"Error: Model file not found - {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Error loading models: {e}")
        sys.exit(1)

def predict_fertilizer(input_data):
    """Predict fertilizer based on input parameters"""
    try:
        # Load models
        model, fertilizer_encoder = load_models()
        
        # Convert input to numpy array
        input_array = np.array(input_data).reshape(1, -1)
        
        # Make prediction
        prediction = model.predict(input_array)
        
        # Get fertilizer name
        fertilizer_name = fertilizer_encoder.classes_[prediction[0]]
        
        return fertilizer_name
    
    except Exception as e:
        print(f"Error during prediction: {e}")
        return "Urea"  # Default fallback

def main():
    """Main function to handle command line arguments"""
    try:
        # Check if we have the right number of arguments
        if len(sys.argv) != 9:
            print("Error: Expected 8 parameters")
            sys.exit(1)
        
        # Parse command line arguments
        temperature = float(sys.argv[1])
        humidity = float(sys.argv[2])
        moisture = float(sys.argv[3])
        soil_type = int(sys.argv[4])
        crop_type = int(sys.argv[5])
        nitrogen = float(sys.argv[6])
        potassium = float(sys.argv[7])
        phosphorus = float(sys.argv[8])
        
        # Validate input ranges
        if not (0 <= temperature <= 50):
            raise ValueError("Temperature must be between 0 and 50°C")
        if not (0 <= humidity <= 100):
            raise ValueError("Humidity must be between 0 and 100%")
        if not (0 <= moisture <= 100):
            raise ValueError("Moisture must be between 0 and 100%")
        if not (0 <= soil_type <= 4):
            raise ValueError("Soil type must be between 0 and 4")
        if not (0 <= crop_type <= 16):
            raise ValueError("Crop type must be between 0 and 16")
        
        # Prepare input data
        input_data = [temperature, humidity, moisture, soil_type, crop_type, nitrogen, potassium, phosphorus]
        
        # Make prediction
        result = predict_fertilizer(input_data)
        
        # Output result
        print(result)
        
    except ValueError as e:
        print(f"Input validation error: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()