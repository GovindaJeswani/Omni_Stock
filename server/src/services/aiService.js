// D:\Adbms\omnistock\server\src\services\aiService.js

const axios = require('axios');
require('dotenv').config();

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000/api/v1';

/**
 * Orchestrates the call to the Python Demand Forecasting endpoint.
 * @param {Array<string>} productIds - List of product UUIDs to forecast.
 * @param {number} days - Number of days to forecast.
 * @returns {Promise<object>} The forecast data, including the predicted demand.
 */
async function getDemandForecast(productIds, days = 30) {
    console.log(`[AI Service] Requesting demand forecast for ${productIds.length} products.`);
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/forecast/demand`, {
            product_ids: productIds,
            forecast_days: days
        });

        // The Python service handles saving the data to PostgreSQL, 
        // Node.js is just confirming the success and fetching data for the frontend.
        return response.data; 

    } catch (error) {
        console.error("Error connecting to Python AI Service:", error.response ? error.response.data : error.message);
        throw new Error(`AI Service connection failed or returned error: ${error.message}`);
    }
}

// Placeholder for future AI services
async function getDynamicPricingSuggestions(productId) {
    // Implement API call to /pricing/suggest (Future step)
    return { suggestions: [] };
}

module.exports = {
    getDemandForecast,
    getDynamicPricingSuggestions
};