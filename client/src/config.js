const isProduction = window.location.hostname.includes('pages.dev') || window.location.hostname.includes('moto-x-cult');
export const API_URL = isProduction 
  ? 'https://motoxcult-api.onrender.com' 
  : 'http://localhost:5001';
