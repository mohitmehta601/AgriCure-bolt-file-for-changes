import requests
import logging
from typing import Dict, Optional, Tuple
from datetime import datetime
import json

logger = logging.getLogger(__name__)

class SoilDataAPI:
    """Service to fetch soil data from external APIs based on coordinates"""
    
    def __init__(self):
        self.logger = logger
        # Cache to store soil data to avoid repeated API calls
        self.cache = {}
    
    def get_soil_data_by_location(self, latitude: float, longitude: float) -> Dict:
        """
        Get comprehensive soil data from multiple sources based on coordinates
        Returns soil type and properties
        """
        cache_key = f"{latitude:.4f},{longitude:.4f}"
        
        # Check cache first
        if cache_key in self.cache:
            self.logger.info(f"Returning cached soil data for {cache_key}")
            return self.cache[cache_key]
        
        soil_data = {
            'location': {
                'latitude': latitude,
                'longitude': longitude,
                'timestamp': datetime.now().isoformat()
            },
            'soil_properties': {},
            'soil_type': 'Loamy',  # Default fallback
            'confidence': 0.0,
            'sources': [],
            'success': False
        }
        
        try:
            # Primary: Try SoilGrids API (most reliable for global coverage)
            soilgrids_data = self._get_soilgrids_data(latitude, longitude)
            if soilgrids_data:
                soil_data['soil_properties'].update(soilgrids_data)
                soil_data['sources'].append('SoilGrids')
                soil_data['success'] = True
                soil_data['confidence'] = 0.8
            
            # Classify soil type based on texture
            if soil_data['soil_properties']:
                soil_data['soil_type'] = self._classify_soil_type(soil_data['soil_properties'])
                
            # Cache the result
            self.cache[cache_key] = soil_data
            
        except Exception as e:
            self.logger.error(f"Error fetching soil data for {latitude}, {longitude}: {e}")
            # Return default data on error
            soil_data['soil_type'] = 'Loamy'
            soil_data['confidence'] = 0.1
            soil_data['sources'] = ['Default']
        
        return soil_data
    
    def _get_soilgrids_data(self, lat: float, lon: float) -> Optional[Dict]:
        """Fetch soil data from ISRIC SoilGrids API"""
        try:
            url = "https://rest.isric.org/soilgrids/v2.0/properties/query"
            
            # Request key soil properties
            params = {
                'lon': lon,
                'lat': lat,
                'property': ['clay', 'sand', 'silt', 'phh2o', 'cec', 'nitrogen', 'soc'],
                'depth': ['0-5cm', '5-15cm'],  # Top soil layers
                'value': 'mean'
            }
            
            self.logger.info(f"Fetching SoilGrids data for {lat}, {lon}")
            response = requests.get(url, params=params, timeout=15)
            response.raise_for_status()
            
            data = response.json()
            processed_data = {}
            
            # Process the response
            for prop in data.get('properties', []):
                prop_name = prop['name']
                if prop['depths'] and len(prop['depths']) > 0:
                    # Use surface layer (0-5cm) data
                    surface_layer = prop['depths'][0]
                    if 'values' in surface_layer and 'mean' in surface_layer['values']:
                        processed_data[prop_name] = surface_layer['values']['mean']
            
            self.logger.info(f"Successfully fetched SoilGrids data: {processed_data}")
            return processed_data
            
        except requests.exceptions.RequestException as e:
            self.logger.error(f"SoilGrids API request failed: {e}")
            return None
        except Exception as e:
            self.logger.error(f"Error processing SoilGrids data: {e}")
            return None
    
    def _classify_soil_type(self, properties: Dict) -> str:
        """
        Classify soil type based on USDA Soil Texture Triangle
        Uses clay, sand, silt percentages to determine soil type
        """
        try:
            # SoilGrids returns values in g/kg, convert to percentages
            clay = properties.get('clay', 200) / 10  # Convert to percentage
            sand = properties.get('sand', 400) / 10
            silt = properties.get('silt', 400) / 10
            
            # Normalize if total doesn't equal 100%
            total = clay + sand + silt
            if total > 0:
                clay = (clay / total) * 100
                sand = (sand / total) * 100
                silt = (silt / total) * 100
            
            self.logger.info(f"Soil texture: Clay={clay:.1f}%, Sand={sand:.1f}%, Silt={silt:.1f}%")
            
            # USDA Soil Texture Classification
            if clay >= 40:
                if sand >= 45:
                    return "Sandy Clay"
                elif silt >= 40:
                    return "Silty Clay"
                else:
                    return "Clay"
            elif clay >= 27:
                if sand >= 20 and sand < 45:
                    return "Clay Loam"
                elif sand >= 45:
                    return "Sandy Clay Loam"
                else:
                    return "Silty Clay Loam"
            elif clay >= 20:
                if sand >= 45:
                    return "Sandy Clay Loam"
                elif silt >= 28:
                    return "Silty Clay Loam"
                else:
                    return "Clay Loam"
            elif sand >= 85:
                return "Sand"
            elif sand >= 70:
                if clay >= 15:
                    return "Sandy Clay Loam"
                else:
                    return "Loamy Sand"
            elif sand >= 43:
                if clay >= 7 and clay < 20:
                    return "Sandy Loam"
                elif clay < 7:
                    return "Loamy Sand"
                else:
                    return "Sandy Loam"
            elif silt >= 80:
                return "Silt"
            elif silt >= 50:
                if clay >= 12 and clay < 27:
                    return "Silty Clay Loam"
                elif clay < 12:
                    return "Silt Loam"
                else:
                    return "Silty Clay Loam"
            elif silt >= 28:
                if clay >= 7 and clay < 27:
                    return "Loam"
                else:
                    return "Silt Loam"
            else:
                return "Loam"  # Default case
                
        except Exception as e:
            self.logger.error(f"Error classifying soil type: {e}")
            return "Loamy"  # Safe fallback
    
    def get_location_info(self, latitude: float, longitude: float) -> Dict:
        """Get location information using reverse geocoding"""
        try:
            # Using a simple reverse geocoding service
            url = f"https://api.bigdatacloud.net/data/reverse-geocode-client"
            params = {
                'latitude': latitude,
                'longitude': longitude,
                'localityLanguage': 'en'
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            location_info = {
                'city': data.get('city', ''),
                'locality': data.get('locality', ''),
                'region': data.get('principalSubdivision', ''),
                'country': data.get('countryName', ''),
                'formatted_address': data.get('localityInfo', {}).get('informative', [])
            }
            
            return location_info
            
        except Exception as e:
            self.logger.error(f"Error getting location info: {e}")
            return {
                'city': '',
                'locality': '',
                'region': '',
                'country': '',
                'formatted_address': []
            }

# Create global instance
soil_data_api = SoilDataAPI()
