import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { buildApiUrl } from '../config/api';
import useAutoLogout from "../hooks/useAutoLogout.js";

import DashboardCards from "@/components/charts/DashboardCards.jsx";
import HorasExtrasChart from "@/components/charts/HorasExtrasChart.jsx";
import MetricsPanel from "@/components/charts/MetricsPanel.jsx";
import TrabajadoresSemanaStats from "@/components/charts/TrabajadoresSemanaStats.jsx";
import MainLayout from "@/components/layout/MainLayout.jsx";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState(null);

  // Hook para logout automático al cerrar pestaña/navegador
  useAutoLogout();

  // Estados para las cards
  const [almacenes, setAlmacenes] = useState(0);
  const [subalmacenes, setSubalmacenes] = useState(0);
  const [coordinadores, setCoordinadores] = useState(0);
  const [trabajadores, setTrabajadores] = useState(0);

  // Estado de carga para los datos del dashboard
  const [loadingCards, setLoadingCards] = useState(true);

  useEffect(() => {
    const validarToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("Token no encontrado. Redirigiendo al login.");
        navigate("/");
        return;
      }

      try {
        const res = await fetch(buildApiUrl('/api/auth/validar'), {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Token inválido");

        const data = await res.json();
        setUsuario(data.usuario);
      } catch (error) {
        console.error("Error al validar token:", error);
        localStorage.removeItem("token");
        navigate("/");
        return;
      } finally {
        setLoading(false);
      }
    };

    validarToken();
  }, [navigate]);

  useEffect(() => {
    if (!loading && usuario) {
      const fetchDashboardResumen = async () => {
        setLoadingCards(true);
        setError(null);
        const token = localStorage.getItem("token");
        try {
          const res = await fetch(buildApiUrl('/api/dashboard/resumen'), {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!res.ok) throw new Error("Error al obtener resumen del dashboard");
          
          const data = await res.json();
          setAlmacenes(data.total_almacenes);
          setSubalmacenes(data.total_subalmacenes);
          setCoordinadores(data.total_coordinadores);
          setTrabajadores(data.total_trabajadores);
        } catch (error) {
          console.error("Error al cargar resumen:", error);
          setError("Error al cargar los datos del dashboard");
        } finally {
          setLoadingCards(false);
        }
      };
      fetchDashboardResumen();
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Validando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <MainLayout usuario={usuario}>
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-6 space-y-6">
          {/* Cards principales */}
          {loadingCards ? (
            <div className="w-full flex items-center justify-center py-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <span className="text-gray-500 text-sm">
                  {error ? error : "Cargando resumen..."}
                </span>
              </div>
            </div>
          ) : (
            <DashboardCards
              almacenes={almacenes}
              subalmacenes={subalmacenes}
              coordinadores={coordinadores}
              trabajadores={trabajadores}
            />
          )}

          {/* Panel de métricas */}
          <MetricsPanel />

          {/* Sección de gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrabajadoresSemanaStats />
            <HorasExtrasChart />
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
