#!/bin/bash

# Railway Initialization Script
# Ejecuta las migraciones de la BD cuando se deploya

set -e

echo "🗃️  Inicializando base de datos..."

if [ "$NODE_ENV" = "production" ]; then
  echo "📍 Entorno: Producción"
  
  # Ejecutar schema
  mysql -h ${DB_HOST} -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} < database/schema.sql
  
  echo "✅ Base de datos inicializada exitosamente"
else
  echo "⚠️  Entorno de desarrollo - skipping auto-initialization"
fi
