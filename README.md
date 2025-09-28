# Fishiko - AI Fishing Zone Recommender

Fishiko is a serverless, machine learning web application that recommends optimal fishing zones in Halifax, Nova Scotia using environmental inputs-temperature, salinity, season and optional GPS coordinates, protected with Cognito authentication and presented through a responsive React frontend with map-driven input.
The platform orchestrates API Gateway, Lambda, DynamoDB, and S3 with a SageMaker-hosted Random Forest model to deliver real-time, zone-level predictions, species suggestions filtered by seasonal ranges, and a map-ready payload, while logging every request for analytics and operational visibility via CloudWatch.

---

## Key Features
- Interactive React UI with maps and guided prediction form.
- Real-time inference pipeline: API Gateway → Lambda → SageMaker.
- Zone-specific fish recommendations and gear tips.
- Halifax-only bounds validation (lat 44.5–44.8, lon −63.7 to −63.4).
- DynamoDB logging for predictions (analytics-ready).

---

## Tech Stack
**Frontend**: React, TailwindCSS, custom map components (`PinDropMap`, `MapDisplay`)  
**Backend**: AWS API Gateway, Lambda (Python), DynamoDB  
**ML**: Scikit-learn model deployed on SageMaker with a custom inference handler  

---

## Repository Layout

```
amplify/ # AWS Amplify project files
build/ # Production-ready frontend build
public/ # Static assets
src/ # React frontend (pages + components)
├── pages/
│ ├── Home.js
│ ├── Predict.js
│ ├── Weather.js
└── components/
├── PredictionForm.js
├── MapDisplay.js
├── PinDropMap.js
├── WeatherForecast.js
├── Navbar.js
└── GearGuide.js
```

```
endpoint_deployment/ # Dataset augmentation, deployment scripts, Lambda tests
sagemaker_Content/ # Training artifacts, pickled models, inference entry points
haliax_csv_data/ # Source + augmented Halifax datasets
infrastructure/ # CloudFormation templates (base, infra, app)
```

---

## How It Works
1. **User Input**  
   - Temperature, salinity, season, and optional lat/lon (Halifax bounds checked).  
2. **Backend Flow**  
   - `POST /predict` → API Gateway → Lambda.  
   - Lambda validates input, calls SageMaker endpoint, logs results to DynamoDB.  
3. **Model Inference**  
   - SageMaker model predicts Zone A/B/C.  
   - Returns recommended fish species and zone metadata (lat, lon, radius).  
4. **Frontend Display**  
   - Interactive map overlays the recommended zone.  
   - Inline validation and gear tips enhance UX.

---

## Frontend Quick Start
### Prerequisites
- Node.js **18+**
- npm
- `.env` file in the frontend root:

```env
REACT_APP_API_URL=https://<api-id>.execute-api.<region>.amazonaws.com/prod/
REACT_APP_MAP_DEFAULT_LAT=44.67
REACT_APP_MAP_DEFAULT_LON=-63.58
```
---
## Commands

```
npm install        # Install dependencies
npm start          # Run dev server (http://localhost:3000)
npm run build      # Production build in /build
```
---
## Backend & ML Deployment

Provisioned via **CloudFormation** templates in `infrastructure/`:

- `fishiko-base.yaml` → S3 bucket + DynamoDB table
- `fishiko-infrastructure.yaml` → Full stack (S3, DynamoDB, SageMaker, Lambda, API Gateway)

### High-Level Steps
1. **Data Preparation**  
   - Run `augment_salinity.py` to generate `fishiko_halifax_dataset.csv`.

2. **Train & Package Model**  
   - Train Scikit-learn model → save `fishiko_model_updated.pkl`, `season_encoder.pkl`.  
   - Package with `inference.py` into `model.tar.gz`.

3. **Deploy Endpoint**  
   - Use `deploy_endpoint.py` or CloudFormation `fishiko-app.yaml`.

4. **Stand Up API**  
   - Deploy `fishiko-infrastructure.yaml`.  
   - Outputs include API URL for frontend `.env`.

---

## Request/Response Contract

**Request (JSON):**
```json
{
  "temperature_degree_c": 12.3,
  "salinity_psu": 32.1,
  "season": "Summer",
  "latitude": 44.67,
  "longitude": -63.58
}
```
**Response (JSON):**

```json
{
  "predicted_zone": "Zone B",
  "fish_recommendations": ["Mackerel", "Cod"],
  "gps_zone": "Zone B",
  "lat": 44.65,
  "lon": -63.55,
  "radius_km": 3.2,
  "area_name": "Northwest Arm"
}
```
---
## Security & Storage
- DynamoDB logs every prediction with a UUID (partition key).
- S3 bucket enforces server-side encryption and public access blocking.
- API secured with Bearer token authentication.

---

## Development Tips
- Keep filenames in sync: `fishiko_model_updated.pkl`, `season_encoder.pkl`.
- Use CloudWatch for Lambda and SageMaker logs.
- Out-of-bounds lat/lon returns `400 Bad Request`.


