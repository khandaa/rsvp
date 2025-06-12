// src/api/index.js
// Utility for API communication between frontend and backend

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

export async function apiRequest(endpoint, method = 'GET', body = null, headers = {}) {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };
  if (body) {
    config.body = JSON.stringify(body);
  }
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}
