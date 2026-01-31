#!/bin/bash

# Google Ads RSA Simulator - Quick Start Script
# Arsen Web 3.0

echo "🎯 Google Ads RSA Simulator - Quick Start"
echo "=========================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker primero."
    echo "   https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado."
    exit 1
fi

echo "✅ Docker y Docker Compose detectados"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env desde .env.example..."
    cp .env.example .env
    echo "⚠️  IMPORTANTE: Edita el archivo .env y cambia DB_PASSWORD"
    echo ""
    read -p "Presiona Enter para continuar o Ctrl+C para salir y editar .env primero..."
fi

echo "🚀 Iniciando servicios con Docker Compose..."
echo ""

# Start services
docker-compose up -d

echo ""
echo "⏳ Esperando a que los servicios estén listos..."
sleep 10

# Check service health
echo ""
echo "🔍 Verificando servicios..."
docker-compose ps

echo ""
echo "=========================================="
echo "✅ ¡Servicios iniciados!"
echo ""
echo "📱 Accede a la aplicación:"
echo "   Frontend: http://localhost:3000"
echo "   API:      http://localhost:3001"
echo ""
echo "📊 Comandos útiles:"
echo "   Ver logs:     docker-compose logs -f"
echo "   Detener:      docker-compose down"
echo "   Reiniciar:    docker-compose restart"
echo ""
echo "=========================================="
