@echo off
echo ======================================
echo    Iniciando MapYourWorld...
echo ======================================
echo.
echo Iniciando API Gateway...
start cmd /k "cd backend\api-gateway && npm run dev"
echo.
echo Iniciando Frontend Web...
start cmd /k "cd frontend\web && npm run dev"
echo.
echo ======================================
echo Aplicación iniciada correctamente.
echo Puedes acceder a:
echo - API Gateway: http://localhost:3000
echo - Frontend Web: http://localhost:5173
echo ======================================
echo.
echo Presiona CTRL+C para salir de este mensaje.
echo Para detener la aplicación, cierra las ventanas de los servicios.
pause > nul 