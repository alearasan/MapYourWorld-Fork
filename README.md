# 🌍 MapYourWorld

Una aplicación que permite a los usuarios registrar lugares visitados con elementos de gamificación.

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

### 4. Configurar variables de entorno

Copia los archivos de ejemplo de variables de entorno y personalízalos según sea necesario:

```bash
# Para el backend
cp backend/.env.example backend/.env

# Para el frontend web
cp frontend/web/.env.example frontend/web/.env

# Para el frontend móvil
cp frontend/mobile/.env.example frontend/mobile/.env
```

## 💻 Desarrollo

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

Esto ejecutará la aplicación web en modo desarrollo, accesible en `http://localhost:3000` por defecto.

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

Para iniciar servicios como MongoDB, PostgreSQL, Redis y RabbitMQ:

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
3. Asegúrate de que las rutas de API estén correctamente protegidas



## 🤝 Contribuir

1. Crear una rama para tu característica: `git checkout -b feature/nombre-caracteristica`
2. Realizar cambios y commits: `git commit -am 'Añadir nueva característica'`
3. Subir a tu rama: `git push origin feature/nombre-caracteristica`
4. Crear un Pull Request

### Convenciones de código

- Usar TypeScript para todo el código
- Seguir el estilo definido en ESLint y Prettier
- Documentar funciones y componentes con JSDoc
- Escribir pruebas para todas las características nuevas

## 📜 Licencia

Este proyecto está licenciado bajo la licencia ISC - ver el archivo LICENSE para más detalles.
