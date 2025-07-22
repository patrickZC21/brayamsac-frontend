// Hook para manejar logout automático al cerrar pestaña/navegador
import { useEffect } from 'react';
import { verificarSesionActiva } from '../utils/sessionUtils';

export const useAutoLogout = () => {
  useEffect(() => {
    const performLogout = async (token) => {
      if (!token) return;
      
      try {
        // Intentar con fetch primero (más confiable)
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          keepalive: true // Mantener request activa aunque se cierre la página
        });
      } catch (_error) {
        // Si fetch falla, intentar con sendBeacon como fallback
        try {
          const logoutData = JSON.stringify({ 
            token: token,
            source: 'beforeunload' 
          });
          navigator.sendBeacon(
            "/api/auth/logout-beacon",
            new Blob([logoutData], { type: 'application/json' })
          );
        } catch (beaconError) {
          console.error("Error en logout automático:", beaconError);
        }
      }
    };

    const handleBeforeUnload = (_event) => {
      // Verificar si hay una sesión activa antes de intentar cerrar sesión
      if (verificarSesionActiva()) {
        const token = localStorage.getItem("token");
        performLogout(token);
      }
    };

    const handleUnload = () => {
      // Verificar si hay una sesión activa antes de intentar cerrar sesión
      if (verificarSesionActiva()) {
        const token = localStorage.getItem("token");
        performLogout(token);
      }
    };

    // También detectar cuando se cambia de pestaña por mucho tiempo
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // La página se ocultó, pero no cerró
        // Aquí podrías implementar un timeout para logout por inactividad
      } else {
        // La página volvió a ser visible
      }
    };

    // Registrar los event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup en unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
};

export default useAutoLogout;
