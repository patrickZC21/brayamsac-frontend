// src/hooks/useNombresAlmacenSubalmacen.js
import { useEffect, useState } from "react";

import { buildApiUrl } from '../config/api';

export function useNombresAlmacenSubalmacen(subalmacenId) {
  const [usuario, setUsuario] = useState(null);
  const [almacenNombre, setAlmacenNombre] = useState("");
  const [subalmacenNombre, setSubalmacenNombre] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(buildApiUrl('/api/auth/validar'), {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUsuario(data.usuario))
      .catch(() => setUsuario(null));
  }, []);

  useEffect(() => {
    if (!subalmacenId) return;
    const token = localStorage.getItem("token");
    const fetchNombres = async () => {
      try {
        const resSub = await fetch(
          buildApiUrl(`/api/subalmacenes/${subalmacenId}`),
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!resSub.ok) return;
        const sub = await resSub.json();
        setSubalmacenNombre(sub.nombre || "");
        if (sub.almacen_id) {
          const resAlm = await fetch(
            buildApiUrl(`/api/almacenes/${sub.almacen_id}`),
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (resAlm.ok) {
            const alm = await resAlm.json();
            setAlmacenNombre(alm.nombre || "");
          }
        }
      } catch {
        setAlmacenNombre("");
        setSubalmacenNombre("");
      }
    };
    fetchNombres();
  }, [subalmacenId]);

  return { usuario, almacenNombre, subalmacenNombre };
}
