# 🏢 Frontend - Sistema de Asistencias Brayam SAC

## 📋 Descripción

Frontend moderno desarrollado en React 19 para el sistema de gestión de asistencias de trabajadores. Incluye funcionalidades para administrar almacenes, coordinadores, trabajadores y registros de asistencia.

## 🚀 Tecnologías

- **React 19.1.0** - Framework frontend
- **Vite 6.3.5** - Build tool y dev server
- **TailwindCSS 4.1.9** - Framework CSS utilitario
- **React Router 7.6.2** - Enrutamiento
- **Recharts 3.0.0** - Gráficos y visualizaciones
- **Lucide React** - Iconografía moderna
- **Vitest** - Framework de testing
- **TypeScript** - Tipado estático (opcional)

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Ejecutar en desarrollo
npm run dev
```

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run preview          # Vista previa del build

# Construcción
npm run build            # Build de producción
npm run analyze          # Análisis del bundle

# Calidad de código
npm run lint             # Revisar código con ESLint
npm run lint:fix         # Corregir errores automáticamente
npm run prettier         # Formatear código
npm run type-check       # Verificar tipos TypeScript

# Testing
npm run test             # Ejecutar tests
npm run test:ui          # Interfaz gráfica de tests
npm run test:coverage    # Coverage de tests
npm run test:watch       # Tests en modo watch

# Validación completa
npm run validate         # Ejecutar todas las validaciones
```

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── almacenes/      # Componentes de almacenes
│   ├── asistencias/    # Componentes de asistencias
│   ├── trabajadores/   # Componentes de trabajadores
│   └── ...
├── pages/              # Páginas principales
├── hooks/              # Custom hooks
├── services/           # Servicios de API
├── utils/              # Utilidades y helpers
├── config/             # Configuración
└── test/               # Configuración de tests
```

## 🔒 Funcionalidades de Seguridad

### ✅ Implementadas
- Gestión segura de tokens JWT
- Validación de formularios
- Sanitización de inputs
- Headers de autorización
- Manejo de errores centralizado

### 🚧 Mejoradas
- Almacenamiento seguro con sessionStorage
- Sistema de refresh tokens
- Validación robusta con esquemas
- Error boundaries para React
- Logging estructurado

## 🎯 Optimizaciones de Performance

- **Lazy Loading** - Componentes cargados bajo demanda
- **Memoización** - React.memo, useMemo, useCallback
- **Virtualización** - Para listas grandes
- **Code Splitting** - División automática del código
- **Cache inteligente** - Gestión de cache de API

## 🧪 Testing

El proyecto incluye un setup completo de testing:

- **Vitest** - Framework de testing rápido
- **React Testing Library** - Testing de componentes
- **Coverage** - Reportes de cobertura
- **Mocks** - Mocks de APIs y servicios

### Ejecutar Tests

```bash
# Tests básicos
npm run test

# Con interfaz gráfica
npm run test:ui

# Con coverage
npm run test:coverage
```

## 📱 Responsive Design

- **Mobile First** - Diseño optimizado para móviles
- **Breakpoints** - sm, md, lg, xl, 2xl
- **Flexbox & Grid** - Layouts modernos
- **Touch Friendly** - Interfaz táctil optimizada

## 🌐 Variables de Entorno

```env
# API Configuration
VITE_API_URL=https://brayamsac-backend.onrender.com
VITE_API_TIMEOUT=10000

# Security
VITE_ENABLE_HTTPS=false
VITE_SESSION_TIMEOUT=3600000

# Development
VITE_ENABLE_LOGGING=true
VITE_ENABLE_PERFORMANCE_MONITORING=true
```

## 🚀 Deployment

### Desarrollo
```bash
npm run dev
# Servidor en http://localhost:5173 (desarrollo local del frontend)
```

### Producción
```bash
npm run build
npm run preview
# Build en carpeta dist/
```

### Docker (Opcional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

## 🔧 Configuración IDE

### VS Code Extensions Recomendadas
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Tailwind CSS IntelliSense
- Auto Rename Tag
- Bracket Pair Colorizer

### Settings.json
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}
```

## 📈 Métricas de Calidad

### Puntuación Actual: 6.8/10

**Fortalezas:**
- ✅ Arquitectura moderna y bien estructurada
- ✅ Stack tecnológico actualizado
- ✅ Componentes reutilizables
- ✅ Separación de responsabilidades

**Áreas de Mejora:**
- 🔧 Implementación completa de TypeScript
- 🔧 Mayor cobertura de tests
- 🔧 Optimizaciones de performance
- 🔧 Mejoras de accesibilidad

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Add: nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

### Convenciones de Commits
```
feat: nueva funcionalidad
fix: corrección de bug
docs: documentación
style: formato de código
refactor: refactorización
test: añadir tests
chore: tareas de mantenimiento
```

## 📞 Soporte

Para soporte técnico o preguntas:
- 📧 Email: soporte@brayamsac.com
- 📱 Teléfono: +51 XXX XXX XXX
- 🐛 Issues: GitHub Issues

## 📄 Licencia

Proyecto privado - Brayam SAC © 2024

---

**Última actualización:** Enero 2024  
**Versión:** 1.0.0  
**Estado:** En desarrollo activo
