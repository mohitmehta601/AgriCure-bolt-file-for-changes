FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Copy the dataset from the ML-model-main folder
COPY ../Ml-model-main/f2.csv ./Ml-model-main/f2.csv

# Create models directory
RUN mkdir -p models

# Expose port
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]