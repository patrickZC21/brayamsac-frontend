import React from "react";
import {
  LayoutDashboard,
  Users,
  UserCog,
  LogOut,
  Warehouse
} from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Toast from "../ui/Toast";

import logo from "../../assets/img/dashboard.png";

import { tokenManager } from "../../config/security.js";
import { buildApiUrl } from '../../config/api.js';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutToast, setShowLogoutToast] = useState(false);

  const handleLogout = async () => {
    try {
      const currentToken = tokenManager.get();
      if (currentToken) {
        const response = await fetch(buildApiUrl('/api/auth/logout'), {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${currentToken}`,
            'Content-Type': 'application/json'
          }
        });
        // Esperar a que el backend confirme el logout antes de limpiar el token local
        if (!response.ok) {
          console.error('Error en logout backend:', await response.text());
        }
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      tokenManager.remove();
      // Notificar a otras pestañas
      localStorage.setItem('logout-event', Date.now());
      setShowLogoutToast(true);
      setTimeout(() => {
        setShowLogoutToast(false);
        navigate("/loginSistema");
      }, 1500);
    }
  };
  // Sincronizar logout entre pestañas
  React.useEffect(() => {
    const onStorage = (event) => {
      if (event.key === 'logout-event') {
        tokenManager.remove();
        navigate("/loginSistema");
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Control de activo
  const isAlmacenesActive =
    location.pathname.startsWith("/almacenes") ||
    location.pathname.startsWith("/asistencias") ||
    location.pathname.startsWith("/subalmacenes");

  const isTrabajadoresActive = location.pathname.startsWith("/trabajadores");

  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-5 py-2 rounded-full text-sm transition-all duration-200
    ${
      isActive
        ? "bg-white text-black font-semibold scale-105 shadow"
        : "text-gray-300 hover:bg-white hover:text-black hover:scale-105 hover:shadow"
    }`;

  return (
    <>
      {showLogoutToast && (
        <Toast message="Sesión cerrada correctamente" type="success" show={showLogoutToast} onHide={() => setShowLogoutToast(false)} />
      )}
      <aside className="w-64 h-screen bg-[#18202e] text-white flex flex-col justify-between px-4 pt-2 pb-4">
        <div>
          {/* Logo + Empresa + Usuario */}
          <div className="flex flex-col items-center mb-4">
            <div className="w-64 h-24 mb-2">
              <img src={logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
          </div>

          {/* Menú */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-blue-400 mb-3">MENU</p>
            <nav className="space-y-2">
              <NavLink to="/dashboard" className={navLinkClasses}>
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </NavLink>
              
              {/* Almacenes: activo en /almacenes y /asistencias */}
              {isAlmacenesActive ? (
                <div className="flex items-center gap-3 px-5 py-2 rounded-full text-sm bg-white text-black font-semibold scale-105 shadow cursor-default">
                  <Warehouse size={18} />
                  <span>Almacenes</span>
                </div>
              ) : (
                <NavLink to="/almacenes" className={navLinkClasses}>
                  <Warehouse size={18} />
                  <span>Almacenes</span>
                </NavLink>
              )}

              <NavLink to="/coordinadores" className={navLinkClasses}>
                <UserCog size={18} />
                <span>Coordinadores</span>
              </NavLink>
              
              <NavLink to="/rrhh" className={navLinkClasses}>
                <Users size={18} />
                <span>RRHH</span>
              </NavLink>
              
              {isTrabajadoresActive ? (
                <div className="flex items-center gap-3 px-5 py-2 rounded-full text-sm bg-white text-black font-semibold scale-105 shadow cursor-default">
                  <Users size={18} />
                  <span>Trabajadores</span>
                </div>
              ) : (
                <NavLink to="/trabajadores" className={navLinkClasses}>
                  <Users size={18} />
                  <span>Trabajadores</span>
                </NavLink>
              )}
            </nav>
          </div>
        </div>

        {/* Botón de Cerrar Sesión */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-5 py-2 rounded-full text-sm text-gray-300 hover:bg-red-500 hover:text-white transition duration-300"
        >
          <LogOut size={18} />
          <span>Salir</span>
        </button>
      </aside>
    </>
  );
}
