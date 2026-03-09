const isProduction = window.location.hostname === 'moto-x-cult.pages.dev' || window.location.hostname.endsWith('.pages.dev');
export const API_URL = isProduction 
  ? 'https://motoxcult-api.onrender.com' 
  : (import.meta.env.VITE_API_URL || 'http://localhost:5001');
