# Archivos Dockerfile Deshabilitados

Los archivos Dockerfile en este directorio han sido temporalmente deshabilitados cambiando su extensión a `.disabled`.

## Cómo usar los Dockerfiles

Para usar estos archivos:

1. Cambia el nombre de los archivos quitando la extensión `.disabled`:
   ```bash
   # Para el archivo base
   mv Dockerfile.base.disabled Dockerfile.base
   
   # Para el archivo auth
   mv Dockerfile.auth.disabled Dockerfile.auth
   ```

2. Ejecuta los comandos de Docker para construir las imágenes:
   ```bash
   # Para construir la imagen base
   docker build -f Dockerfile.base -t mapyourworld/base .
   
   # Para construir la imagen auth
   docker build -f Dockerfile.auth -t mapyourworld/auth .
   ```

## Archivos disponibles

- `Dockerfile.base.disabled`: Imagen base para los servicios
- `Dockerfile.auth.disabled`: Imagen para el servicio de autenticación

## Recuerda

Después de usarlos, considera volver a deshabilitarlos renombrándolos con la extensión `.disabled` para evitar problemas con los linters de Docker. 