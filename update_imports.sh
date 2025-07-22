#!/bin/bash

# Script para actualizar todos los imports a la nueva estructura
# Ejecutar desde el directorio Frontend

echo "🔧 Actualizando imports a la nueva estructura de componentes..."

# Función para actualizar un archivo
update_imports() {
    local file="$1"
    echo "📝 Actualizando: $file"
    
    # Backup del archivo original
    cp "$file" "$file.backup"
    
    # Reemplazos por categoría
    
    # Layout components
    sed -i "s|from '../components/MainLayout'|from '@/components/layout'|g" "$file"
    sed -i "s|from '../components/Header'|from '@/components/layout'|g" "$file"
    sed -i "s|from '../components/Sidebar'|from '@/components/layout'|g" "$file"
    
    # UI components
    sed -i "s|from '../components/ConfirmModal'|from '@/components/ui'|g" "$file"
    sed -i "s|from '../components/Toast'|from '@/components/ui'|g" "$file"
    sed -i "s|from '../components/ErrorBoundary'|from '@/components/ui'|g" "$file"
    sed -i "s|from '../components/Notificacion'|from '@/components/ui'|g" "$file"
    sed -i "s|from '../components/ExcelIcon'|from '@/components/ui'|g" "$file"
    
    # Charts components
    sed -i "s|from '../components/DashboardCards'|from '@/components/charts'|g" "$file"
    sed -i "s|from '../components/ModernDashboardCards'|from '@/components/charts'|g" "$file"
    sed -i "s|from '../components/HorasExtrasChart'|from '@/components/charts'|g" "$file"
    sed -i "s|from '../components/ModernHorasExtrasChart'|from '@/components/charts'|g" "$file"
    sed -i "s|from '../components/MetricsPanel'|from '@/components/charts'|g" "$file"
    sed -i "s|from '../components/ModernMetricsPanel'|from '@/components/charts'|g" "$file"
    sed -i "s|from '../components/TrabajadoresSemanaStats'|from '@/components/charts'|g" "$file"
    sed -i "s|from '../components/ModernTrabajadoresSemana'|from '@/components/charts'|g" "$file"
    
    # Shared components
    sed -i "s|from '../components/AgregarSubAlmacenButton'|from '@/components/shared'|g" "$file"
    sed -i "s|from '../components/SubalmacenFechasList'|from '@/components/shared'|g" "$file"
    sed -i "s|from '../components/ProtectorRuta'|from '@/components/shared'|g" "$file"
    
    # Features - Almacenes
    sed -i "s|from '../components/almacenes/|from '@/components/features/almacenes'|g" "$file"
    
    # Features - Asistencias
    sed -i "s|from '../components/asistencias/|from '@/components/features/asistencias'|g" "$file"
    
    # Features - Trabajadores
    sed -i "s|from '../components/trabajadores/|from '@/components/features/trabajadores'|g" "$file"
    
    # Features - Coordinadores
    sed -i "s|from '../components/Coordinadores/|from '@/components/features/coordinadores'|g" "$file"
    
    # Features - RRHH
    sed -i "s|from '../components/RRHH/|from '@/components/features/rrhh'|g" "$file"
    
    echo "✅ Completado: $file"
}

# Buscar todos los archivos .jsx en pages que tengan imports de components
files=$(find src/pages -name "*.jsx" -exec grep -l "from '\.\./components/" {} \;)

if [ -z "$files" ]; then
    echo "✅ No se encontraron archivos que necesiten actualización"
    exit 0
fi

echo "📁 Archivos a actualizar:"
echo "$files"
echo ""

# Confirmar antes de proceder
read -p "¿Continuar con la actualización? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Operación cancelada"
    exit 1
fi

# Actualizar cada archivo
while IFS= read -r file; do
    update_imports "$file"
done <<< "$files"

echo ""
echo "🎉 Actualización completada!"
echo "📝 Se crearon backups con extensión .backup"
echo "🔍 Revisa los archivos y elimina los backups si todo está correcto"
