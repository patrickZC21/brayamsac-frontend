export default function Header({ usuario }) {  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Sistema de control de asistencia de BRAYAM SAC
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Dashboard Analítico • {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">
            {usuario?.nombre || "Usuario"}
          </p>
          <p className="text-xs text-gray-500">
            {usuario?.nombre_rol || usuario?.rol || "Sin rol"}
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
          {usuario?.nombre?.[0]?.toUpperCase() || "U"}
        </div>
        <button className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </header>
  );
}
