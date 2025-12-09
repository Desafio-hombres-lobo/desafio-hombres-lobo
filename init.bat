@echo off

set CONTAINERS=mysql_db laravel_app ts_frontend adminer

set TARGET_CONTAINER=laravel_app

set EXEC_COMMAND=php artisan reverb:start --host=0.0.0.0 --port=8080

echo Iniciando docker compose...
docker compose down

:: Verificamos si existe el archivo "build.lock"
IF EXIST "build.lock" (
    echo Detectada instalacion previa. Iniciando sin reconstruir...
    docker compose up -d
) ELSE (
    echo Primera ejecucion detectada. Construyendo imagenes...
    docker compose up -d --build
    :: Creamos el archivo vacio para recordar que ya construimos
    type NUL > build.lock
)

echo.
echo ============================
echo Esperando a los contenedores
echo ============================

for %%C in (%CONTAINERS%) do (
    echo.
    echo --- Esperando a '%%C' ---
    call :wait_container %%C
    echo '%%C' esta listo.
)

echo.
echo Todos los contenedores estan arrancados.

echo.
echo Ejecutando comando dentro de %TARGET_CONTAINER%...
docker exec -it %TARGET_CONTAINER% %EXEC_COMMAND%

echo.
echo Listo.
pause
exit /b

:wait_container
set CONTAINER_NAME=%1
set RUNNING=

:loop
for /f %%i in ('docker inspect -f "{{.State.Running}}" %CONTAINER_NAME% 2^>nul') do set RUNNING=%%i

if "%RUNNING%"=="true" (
    goto :eof
) else (
    timeout /t 1 >nul
    goto loop
)