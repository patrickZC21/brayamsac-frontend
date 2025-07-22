/**
 * Script de diagnóstico para problemas de sesión en Frontend
 * 
 * Este script puede ejecutarse en la consola del navegador para diagnosticar
 * problemas relacionados con la sesión de usuario en la aplicación Frontend.
 */

// Función para verificar el estado actual de la sesión
function diagnosticarSesion() {
  console.group('🔍 DIAGNÓSTICO DE SESIÓN - FRONTEND');
  
  // 1. Verificar localStorage
  console.group('1. Contenido de localStorage:');
  const localStorageItems = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    let value = localStorage.getItem(key);
    
    // Ocultar parte del token por seguridad
    if (key === 'token' && value && value.length > 20) {
      value = value.substring(0, 10) + '...' + value.substring(value.length - 5);
    }
    
    localStorageItems[key] = value;
  }
  console.table(localStorageItems);
  console.groupEnd();
  
  // 2. Verificar token JWT
  console.group('2. Análisis de token JWT:');
  const token = localStorage.getItem('token');
  if (token) {
    try {
      // Dividir el token en sus partes
      const [header, payload, signature] = token.split('.');
      
      // Decodificar header y payload
      const decodedHeader = JSON.parse(atob(header));
      const decodedPayload = JSON.parse(atob(payload));
      
      console.log('Header:', decodedHeader);
      console.log('Payload:', decodedPayload);
      
      // Verificar expiración
      if (decodedPayload.exp) {
        const expDate = new Date(decodedPayload.exp * 1000);
        const now = new Date();
        const isExpired = now > expDate;
        
        console.log('Fecha de expiración:', expDate.toLocaleString());
        console.log('Hora actual:', now.toLocaleString());
        console.log('Estado:', isExpired ? '❌ EXPIRADO' : '✅ VÁLIDO');
        
        if (!isExpired) {
          const timeRemaining = expDate - now;
          console.log('Tiempo restante:', Math.floor(timeRemaining / 60000), 'minutos');
        }
      } else {
        console.warn('⚠️ El token no tiene fecha de expiración');
      }
    } catch (error) {
      console.error('❌ Error al decodificar el token:', error);
      console.log('Token inválido o malformado');
    }
  } else {
    console.log('❌ No hay token almacenado');
  }
  console.groupEnd();
  
  // 3. Verificar información de usuario
  console.group('3. Información de usuario:');
  const nombre = localStorage.getItem('nombre');
  const rol = localStorage.getItem('rol');
  
  console.log('Nombre:', nombre || 'No disponible');
  console.log('Rol:', rol || 'No disponible');
  
  if (!nombre || !rol) {
    console.warn('⚠️ Información de usuario incompleta');
  }
  console.groupEnd();
  
  // 4. Verificar hooks de autenticación
  console.group('4. Verificación de hooks de autenticación:');
  console.log('useAutoLogout: Verifica cierre de sesión al cerrar pestaña/navegador');
  console.log('useTokenExpiration: Verifica expiración del token cada 30 segundos');
  console.log('useUsuario: Valida el token con el backend');
  console.groupEnd();
  
  // 5. Sugerencias de solución
  console.group('5. Sugerencias de solución:');
  if (!token) {
    console.log('- Inicie sesión nuevamente');
  } else if (!nombre || !rol) {
    console.log('- La información de usuario está incompleta');
    console.log('- Puede intentar cerrar sesión y volver a iniciar sesión');
  }
  console.log('- Para limpiar completamente la sesión: localStorage.clear()');
  console.log('- Para forzar la validación del token: ejecute manualmente la función validarToken()');
  console.groupEnd();
  
  console.groupEnd();
}

// Función para validar el token manualmente
async function validarToken() {
  console.group('🔄 Validación manual de token');
  
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('❌ No hay token para validar');
    console.groupEnd();
    return;
  }
  
  try {
    // Construir la URL de la API
    let apiUrl = '/api/auth/validar';
    if (window.location.hostname !== 'localhost') {
      // Ajustar para producción si es necesario
      const baseUrl = window.location.origin;
      apiUrl = `${baseUrl}${apiUrl}`;
    }
    
    console.log('Enviando solicitud a:', apiUrl);
    
    const response = await fetch(apiUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Token válido');
      console.log('Respuesta:', data);
    } else {
      console.log('❌ Token inválido');
      console.log('Error:', data);
    }
  } catch (error) {
    console.error('❌ Error al validar token:', error);
  }
  
  console.groupEnd();
}

// Ejecutar diagnóstico
diagnosticarSesion();

// Instrucciones para el usuario
console.log('\n📋 INSTRUCCIONES:\n');
console.log('1. Para validar manualmente su token, ejecute: validarToken()');
console.log('2. Para limpiar la sesión y solucionar problemas, ejecute: localStorage.clear()');
console.log('3. Luego cierre esta pestaña y vuelva a abrir la aplicación');
console.log('4. Intente iniciar sesión nuevamente');