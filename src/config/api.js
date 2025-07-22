/**
 * Configuración de la API
 */

// Configuración centralizada de la API

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://54.233.86.195:3000';

export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  ASISTENCIAS: '/api/asistencias',
  ALMACENES: '/api/almacenes',
  SUBALMACENES: '/api/subalmacenes',
  TRABAJADORES: '/api/trabajadores',
  USUARIOS: '/api/usuarios',
  ROTACIONES: '/api/rotaciones',
  DASHBOARD: '/api/dashboard',
  USUARIO_ALMACENES: '/api/usuario-almacenes',
  TRABAJADOR_ASISTENCIA: '/api/trabajadorAsistencia',
  NOTIFICATIONS: '/api/notifications/events',
};

export function buildApiUrl(endpoint) {
  // Si el endpoint ya contiene la URL base, no la duplica
  if (endpoint.startsWith('http')) return endpoint;
  
  // En desarrollo, usar rutas relativas para el proxy de Vite
  // En producción, usar la URL completa
  if (import.meta.env.DEV) {
    return endpoint;
  } else {
    return `${API_BASE_URL}${endpoint}`;
  }
}
