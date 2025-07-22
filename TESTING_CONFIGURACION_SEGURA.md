# 🧪 CONFIGURACIÓN DE TESTING PARA PRODUCCIÓN

## ⚠️ DISCLAIMER
Este archivo contiene SOLO configuración y documentación.
NO contiene código ejecutable ni scripts.

## 🎯 TESTING MÍNIMO REQUERIDO ANTES DE AWS DEPLOYMENT

### ✅ TESTS OBLIGATORIOS (DOCUMENTACIÓN)

#### 1. Health Checks Básicos
```
Verificar manualmente:
- GET /health retorna status 200
- GET /ping-db retorna connected: true
- Frontend/ compila sin errores (npm run build)
- frontend-App/ compila sin errores (npm run build)
```

#### 2. Flujos Críticos
```
Probar manualmente antes del deploy:
- Login con usuario admin
- Login con usuario RRHH  
- Login con usuario coordinador
- Crear nuevo usuario
- Eliminar usuario
- Asignar almacén a coordinador
- Registrar asistencia
- Auto-logout al cerrar navegador
```

#### 3. Configuración de Variables
```
Verificar que estas variables estén configuradas:
Backend .env:
- DB_HOST (RDS endpoint)
- JWT_SECRET (256+ caracteres)
- NODE_ENV=production
- FRONTEND_URL (dominio real)

Frontend .env.production:
- VITE_API_URL (dominio real del backend)
```

## 🔧 CONFIGURACIÓN VITEST (SOLO REFERENCIA)

### Backend package.json (scripts a agregar)
```json
{
  "scripts": {
    "test:health": "echo 'Verificar /health y /ping-db manualmente'",
    "prestart": "echo 'Verificar configuración antes de iniciar'"
  }
}
```

### frontend-App package.json (dependencies a agregar)
```json
{
  "devDependencies": {
    "vitest": "^2.0.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.6.3"
  },
  "scripts": {
    "test": "echo 'Testing configurado pero no implementado'",
    "prebuild": "echo 'Verificar configuración antes de build'"
  }
}
```

## 📊 CHECKLIST PRE-DEPLOYMENT

### Backend
- [ ] Servidor inicia sin errores
- [ ] /health retorna status healthy
- [ ] /ping-db conecta a base de datos
- [ ] Login funciona con usuarios reales
- [ ] CORS configurado para dominios de producción

### Frontend (Sistema Admin)
- [ ] npm run build exitoso
- [ ] Login redirige a dashboard
- [ ] CRUD usuarios funciona
- [ ] Dashboard carga datos
- [ ] Auto-logout funciona

### frontend-App (App Coordinadores)  
- [ ] npm run build exitoso
- [ ] Login simplificado funciona
- [ ] Flujo de asistencias completo
- [ ] Funciona en dispositivos móviles

### AWS Infrastructure
- [ ] RDS configurado y accesible
- [ ] EC2 con Node.js y dependencias
- [ ] S3 buckets para ambos frontends
- [ ] CloudFront distributions
- [ ] DNS configurado

## 🚨 TESTS CRÍTICOS MANUALES

### Test 1: Login Flow Completo
```
1. Ir a login page
2. Ingresar credenciales válidas
3. Verificar redirección a dashboard
4. Verificar que token se guarda
5. Cerrar navegador
6. Abrir navegador nuevo
7. Verificar que pide login nuevamente
```

### Test 2: CRUD Usuarios
```
1. Login como admin
2. Ir a página de usuarios
3. Crear nuevo usuario
4. Editar usuario creado
5. Eliminar usuario
6. Verificar que se eliminó de la base de datos
```

### Test 3: Asignación Almacenes
```
1. Login como admin o RRHH
2. Seleccionar coordinador
3. Abrir modal de asignación
4. Asignar almacén
5. Verificar que se guardó correctamente
```

## 📋 NOTAS IMPORTANTES

- Este archivo NO contiene código ejecutable
- Todas las pruebas se realizan manualmente
- No se incluyen scripts automatizados
- Solo documentación de qué verificar
- Configuración de referencia únicamente

## ⚡ ACCIÓN INMEDIATA

1. Revisar manualmente cada punto del checklist
2. Configurar variables de entorno para producción
3. Probar todos los flujos críticos
4. Verificar health checks
5. Proceder con deployment solo si todo funciona
