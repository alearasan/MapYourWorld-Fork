#!/bin/bash

echo "======================================"
echo "    Iniciando MapYourWorld...        "
echo "======================================"
echo

echo "Iniciando API Gateway..."
cd backend/api-gateway && npm run dev &
API_PID=$!
cd ../../

echo
echo "Iniciando Frontend Web..."
cd frontend/web && npm run dev &
WEB_PID=$!
cd ../../

echo
echo "======================================"
echo "Aplicación iniciada correctamente."
echo "Puedes acceder a:"
echo "- API Gateway: http://localhost:3000"
echo "- Frontend Web: http://localhost:5173"
echo "======================================"
echo
echo "Presiona CTRL+C para detener todos los servicios."

# Función para detener servicios al salir
cleanup() {
    echo
    echo "Deteniendo servicios..."
    kill $API_PID $WEB_PID 2>/dev/null
    echo "Servicios detenidos correctamente."
    exit 0
}

# Capturar señal de interrupción (CTRL+C)
trap cleanup SIGINT

# Mantener el script en ejecución
wait 