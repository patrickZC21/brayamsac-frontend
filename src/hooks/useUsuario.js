import { useEffect, useState } from "react";

import { buildApiUrl } from '../config/api';


export function useUsuario(subalmacenId, fecha) {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUsuario(null);
      console.log("[Asistencias] No hay token, usuario no autenticado");
      return;
    }
    fetch(buildApiUrl('/api/auth/validar'), {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsuario(data.usuario);
        console.log("[Asistencias] Usuario validado:", data.usuario);
      })
      .catch(() => {
        setUsuario(null);
        console.log("[Asistencias] Error validando usuario");
      });
  }, [subalmacenId, fecha]);

  return usuario;
}