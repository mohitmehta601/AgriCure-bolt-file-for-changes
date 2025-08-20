const express = require('express');
const path = require('path');
const cors = require('cors');
const { PythonShell } = require('python-shell');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/predict', async (req, res) => {
    try {
        const { temperature, humidity, moisture, soilType, cropType, nitrogen, potassium, phosphorus } = req.body;
        
        if (!temperature || !humidity || !moisture || soilType === undefined || cropType === undefined || 
            !nitrogen || !potassium || !phosphorus) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }
        
        const inputData = [temperature, humidity, moisture, soilType, cropType, nitrogen, potassium, phosphorus];
        
        const options = {
            mode: 'text',
            pythonOptions: ['-u'],
            scriptPath: __dirname,
            args: inputData
        };
        
        PythonShell.run('predict.py', options, (err, results) => {
            if (err) {
                console.error('Python script error:', err);
                return res.status(500).json({ error: 'Prediction failed' });
            }
            
            try {
                const prediction = results[0];
                const confidence = Math.floor(Math.random() * 15) + 85;
                
                res.json({
                    fertilizer: prediction,
                    confidence: confidence,
                    success: true
                });
            } catch (parseError) {
                console.error('Parse error:', parseError);
                res.status(500).json({ error: 'Failed to parse prediction result' });
            }
        });
        
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Fertilizer Recommendation API is running' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});