// DOM Elements
const form = document.getElementById('fertilizerForm');
const results = document.getElementById('results');
const loading = document.getElementById('loading');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');

// Fertilizer information database
const fertilizerInfo = {
    'Urea': {
        description: 'High nitrogen content fertilizer (46% N)',
        application: 'Apply 2-3 weeks before planting or as top dressing during vegetative growth',
        benefits: 'Promotes leaf growth and green color',
        precautions: 'Avoid over-application to prevent burning'
    },
    'DAP': {
        description: 'Diammonium Phosphate (18% N, 46% P2O5)',
        application: 'Apply at planting time or during soil preparation',
        benefits: 'Excellent for root development and early plant growth',
        precautions: 'Best applied in slightly acidic to neutral soils'
    },
    'TSP': {
        description: 'Triple Super Phosphate (46% P2O5)',
        application: 'Apply during soil preparation, 2-3 weeks before planting',
        benefits: 'Promotes strong root system and flowering',
        precautions: 'May reduce availability in alkaline soils'
    },
    'Superphosphate': {
        description: 'Single Super Phosphate (16% P2O5, 12% S)',
        application: 'Apply during soil preparation or at planting',
        benefits: 'Provides phosphorus and sulfur for plant growth',
        precautions: 'Less concentrated than other phosphate fertilizers'
    },
    'Potassium sulfate': {
        description: 'Sulfate of Potash (50% K2O, 18% S)',
        application: 'Apply during fruit development stage',
        benefits: 'Improves fruit quality and disease resistance',
        precautions: 'Suitable for chloride-sensitive crops'
    },
    'Potassium chloride': {
        description: 'Muriate of Potash (60% K2O)',
        application: 'Apply 2-4 weeks before planting',
        benefits: 'Enhances water regulation and disease resistance',
        precautions: 'Avoid for salt-sensitive crops'
    },
    '28-28': {
        description: 'Balanced NPK fertilizer (28% N, 28% P2O5)',
        application: 'Apply at planting and during active growth periods',
        benefits: 'Provides balanced nutrition for overall plant health',
        precautions: 'Monitor soil pH for optimal nutrient uptake'
    },
    '20-20': {
        description: 'Balanced fertilizer (20% N, 20% P2O5)',
        application: 'Apply during planting and early growth stages',
        benefits: 'Good starter fertilizer for young plants',
        precautions: 'May need supplementation during peak growth'
    },
    '17-17-17': {
        description: 'Complete NPK fertilizer (17% each of N, P2O5, K2O)',
        application: 'Apply throughout the growing season',
        benefits: 'Provides complete nutrition for all growth stages',
        precautions: 'Adjust application rate based on soil test results'
    },
    '15-15-15': {
        description: 'Balanced NPK fertilizer (15% each of N, P2O5, K2O)',
        application: 'Apply at regular intervals during growing season',
        benefits: 'Suitable for maintenance feeding of established plants',
        precautions: 'Monitor for nutrient deficiencies in heavy feeders'
    },
    '14-35-14': {
        description: 'High phosphorus fertilizer (14% N, 35% P2O5, 14% K2O)',
        application: 'Apply during flowering and fruit set stages',
        benefits: 'Promotes flowering, fruiting, and root development',
        precautions: 'Best used when soil phosphorus levels are low'
    },
    '14-14-14': {
        description: 'Balanced NPK fertilizer (14% each of N, P2O5, K2O)',
        application: 'Apply as general purpose fertilizer throughout season',
        benefits: 'Good all-around fertilizer for various crops',
        precautions: 'May need supplementation for specific nutrient needs'
    },
    '10-26-26': {
        description: 'High P-K fertilizer (10% N, 26% P2O5, 26% K2O)',
        application: 'Apply during reproductive growth stages',
        benefits: 'Excellent for fruit and seed development',
        precautions: 'Use when nitrogen requirements are lower'
    },
    '10-10-10': {
        description: 'Balanced NPK fertilizer (10% each of N, P2O5, K2O)',
        application: 'Apply as maintenance fertilizer for established crops',
        benefits: 'Gentle, balanced nutrition for sensitive plants',
        precautions: 'May need higher rates for heavy feeding crops'
    }
};

// Form submission handler
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Show loading state
    results.classList.add('hidden');
    loading.classList.remove('hidden');
    
    // Get form data
    const formData = new FormData(form);
    const data = {
        temperature: parseFloat(formData.get('temperature')),
        humidity: parseFloat(formData.get('humidity')),
        moisture: parseFloat(formData.get('moisture')),
        soilType: parseInt(formData.get('soilType')),
        cropType: parseInt(formData.get('cropType')),
        nitrogen: parseFloat(formData.get('nitrogen')),
        potassium: parseFloat(formData.get('potassium')),
        phosphorus: parseFloat(formData.get('phosphorus'))
    };
    
    try {
        // Simulate API call (replace with actual API endpoint)
        await simulateMLPrediction(data);
    } catch (error) {
        console.error('Error getting recommendation:', error);
        showError('Failed to get recommendation. Please try again.');
    }
});

// Simulate ML prediction (replace with actual API call)
async function simulateMLPrediction(data) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simple rule-based prediction for demonstration
    // In production, this would call your Python ML model
    let recommendedFertilizer = predictFertilizer(data);
    
    // Hide loading and show results
    loading.classList.add('hidden');
    displayResults(recommendedFertilizer);
}

// Simple prediction logic (replace with actual ML model call)
function predictFertilizer(data) {
    const { nitrogen, phosphorus, potassium, cropType, soilType } = data;
    
    // Simple rule-based logic for demonstration
    if (nitrogen < 20 && phosphorus < 20 && potassium < 20) {
        return '17-17-17';
    } else if (nitrogen > 80) {
        return 'DAP';
    } else if (phosphorus > 40) {
        return 'TSP';
    } else if (potassium > 40) {
        return 'Potassium sulfate';
    } else if (cropType >= 11) { // Fruits
        return '10-26-26';
    } else if (cropType <= 5) { // Grains
        return 'Urea';
    } else {
        return '15-15-15';
    }
}

// Display results
function displayResults(fertilizer) {
    const fertilizerNameEl = document.getElementById('recommendedFertilizer');
    const confidenceFillEl = document.getElementById('confidenceFill');
    const confidenceTextEl = document.getElementById('confidenceText');
    const guidelinesEl = document.getElementById('applicationGuidelines');
    
    // Set fertilizer name
    fertilizerNameEl.textContent = fertilizer;
    
    // Set confidence (random for demo, would come from ML model)
    const confidence = Math.floor(Math.random() * 15) + 85; // 85-99%
    confidenceFillEl.style.width = `${confidence}%`;
    confidenceTextEl.textContent = `${confidence}%`;
    
    // Set guidelines
    const info = fertilizerInfo[fertilizer] || {
        description: 'Recommended fertilizer based on your soil conditions',
        application: 'Follow standard application guidelines for your crop',
        benefits: 'Will help improve your crop yield',
        precautions: 'Always follow manufacturer instructions'
    };
    
    guidelinesEl.innerHTML = `
        <div class="guideline-item">
            <h5><i class="fas fa-info-circle"></i> Description</h5>
            <p>${info.description}</p>
        </div>
        <div class="guideline-item">
            <h5><i class="fas fa-calendar-alt"></i> Application Timing</h5>
            <p>${info.application}</p>
        </div>
        <div class="guideline-item">
            <h5><i class="fas fa-leaf"></i> Benefits</h5>
            <p>${info.benefits}</p>
        </div>
        <div class="guideline-item">
            <h5><i class="fas fa-exclamation-triangle"></i> Precautions</h5>
            <p>${info.precautions}</p>
        </div>
    `;
    
    // Show results
    results.classList.remove('hidden');
    
    // Scroll to results
    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Show error message
function showError(message) {
    loading.classList.add('hidden');
    
    // Create error display
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <div class="error-content">
            <i class="fas fa-exclamation-circle"></i>
            <h3>Error</h3>
            <p>${message}</p>
            <button onclick="this.parentElement.parentElement.remove()" class="btn btn-primary">
                Try Again
            </button>
        </div>
    `;
    
    // Insert after form
    form.parentNode.insertBefore(errorDiv, results);
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form validation
function validateForm() {
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// Add input event listeners for real-time validation
form.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('input', function() {
        if (this.classList.contains('error') && this.value.trim()) {
            this.classList.remove('error');
        }
    });
});

// Mobile menu toggle (if needed)
mobileMenuBtn?.addEventListener('click', function() {
    // Add mobile menu functionality if needed
    console.log('Mobile menu clicked');
});

// Add CSS for error states and guidelines
const additionalCSS = `
    .error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
    
    .error-message {
        background: #fef2f2;
        border: 1px solid #fecaca;
        border-radius: var(--border-radius);
        padding: 24px;
        margin: 24px 0;
        text-align: center;
    }
    
    .error-content i {
        font-size: 2rem;
        color: #ef4444;
        margin-bottom: 16px;
    }
    
    .error-content h3 {
        color: #dc2626;
        margin-bottom: 8px;
    }
    
    .error-content p {
        color: #991b1b;
        margin-bottom: 16px;
    }
    
    .guideline-item {
        margin-bottom: 24px;
        padding: 16px;
        background: white;
        border-radius: var(--border-radius);
        border-left: 4px solid var(--primary-color);
    }
    
    .guideline-item:last-child {
        margin-bottom: 0;
    }
    
    .guideline-item h5 {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 8px;
        color: var(--text-primary);
    }
    
    .guideline-item h5 i {
        color: var(--primary-color);
    }
    
    .guideline-item p {
        color: var(--text-secondary);
        margin: 0;
        line-height: 1.5;
    }
`;

// Inject additional CSS
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Add any initialization code here
    console.log('Fertilizer Recommendation System loaded');
    
    // Add smooth reveal animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature-card, .form-section, .about-feature').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});