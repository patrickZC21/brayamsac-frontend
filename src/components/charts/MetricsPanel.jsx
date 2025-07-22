import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  Filler,
} from 'chart.js';
import { useEffect, useState } from "react";
import { Line, Bar } from 'react-chartjs-2';

import { buildApiUrl } from '../../config/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function MetricsPanel() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();
    const fetchHorasFaltantes = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(buildApiUrl('/api/dashboard/horas-faltantes'), {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Error al obtener trabajadores que deben horas");
        const result = await res.json();
        if (!ignore) setData(result);
      } catch (err) {
        if (!ignore) {
          setData([]);
          setError("No se pudo cargar la información.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchHorasFaltantes();
    return () => {
      ignore = true;
      controller.abort();
    };
  }, []);

  // Preparar datos para gráficos
  const lineChartData = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Eficiencia',
        data: [65, 72, 68, 85, 78, 82, 90],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const barChartData = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Horas',
        data: [8, 7.5, 8.2, 9, 8.8, 6, 4],
        backgroundColor: [
          '#F59E0B', '#F59E0B', '#F59E0B', '#F59E0B', '#F59E0B', '#F59E0B', '#F59E0B'
        ],
        borderRadius: 4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
  };

  // Calcular métricas
  const totalHorasAsignadas = data.reduce((sum, t) => sum + (parseFloat(t.horas_asignadas) || 0), 0);
  const totalHorasTrabajadas = data.reduce((sum, t) => sum + (parseFloat(t.horas_trabajadas) || 0), 0);
  const eficienciaPromedio = totalHorasAsignadas > 0 ? (totalHorasTrabajadas / totalHorasAsignadas) * 100 : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Efectividad del Trabajo */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Efectividad del Trabajo</h3>
            <p className="text-sm text-gray-500">Rendimiento semanal</p>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-blue-50 rounded-xl">
            <div className="text-xs text-blue-600 font-medium mb-1">Completo</div>
            <div className="text-2xl font-bold text-blue-600">64%</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-xl">
            <div className="text-xs text-green-600 font-medium mb-1">Directo</div>
            <div className="text-2xl font-bold text-green-600">45%</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <div className="text-xs text-gray-600 font-medium mb-1">Orgánico</div>
            <div className="text-2xl font-bold text-gray-600">26%</div>
          </div>
        </div>

        <div className="h-16">
          <Line data={lineChartData} options={chartOptions} />
        </div>
      </div>

      {/* Duración de Sesión */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Duración Promedio</h3>
            <p className="text-sm text-gray-500">Tiempo por trabajador</p>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-4xl font-bold text-gray-900 mb-1">
            {loading ? "..." : `${(totalHorasTrabajadas / Math.max(data.length, 1)).toFixed(1)}h`}
          </div>
          <div className="text-sm text-green-600 font-medium flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            +8.2%
          </div>
        </div>

        <div className="h-16">
          <Line 
            data={{
              ...lineChartData,
              datasets: [{
                ...lineChartData.datasets[0],
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
              }]
            }} 
            options={chartOptions} 
          />
        </div>
      </div>

      {/* Tasa de Productividad */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Tasa de Productividad</h3>
            <p className="text-sm text-gray-500">Eficiencia semanal</p>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-4xl font-bold text-gray-900 mb-1">
            {loading ? "..." : `${eficienciaPromedio.toFixed(1)}%`}
          </div>
          <div className="text-sm text-red-600 font-medium flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            -1.9%
          </div>
        </div>

        <div className="h-16">
          <Bar data={barChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
