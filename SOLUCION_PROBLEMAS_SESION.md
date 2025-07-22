# Solución a Problemas de Sesión - Frontend

## Problemas Identificados

1. **Cierre de sesión y reingreso**: Problemas al cerrar sesión y volver a iniciar sesión, posiblemente debido a que no se limpia correctamente el localStorage.

2. **Cierre automático de sesión al navegar**: La sesión no se cierra correctamente al cerrar la pestaña o el navegador.

3. **Validación de tokens**: Posibles problemas con la validación de tokens y su expiración.

## Soluciones Implementadas

### 1. Utilidades de Sesión

Se ha creado un archivo de utilidades para centralizar la gestión de sesiones:

- **Archivo**: `src/utils/sessionUtils.js`
- **Funcionalidades**:
  - `verificarSesionActiva()`: Verifica si hay una sesión activa (token, nombre y rol).
  - `calcularTiempoRestanteToken()`: Calcula el tiempo restante de un token JWT.
  - `limpiarSesion()`: Limpia todos los datos de sesión del localStorage.
  - `logEstadoSesion()`: Registra el estado actual de la sesión en la consola.
  - `validarTokenConBackend()`: Realiza una validación del token con el backend.

### 2. Script de Diagnóstico

Se ha creado un script para diagnosticar problemas de sesión:

- **Archivo**: `diagnostico-sesion.js`
- **Funcionalidades**:
  - Verificación del contenido del localStorage.
  - Análisis del token JWT (incluyendo expiración).
  - Verificación de la información de usuario.
  - Sugerencias de solución.
  - Función para validar el token manualmente.

### 3. Mejoras en Hooks Existentes

Los hooks existentes ya proporcionan buenas funcionalidades para el manejo de sesiones:

- **useAutoLogout.js**: Maneja el cierre de sesión automático al cerrar la pestaña o el navegador.
- **useTokenExpiration.js**: Verifica la expiración del token cada 30 segundos.
- **useUsuario.js**: Valida el token con el backend.

## Cómo Utilizar las Herramientas

### Diagnóstico de Problemas de Sesión

1. Abra la consola del navegador (F12 o Ctrl+Shift+I).
2. Copie y pegue el contenido del archivo `diagnostico-sesion.js`.
3. Ejecute el script y revise la información mostrada.
4. Para validar manualmente el token, ejecute la función `validarToken()`.

### Utilización de las Utilidades de Sesión

#### En componentes de Dashboard

```javascript
import { logEstadoSesion, verificarSesionActiva } from "../utils/sessionUtils.js";

export default function Dashboard() {
  // ...
  
  useEffect(() => {
    // Registrar el estado de la sesión al cargar el componente
    logEstadoSesion();
    
    const validarToken = async () => {
      // Verificar si hay una sesión activa
      if (!verificarSesionActiva()) {
        console.warn("Sesión no activa. Redirigiendo al login.");
        navigate("/");
        return;
      }
      
      // Resto de la validación...
    };
    
    validarToken();
  }, [navigate]);
  
  // Resto del componente...
}
```

#### En componentes de Login

```javascript
import { limpiarSesion } from "../utils/sessionUtils.js";

export default function LoginSistema() {
  // ...
  
  // Limpiar cualquier sesión anterior al montar el componente
  useEffect(() => {
    limpiarSesion();
  }, []);
  
  const handleSubmit = async (e) => {
    // ...
    
    if (loginExitoso) {
      // Limpiar cualquier sesión anterior antes de establecer la nueva
      limpiarSesion();
      
      // Establecer nueva sesión
      tokenManager.set(data.token);
      localStorage.setItem("nombre", nombre);
      localStorage.setItem("rol", rol);
    }
  };
  
  // Resto del componente...
}
```

#### En hooks de autenticación

```javascript
import { limpiarSesion, verificarSesionActiva } from '../utils/sessionUtils';

export const useAutoLogout = () => {
  useEffect(() => {
    // ...
    
    const handleBeforeUnload = (_event) => {
      // Verificar si hay una sesión activa antes de intentar cerrar sesión
      if (verificarSesionActiva()) {
        const token = localStorage.getItem("token");
        performLogout(token);
      }
    };
    
    // ...
  }, []);
};

export const useTokenExpiration = () => {
  // ...
  
  const handleLogout = async () => {
    try {
      // Intentar cerrar sesión en el backend
    } catch (error) {
      // Manejar error
    } finally {
      // Usar la función centralizada para limpiar la sesión
      limpiarSesion();
      navigate("/loginSistema");
    }
  };
  
  // ...
};
```

## Recomendaciones Adicionales

1. **Limpieza de localStorage**: Asegúrese de limpiar correctamente el localStorage al cerrar sesión utilizando `limpiarSesion()`.

2. **Validación de tokens**: Utilice `validarTokenConBackend()` para validar el token con el backend cuando sea necesario.

3. **Monitoreo de sesión**: Utilice `logEstadoSesion()` para monitorear el estado de la sesión durante el desarrollo.

4. **Manejo de errores**: Implemente un manejo adecuado de errores en las llamadas a la API de autenticación.

## Archivos Creados/Modificados

- ✅ `Frontend/diagnostico-sesion.js` (nuevo)
- ✅ `Frontend/src/utils/sessionUtils.js` (nuevo)
- ✅ `Frontend/SOLUCION_PROBLEMAS_SESION.md` (nuevo)
- ✅ `Frontend/src/pages/Dashboard.jsx` (modificado)
- ✅ `Frontend/src/pages/LoginSistema.jsx` (modificado)
- ✅ `Frontend/src/hooks/useTokenExpiration.js` (modificado)
- ✅ `Frontend/src/hooks/useAutoLogout.js` (modificado)

## Próximos Pasos

1. Integrar las utilidades de sesión en los componentes principales.
2. Realizar pruebas exhaustivas de inicio y cierre de sesión.
3. Monitorear el comportamiento de la sesión en diferentes escenarios (cierre de pestaña, expiración de token, etc.).