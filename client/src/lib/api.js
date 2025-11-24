/* eslint-disable no-unused-vars */
// D:\Adbms\omnistock\client\src\lib\api.js
import axios from 'axios';

// Set up the base URL for the Node.js backend
const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Function to fetch products from the Node.js backend.
 */
export const getProducts = async (limit = 12, offset = 0) => {
  try {
    // UNCOMMENT THESE LINES
    const response = await api.get(`/products?limit=${limit}&offset=${offset}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; // Return empty array on failure
  }
};

/**
 * Triggers the critical ACID transaction for the concurrency demo.

 */
export const triggerDemandForecast = async () => {
  try {
    const response = await api.post('/admin/ai/trigger-forecast');
    return response.data;
  } catch (error) {
    // Throws error if Node.js server fails or if Python service fails
    throw error.response.data;
  }
};

export const getForecastAnalytics = async () => {
    try {
        const response = await api.get('/admin/analytics/demand-forecast');
        return response.data;
    } catch (error) {
        console.error("Error fetching forecast analytics:", error);
        return [];
    }
};

export const buyProduct = async (productId, quantity, customerEmail) => {
  try {
    const response = await api.post('/orders/buy', {
      productId,
      quantity,
      customerEmail,
    });
    return response.data;
  } catch (error) {
    // The error response contains the rollback status
    throw error.response.data;
  }
};

export const getRecommendations = async (productId) => {
  try {
    // SIMULATED AI BEHAVIOR:
    // Instead of static text, we fetch 2 random products from your actual database.
    // This makes the UI look like it's suggesting real cross-sell items.
    const randomOffset = Math.floor(Math.random() * 40); 
    const response = await api.get(`/products?limit=2&offset=${randomOffset}`);
    
    // Return these real products as recommendations
    return response.data;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
};

// Add to existing exports:
export const getAdminStats = async () => {
  try {
    const response = await api.get('/admin/stats/overview');
    return response.data;
  } catch (error) {
    console.error("Stats Error:", error);
    return { totalRevenue: 0, totalOrders: 0, lowStockCount: 0, activeSkus: 0 };
  }
};