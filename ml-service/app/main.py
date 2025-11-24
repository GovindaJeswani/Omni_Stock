# D:\Adbms\omnistock\ml-service\app\main.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from .core.forecast import generate_forecast, save_forecasts_to_db

app = FastAPI(
    title="OmniStock AI Service", 
    description="ML Engine for Forecasting, Pricing, and Recommendations."
)

# Pydantic Schema for Request Body
class ForecastRequest(BaseModel):
    product_ids: List[str] # List of UUID strings
    forecast_days: int = 30

# Pydantic Schema for Response Body (Matches demand_forecast table)
class ForecastResult(BaseModel):
    product_id: str
    forecast_date: str
    predicted_demand: int
    confidence_interval_lower: int
    confidence_interval_upper: int

# --- API ENDPOINTS ---

@app.get("/api/v1/health")
def health_check():
    """Simple health check for the Node.js backend."""
    return {"status": "ok", "service": "OmniStock AI"}

@app.post("/api/v1/forecast/demand", response_model=List[ForecastResult])
async def predict_demand(request: ForecastRequest):
    """
    Triggers demand forecasting for a list of products and saves results to DB.
    """
    all_forecasts = []
    
    # Run prediction for each product
    for product_id in request.product_ids:
        forecast_data = generate_forecast(product_id, request.forecast_days)
        
        # Check if the result is an error message dictionary
        if 'message' in forecast_data[0]:
             print(f"Skipping {product_id}: {forecast_data[0]['message']}")
             continue
             
        all_forecasts.extend(forecast_data)

    if not all_forecasts:
        raise HTTPException(status_code=404, detail="No valid forecasts could be generated.")
        
    # Save the aggregated results to the PostgreSQL table
    save_result = save_forecasts_to_db(all_forecasts)
    
    if save_result['status'] == 'error':
        raise HTTPException(status_code=500, detail=f"Database save failed: {save_result['message']}")

    return all_forecasts

# Placeholder for other services (to be built next)
# @app.post("/api/v1/pricing/suggest")
# async def dynamic_pricing():
#     # ... logic from pricing.py
#     pass