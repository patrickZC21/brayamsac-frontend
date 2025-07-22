// Configuración centralizada para el API
// Eliminar este archivo si ya no es necesario, o importar desde api.js si se requiere

import { API_BASE_URL } from './api.js';

// Helper para construir URLs con soporte para query parameters
export const buildApiUrl = (endpoint, params = null) => {
  let url = endpoint;
  
  // En desarrollo, usar rutas relativas para el proxy de Vite
  // En producción, usar la URL completa
  if (!import.meta.env.DEV) {
    url = `${API_BASE_URL}${endpoint}`;
  }
  
  if (params && typeof params === 'object') {
    const queryString = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryString.append(key, value);
      }
    });
    
    const queryStr = queryString.toString();
    if (queryStr) {
      url += `?${queryStr}`;
    }
  }
  
  return url;
};

// Token manager seguro
export const tokenManager = {
  set: (token) => {
    if (token && typeof token === 'string' && token.trim()) {
      try {
        localStorage.setItem('token', token);
        return true;
      } catch (error) {
        console.error('Error al guardar token:', error);
        return false;
      }
    }
    return false;
  },
  
  get: () => {
    try {
      const token = localStorage.getItem('token');
      return token && token.trim() ? token : null;
    } catch (error) {
      console.error('Error al obtener token:', error);
      return null;
    }
  },
  
  remove: () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('nombre');
      localStorage.removeItem('rol');
      return true;
    } catch (error) {
      console.error('Error al limpiar tokens:', error);
      return false;
    }
  },
  
  getHeaders: () => {
    const token = tokenManager.get();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
};

// Logger seguro con métricas de rendimiento
export const logger = {
  log: (...args) => {
    if (import.meta.env.DEV) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}]`, ...args);
    }
  },
  
  error: (...args) => {
    if (import.meta.env.DEV) {
      const timestamp = new Date().toISOString();
      console.error(`[${timestamp}] ERROR:`, ...args);
    }
  },
  
  warn: (...args) => {
    if (import.meta.env.DEV) {
      const timestamp = new Date().toISOString();
      console.warn(`[${timestamp}] WARN:`, ...args);
    }
  },
  
  performance: (operation, duration, metadata = {}) => {
    if (import.meta.env.DEV) {
      const timestamp = new Date().toISOString();
      const level = duration > 2000 ? 'WARN' : 'INFO';
      console[level === 'WARN' ? 'warn' : 'log'](
        `[${timestamp}] PERF-${level}: ${operation} - ${duration}ms`,
        metadata
      );
    }
  }
};
