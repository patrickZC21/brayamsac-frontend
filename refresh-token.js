// Función temporal para limpiar tokens y forzar re-login
// Ejecutar en la consola del navegador si el rol no aparece

// console.log("🔄 Limpiando tokens antiguos...");
localStorage.removeItem("token");
// console.log("✅ Token eliminado. Por favor haz login de nuevo.");
window.location.href = "/login";
