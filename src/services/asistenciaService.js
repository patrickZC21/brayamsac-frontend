import { API_BASE_URL } from '../config/api.js';

// Cache simple para evitar peticiones duplicadas
const updateCache = new Map();
const UPDATE_DEBOUNCE_TIME = 500; // 500ms

/**
 * Servicio para gestión de asistencias
 */
export const asistenciaService = {
  /**
   * Actualiza una asistencia específica con debounce
   * @param {string|number} id - ID de la asistencia
   * @param {Object} datos - Datos a actualizar
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async actualizarAsistencia(id, datos) {
    const cacheKey = `update_${id}`;
    
    // Cancelar actualización anterior si existe
    if (updateCache.has(cacheKey)) {
      clearTimeout(updateCache.get(cacheKey).timeout);
    }
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(async () => {
        try {
          const token = localStorage.getItem('token');
          
          const response = await fetch(`${API_BASE_URL}/api/asistencias/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(datos)
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error al actualizar asistencia');
          }

          const result = await response.json();
          updateCache.delete(cacheKey);
          resolve(result);
        } catch (error) {
          updateCache.delete(cacheKey);
          reject(error);
        }
      }, UPDATE_DEBOUNCE_TIME);
      
      updateCache.set(cacheKey, { timeout, resolve, reject });
    });
  },

  /**
   * Obtiene una asistencia por ID
   * @param {string|number} id - ID de la asistencia
   * @returns {Promise<Object>} Datos de la asistencia
   */
  async obtenerAsistencia(id) {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}/api/asistencias/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al obtener asistencia');
    }

    return await response.json();
  }
};

export default asistenciaService;
