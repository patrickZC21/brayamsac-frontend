# 🧪 ESTRATEGIA DE TESTING PARA PRODUCCIÓN AWS

## 📊 **ESTADO ACTUAL DEL TESTING**

### **Frontend/ (Sistema Admin)**
```
✅ CONFIGURACIÓN EXISTENTE:
- Vitest configurado y funcionando
- Testing Library instalado
- Setup de testing completo (src/test/setup.js)
- Mock de localStorage/sessionStorage
- 1 test implementado (DashboardCards.test.jsx)

⚠️ COBERTURA ACTUAL: ~5% (1 componente de 20+)
```

### **frontend-App/ (App Coordinadores)**
```
❌ SIN TESTING:
- No hay configuración de testing
- No hay tests implementados
- Sin dependencias de testing
- Sin scripts de testing

⚠️ COBERTURA ACTUAL: 0%
```

---

## 🎯 **TESTING OBLIGATORIO PARA PRODUCCIÓN**

### **🔴 CRÍTICOS (OBLIGATORIOS)**

#### **1. Tests de Integración E2E**
```javascript
// Tests que DEBEN funcionar antes de deploy:
- ✅ Login flow completo
- ✅ CRUD usuarios (crear, editar, eliminar)
- ✅ Asignación de almacenes
- ✅ Registro de asistencias
- ✅ Dashboard carga datos
- ✅ Auto-logout funciona
- ✅ Password visibility por roles
```

#### **2. Tests de API (Backend)**
```javascript
// Endpoints críticos que DEBEN probarse:
- ✅ POST /auth/login
- ✅ GET /usuarios
- ✅ POST /usuarios (crear)
- ✅ DELETE /usuarios/:id
- ✅ GET /asistencias
- ✅ POST /asistencias
- ✅ GET /almacenes
- ✅ Health check (/health, /ping-db)
```

#### **3. Tests Unitarios Críticos**
```javascript
// Componentes críticos para el negocio:
- ✅ LoginSistema.test.jsx
- ✅ Dashboard.test.jsx  
- ✅ RRHHTable.test.jsx
- ✅ CoordinadoresTable.test.jsx
- ✅ AsignarAlmacenesModal.test.jsx
- ✅ useAutoLogout.test.js
```

### **🟡 IMPORTANTES (RECOMENDADOS)**

#### **4. Tests de Performance**
```javascript
- ⚠️ Tiempo de carga < 3 segundos
- ⚠️ Memory leaks en componentes
- ⚠️ Bundle size analysis
```

#### **5. Tests de Seguridad**
```javascript
- ⚠️ XSS protection
- ⚠️ CSRF token validation
- ⚠️ Rate limiting efectivo
```

---

## 📋 **PLAN DE IMPLEMENTACIÓN INMEDIATA**

### **FASE 1: Tests E2E Críticos (2-3 horas)**

#### **Backend API Tests**
```javascript
// Backend/tests/api.test.js
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fetch from 'node-fetch';

const API_BASE = process.env.API_URL || 'http://localhost:3000';

describe('API Critical Tests', () => {
  let authToken = '';
  
  beforeAll(async () => {
    // Login para obtener token
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        correo: 'admin@brayam.com',
        password: 'admin123'
      })
    });
    const data = await response.json();
    authToken = data.token;
  });

  it('should authenticate user', () => {
    expect(authToken).toBeTruthy();
  });

  it('should get users list', async () => {
    const response = await fetch(`${API_BASE}/usuarios`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    expect(response.status).toBe(200);
  });

  it('should check database health', async () => {
    const response = await fetch(`${API_BASE}/health`);
    const data = await response.json();
    expect(data.status).toBe('healthy');
  });
});
```

#### **Frontend Critical Flow Tests**
```javascript
// Frontend/src/test/critical-flows.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LoginSistema from '../pages/LoginSistema';

describe('Critical User Flows', () => {
  it('should complete login flow', async () => {
    render(
      <BrowserRouter>
        <LoginSistema />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText(/correo/i);
    const passwordInput = screen.getByPlaceholderText(/contraseña/i);
    const loginButton = screen.getByRole('button', { name: /iniciar sesión/i });

    fireEvent.change(emailInput, { target: { value: 'admin@brayam.com' } });
    fireEvent.change(passwordInput, { target: { value: 'admin123' } });
    fireEvent.click(loginButton);

    // Verificar que el login funciona
    await waitFor(() => {
      expect(window.location.pathname).toBe('/dashboard');
    });
  });
});
```

### **FASE 2: Setup Testing para frontend-App/ (1 hora)**

#### **Configurar Testing en frontend-App/**
```bash
cd frontend-App

# Instalar dependencias de testing
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react

# Crear vitest.config.js
# Crear src/test/setup.js
# Agregar scripts de testing al package.json
```

### **FASE 3: Tests de Componentes Críticos (3-4 horas)**

#### **Tests para componentes críticos:**
```javascript
// Cada componente crítico necesita:
- LoginSistema.test.jsx
- Dashboard.test.jsx
- RRHHTable.test.jsx (password visibility)
- CoordinadoresTable.test.jsx  
- AsignarAlmacenesModal.test.jsx
- useAutoLogout.test.js
```

---

## 🚀 **IMPLEMENTACIÓN EN CI/CD**

### **Pipeline de Testing para AWS Deployment**

```bash
#!/bin/bash
# test-before-deploy.sh

echo "🧪 Running Critical Tests Before Deployment..."

# Backend Tests
echo "🔧 Testing Backend API..."
cd Backend
npm test

# Frontend Admin Tests  
echo "🏢 Testing Frontend Admin..."
cd ../Frontend
npm run test:coverage

# Frontend App Tests
echo "📱 Testing Frontend App..."
cd ../frontend-App  
npm run test

# E2E Tests (opcional pero recomendado)
echo "🌐 Running E2E Tests..."
npm run test:e2e

echo "✅ All tests passed! Ready for deployment."
```

### **Scripts Package.json Actualizados**

#### **Backend/package.json**
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:api": "vitest run tests/api.test.js",
    "test:coverage": "vitest run --coverage",
    "prestart": "npm run test:api"
  }
}
```

#### **frontend-App/package.json** (PENDIENTE CREAR)
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui", 
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest --watch",
    "prebuild": "npm run test"
  }
}
```

---

## 📊 **COBERTURA MÍNIMA PARA PRODUCCIÓN**

### **Métricas Objetivo:**
- **🎯 Backend API**: 80% cobertura endpoints críticos
- **🎯 Frontend Admin**: 60% cobertura componentes críticos  
- **🎯 Frontend App**: 60% cobertura componentes críticos
- **🎯 E2E Flows**: 100% flujos críticos funcionando

### **Tests Mínimos Obligatorios:**
```
✅ Login flow (ambos frontends)
✅ CRUD usuarios completo
✅ Asignación almacenes
✅ Registro asistencias  
✅ Auto-logout funcionando
✅ Health checks backend
✅ Password visibility por roles
✅ Eliminación cascada usuarios
```

---

## ⚡ **ACCIÓN INMEDIATA RECOMENDADA**

### **Prioridad 1 (ANTES del deployment):**
1. **Crear Backend API tests** para endpoints críticos
2. **Setup testing en frontend-App/**
3. **Tests para flujos críticos** (login, CRUD usuarios)
4. **Health checks automatizados**

### **Prioridad 2 (Durante deployment):**
1. **Pipeline CI/CD** con tests automáticos
2. **Monitoring** en producción
3. **Tests de performance** bajo carga

¿Quieres que empiece implementando los tests críticos para alguno de los sistemas específicos, o prefieres que configure primero el pipeline completo de testing?
