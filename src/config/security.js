/**
 * Configuración de seguridad para el frontend
 * Funciones específicas para validación y protección
 */

// Validar que estamos en un entorno seguro
export const isSecureContext = () => {
  return window.location.protocol === 'https:' || 
         window.location.hostname === 'localhost' ||
         window.location.hostname === '127.0.0.1';
};

// Validar URLs de API para prevenir ataques
export const isValidApiUrl = (url) => {
  try {
    const urlObj = new URL(url);
    
    // En producción, solo permitir HTTPS
    if (import.meta.env.PROD && urlObj.protocol !== 'https:') {
      console.warn('⚠️ URL de API no segura en producción:', url);
      return false;
    }
    
    // Verificar que no sea una IP privada en producción
    if (import.meta.env.PROD && /^\d+\.\d+\.\d+\.\d+$/.test(urlObj.hostname)) {
      console.warn('⚠️ IP directa detectada en producción:', url);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('❌ URL de API inválida:', url, error);
    return false;
  }
};

// Token manager seguro con validaciones adicionales
export const tokenManager = {
  set: (token) => {
    if (token && typeof token === 'string' && token.trim()) {
      try {
        // Validar formato básico de JWT
        const parts = token.split('.');
        if (parts.length !== 3) {
          console.warn('⚠️ Token con formato inválido');
          return false;
        }
        
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

// Limpiar datos sensibles del almacenamiento
export const clearSensitiveData = () => {
  const sensitiveKeys = ['token', 'password', 'secret', 'auth'];
  
  sensitiveKeys.forEach(key => {
    try {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error(`Error al limpiar ${key}:`, error);
    }
  });
};

// Headers de seguridad para requests
export const getSecureHeaders = (includeAuth = false) => {
  const headers = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  };
  
  if (includeAuth) {
    const token = tokenManager.get();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Validar entorno de desarrollo vs producción
export const validateEnvironment = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  
  if (import.meta.env.PROD) {
    if (!apiUrl || !apiUrl.startsWith('https://')) {
      console.error('❌ CONFIGURACIÓN INSEGURA: API URL debe usar HTTPS en producción');
      return false;
    }
  }
  
  return isValidApiUrl(apiUrl);
};
