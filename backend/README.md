# AgriCure Backend

## Run (from repo root)

uvicorn backend.main:app --reload

## Run (from backend/)

uvicorn main:app --reload

## Docker

docker build -t agricure-backend ./backend
docker run -p 8000:8000 agricure-backend

## Models & Data

- backend/models/classifier.pkl
- backend/models/fertilizer.pkl
- backend/ml/f2.csv
