# 🌍 MapYourWorld

Una aplicación que permite a los usuarios registrar lugares visitados con elementos de gamificación.

<div align="center">
  <h2>🚀 ¡ACTUALIZACIÓN IMPORTANTE! 🚀</h2>
  <p>Hemos simplificado la ejecución de la aplicación</p>
  <code>npm run app</code>
</div>

## 🚨 IMPORTANTE: Cambios Recientes en la Ejecución del Proyecto

Hemos realizado varias mejoras para simplificar la ejecución del proyecto:

1. **Nuevo Comando de Ejecución Sin Errores**: 
   ```bash
   npm run app
   ```
   Este comando inicia solamente los componentes funcionales (API Gateway y Frontend Web) evitando errores de los microservicios que aún no están completamente implementados.

2. **Script Visual Mejorado**:
   ```bash
   node scripts/start-minimal.js
   ```
   Proporciona una interfaz visual mejorada con mensajes claros durante el inicio de la aplicación.

3. **Documentación de Instalación Detallada**:
   Revisa el archivo `README-INSTALACION.md` para obtener instrucciones detalladas sobre la instalación y ejecución.

> **Nota**: Debido a la estructura de workspaces de npm, cuando ejecutas `npm run` sin especificar un comando exacto, se muestran los scripts de todos los workspaces. Siempre usa el nombre completo del script.

## 📋 Tabla de Contenidos

- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Desarrollo](#desarrollo)
- [Pruebas](#pruebas)
- [Despliegue](#despliegue)
- [Solución de Problemas Comunes](#solución-de-problemas-comunes)
- [Contribuir](#contribuir)

## 🏗️ Estructura del Proyecto

```
mapyourworld/
├── backend/                 # Servicios de backend
│   ├── api-gateway/         # API Gateway
│   ├── auth-service/        # Servicio de autenticación
│   ├── user-service/        # Servicio de usuarios
│   ├── map-service/         # Servicio de mapas
│   ├── social-service/      # Servicio social
│   └── notification-service/# Servicio de notificaciones
├── frontend/                # Aplicaciones cliente
│   ├── web/                 # Aplicación web React
│   └── mobile/              # Aplicación móvil React Native
├── shared/                  # Código compartido
│   ├── config/              # Configuraciones comunes
│   ├── libs/                # Librerías compartidas
│   ├── security/            # Utilidades de seguridad
│   └── websocket/           # Implementación de WebSockets
├── infrastructure/          # Configuración de infraestructura
│   ├── compose/             # Archivos Docker Compose
│   └── docker/              # Dockerfiles
└── scripts/                 # Scripts de utilidad
```

## 🛠️ Requisitos

- **Node.js**: v18.0.0 o superior
- **npm**: v8.0.0 o superior
- **Docker** y **Docker Compose**: Para despliegue y ejecución de servicios
- **Git**

## ⚙️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/mapyourworld.git
cd mapyourworld
```

### 2. Instalar todas las dependencias 

```bash
npm install
```

Este comando instalará todas las dependencias definidas en los archivos `package.json` en los diferentes directorios del proyecto (raíz, backend, frontend, shared).

### 3. Verificar la instalación

Para asegurarte de que la instalación se realizó correctamente, ejecuta:

```bash
npx tsc --noEmit
```

Si ves algunos errores relacionados con `ts-expect-error` o imports faltantes, no te preocupes, son normales en esta etapa del desarrollo y se resolverán más adelante.

### 4. Configurar variables de entorno (aún no listo) 

Copia los archivos de ejemplo de variables de entorno y personalízalos según sea necesario:

```bash
# Para el backend
cp backend/.env.example backend/.env

# Para el frontend web
cp frontend/web/.env.example frontend/web/.env

# Para el frontend móvil
cp frontend/mobile/.env.example frontend/mobile/.env
```

### 5. Gestión de dependencias con script automatizado

Para facilitar la gestión de dependencias del proyecto, puedes utilizar el script `actualizar-dependencias.js`:

```bash
node actualizar-dependencias.js
```

Este script ofrece las siguientes opciones:

1. **Borrar todos los node_modules del proyecto**: Elimina de forma recursiva todos los directorios `node_modules` en el proyecto.
2. **Instalar todas las dependencias del proyecto**: Reinstala todas las dependencias definidas en todos los archivos `package.json`.
3. **Fijar versiones exactas desde node_modules instalados**: Actualiza los archivos `package.json` para utilizar las versiones exactas de las dependencias instaladas.

Es especialmente útil cuando:
- Necesitas realizar una instalación limpia del proyecto
- Hay conflictos de dependencias o errores de compatibilidad
- Quieres asegurarte de que todos los miembros del equipo utilizan las mismas versiones de dependencias

## 💻 Desarrollo

### Ejecutar la aplicación sin errores (Recomendado)

Este comando iniciará solo los componentes que funcionan correctamente:

```bash
npm run app
```

O con una interfaz visual mejorada:

```bash
node scripts/start-minimal.js
```

### Ejecutar todo el proyecto en modo desarrollo-debug

Este comando iniciará tanto el backend como el frontend web:

```bash
npm run dev
```

### Ejecutar solo los servicios de backend

```bash
npm run dev:backend
```

Este comando iniciará todos los microservicios del backend en modo desarrollo con recarga automática cuando detecte cambios.

### Ejecutar solo la aplicación web

```bash
npm run dev:web
```

Esto ejecutará la aplicación web en modo desarrollo, accesible en `http://localhost:3001` por defecto.

### Ejecutar solo la aplicación móvil

```bash
npm run dev:mobile
```

Esto iniciará el entorno de desarrollo de React Native. Sigue las instrucciones en la terminal para ejecutar la aplicación en un emulador o dispositivo físico.

### Verificar tipos y linting

Para verificar los tipos en todo el proyecto:

```bash
npm run type-check
```

Para ejecutar el linter y encontrar problemas de estilo:

```bash
npm run lint
```

Para arreglar automáticamente problemas de linting:

```bash
npm run lint:fix
```

### Iniciar servicios externos con Docker

Para iniciar servicios como PostgreSQL, Redis y RabbitMQ:

```bash
npm run docker:backend-only
```

## 🧪 Pruebas

### Ejecutar todas las pruebas

```bash
npm test
```

### Ejecutar pruebas del backend

```bash
npm run test:backend
```

### Ejecutar pruebas de la aplicación web

```bash
npm run test:web
```

### Ejecutar pruebas de la aplicación móvil

```bash
npm run test:mobile
```

## 🚀 Despliegue

### Usando el script de despliegue

El script de despliegue te guiará a través del proceso:

```bash
npm run deploy
```

### Despliegue manual con Docker Compose

#### Solo backend

```bash
npm run docker:backend-only
```

#### Solo frontend

```bash
npm run docker:frontend-only
```

#### Proyecto completo

```bash
npm run docker:up
```

Para detener todos los servicios:

```bash
npm run docker:down
```

## ❓ Solución de Problemas Comunes

### Problemas con la ejecución de scripts npm

Si encuentras problemas al ejecutar los scripts npm:

1. Asegúrate de estar en la raíz del proyecto
2. Usa el nombre completo del script (por ejemplo, `npm run app`)
3. Si los comandos muestran scripts no esperados, es debido a la estructura de workspaces de npm

### Error de dependencias faltantes

Si encuentras errores como "Cannot find module..." después de la instalación:

```bash
# Intenta reinstalar las dependencias
rm -rf node_modules
npm install

# Si el problema persiste, instala la dependencia específica
npm install nombre-del-paquete
```

### Problemas con TypeScript

Si encuentras errores de TypeScript:

1. Verifica que todas las referencias a los tipos sean correctas
2. Ejecuta `npm run type-check` para ver todos los errores
3. Actualiza las importaciones según sea necesario

### Errores de WebSocket

Si los WebSockets no funcionan correctamente:

1. Verifica que el servidor de WebSocket esté en ejecución
2. Asegúrate de que los puertos no estén bloqueados
3. Revisa la consola del navegador para ver errores específicos

### Errores de autenticación

Si tienes problemas con la autenticación:

1. Verifica que el servicio de autenticación esté en ejecución
2. Comprueba que las variables de entorno relacionadas con JWT estén configuradas correctamente

## 🤝 Contribuir

1. Crear una rama para tu característica: `git checkout -b feature/[backend/frontend]_nombre_caracteristica`
2. Realizar cambios y commits: `git commit -am 'Añadir nueva característica'`
3. Subir a tu rama: `git push origin feature/[backend/frontend]_nombre_caracteristica`
4. Crear un Pull Request

### Convenciones de código

- Usar TypeScript para todo el código
- Seguir el estilo definido en ESLint y Prettier
- Documentar funciones y componentes con JSDoc
- Escribir pruebas para todas las características nuevas

## 📜 Licencia

Este proyecto está licenciado bajo la licencia ISC - ver el archivo LICENSE para más detalles.

## Instrucciones de instalación actualizadas (Node.js 22.14.0 LTS)

Se ha actualizado el proyecto para ser compatible con Node.js 22.14.0 LTS. Sigue estos pasos para configurar tu entorno:

### Requisitos

- Node.js 22.14.0 LTS o superior
- npm 10.x o superior (viene con Node.js 22)

### Instalación limpia

1. Verifica tu entorno:
   ```
   npm run verificar:entorno
   ```

2. Instala todas las dependencias con un solo comando:
   ```
   npm run install:clean
   ```

### Desarrollo

- Frontend web: `npm run dev:web`
- Frontend móvil: `npm run dev:mobile`
- Backend: `npm run dev:backend`
- Todo junto: `npm run dev`

### Notas importantes

- Se ha actualizado Expo a la versión SDK 52, que es compatible con React Native 0.73.2
- Se ha optimizado la configuración de npm para evitar conflictos de dependencias
- Para el desarrollo móvil, usar los comandos `npx expo` en lugar de `expo`
