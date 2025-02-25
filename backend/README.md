# Backend de MapYourWorld

Este directorio contiene el backend de la aplicación MapYourWorld, implementado con una arquitectura de microservicios en Node.js y TypeScript.

## Estructura del Proyecto

```
backend/
├── types/                  # Tipos centralizados para todos los servicios
├── auth-service/           # Servicio de autenticación
├── social-service/         # Servicio de funcionalidades sociales
├── map-service/            # Servicio de mapas y puntos de interés
├── notification-service/   # Servicio de notificaciones en tiempo real
├── user-service/           # Servicio de gestión de usuarios
├── api-gateway/            # API Gateway para enrutar peticiones
├── shared/                 # Código compartido entre servicios
├── node_modules/           # Dependencias de Node.js
├── package.json            # Dependencias principales del backend
├── tsconfig.json           # Configuración principal de TypeScript
└── index.ts                # Punto de entrada principal (orquestación)
```

## Archivos Principales

### index.ts
Punto de entrada principal que orquesta el inicio de todos los microservicios. Se encarga de iniciar cada servicio en el orden correcto y gestionar las dependencias entre ellos.

### tsconfig.json
Configuración principal de TypeScript para todo el backend, define las opciones de compilación y los alias de importación utilizados por todos los servicios. Incluye configuración de rutas para facilitar las importaciones entre servicios usando alias como `@backend/*`, `@shared/*` y `@types`.

### package.json
Define las dependencias comunes para todo el backend y los scripts principales para desarrollo, construcción y despliegue.

## Estructura Detallada por Carpeta

### Tipos Centralizados (`/types`)

Contiene todos los tipos compartidos entre servicios, organizados por dominio:

```
types/
├── common/
│   └── common.types.ts     # UUID, ISODateString, GeoCoordinates, etc.
├── auth/
│   └── auth.types.ts       # UserData, DecodedToken, AuthResponse, etc.
├── map/
│   └── map.types.ts        # District, POI, Photo, etc.
├── user/
│   └── user.types.ts       # UserProfile, UserPreferences, etc.
├── social/
│   └── social.types.ts     # Comment, Reaction, Friendship, etc.
├── notification/
│   └── notification.types.ts # Notification, NotificationType, etc.
└── index.ts                # Re-exporta todos los tipos para fácil acceso
```

El archivo `index.ts` proporciona un punto central para importar todos los tipos, permitiendo importaciones como:
```typescript
import { UUID, Auth, Map } from '@types';
```

### Servicio de Autenticación (`/auth-service`)

Gestiona todos los aspectos de autenticación y autorización:

```
auth-service/
├── src/
│   ├── controllers/        # Controladores para las rutas
│   │   └── auth.controller.ts  # Registro, login, verificación
│   │   └── auth.middleware.ts  # Verificación de tokens
│   ├── services/           # Lógica de negocio
│   │   └── auth.service.ts # Servicios de autenticación
│   ├── config/             # Configuraciones
│   │   └── jwt.config.ts   # Configuración de JWT
│   ├── types/              # Tipos específicos del servicio
│   │   └── index.ts        # Re-exporta tipos necesarios
│   └── index.ts            # Punto de entrada del servicio
├── package.json            # Dependencias del servicio
└── tsconfig.json           # Configuración de TypeScript
```

Los endpoints principales incluyen:
- `/api/auth/register` - Registro de nuevos usuarios
- `/api/auth/login` - Inicio de sesión
- `/api/auth/verify` - Verificación de tokens JWT
- `/api/auth/profile` - Obtención del perfil de usuario

### Servicio Social (`/social-service`)

Implementa funcionalidades sociales como comentarios, likes y gestión de fotos:

```
social-service/
├── src/
│   ├── controllers/        # Controladores para las rutas
│   │   ├── social.controller.ts  # Gestión social (comentarios, likes)
│   │   └── photo.controller.ts   # Gestión de fotos
│   ├── routes/             # Definición de rutas API
│   │   ├── social.routes.ts      # Rutas para interacciones sociales
│   │   └── photo.routes.ts       # Rutas para gestión de fotos
│   ├── services/           # Lógica de negocio
│   │   ├── social.service.ts     # Servicios sociales
│   │   └── photo.service.ts      # Servicios de fotos
│   ├── types/              # Tipos específicos del servicio
│   │   └── index.ts        # Re-exporta tipos necesarios
│   └── index.ts            # Punto de entrada del servicio
├── package.json            # Dependencias del servicio
└── tsconfig.json           # Configuración de TypeScript
```

Funcionalidades principales:
- Comentarios en fotos y puntos de interés
- Sistema de likes y reacciones
- Subida y gestión de fotos georeferenciadas
- Seguimiento entre usuarios

### Servicio de Mapas (`/map-service`)

Gestiona información geográfica, distritos y puntos de interés:

```
map-service/
├── src/
│   ├── controllers/        # Controladores para las rutas
│   │   ├── district.controller.ts  # Gestión de distritos
│   │   └── poi.controller.ts       # Gestión de puntos de interés
│   ├── routes/             # Definición de rutas API
│   │   ├── district.routes.ts      # Rutas para distritos
│   │   └── poi.routes.ts           # Rutas para puntos de interés
│   ├── services/           # Lógica de negocio
│   │   ├── district.service.ts     # Servicios de distritos
│   │   └── poi.service.ts          # Servicios de puntos de interés
│   ├── types/              # Tipos específicos del servicio
│   │   └── index.ts        # Re-exporta tipos necesarios
│   └── index.ts            # Punto de entrada del servicio
├── package.json            # Dependencias del servicio
└── tsconfig.json           # Configuración de TypeScript
```

Funcionalidades principales:
- Gestión de distritos (creación, actualización, listado)
- Gestión de puntos de interés (POIs)
- Búsquedas geoespaciales
- Desbloqueo de distritos por usuarios

### Servicio de Usuarios (`/user-service`)

Gestiona perfiles, preferencias y estadísticas de usuario:

```
user-service/
├── src/
│   ├── controllers/        # Controladores para las rutas
│   │   ├── profile.controller.ts    # Gestión de perfiles
│   │   └── preferences.controller.ts # Gestión de preferencias
│   ├── routes/             # Definición de rutas API
│   │   └── user.routes.ts  # Rutas para gestión de usuarios
│   ├── services/           # Lógica de negocio
│   │   ├── profile.service.ts      # Servicios de perfil
│   │   ├── preferences.service.ts  # Servicios de preferencias
│   │   └── stats.service.ts        # Servicios de estadísticas
│   ├── types/              # Tipos específicos del servicio
│   │   └── index.ts        # Re-exporta tipos necesarios
│   └── index.ts            # Punto de entrada del servicio
├── package.json            # Dependencias del servicio
└── tsconfig.json           # Configuración de TypeScript
```

Funcionalidades principales:
- Gestión de perfiles de usuario
- Configuración de preferencias
- Seguimiento de estadísticas y logros
- Historial de actividad

### Servicio de Notificaciones (`/notification-service`)

Gestiona notificaciones en tiempo real:

```
notification-service/
├── src/
│   ├── controllers/        # Controladores para las rutas
│   │   └── notification.controller.ts # Gestión de notificaciones
│   ├── routes/             # Definición de rutas API
│   │   └── notification.routes.ts # Rutas para notificaciones
│   ├── services/           # Lógica de negocio
│   │   └── notification.service.ts # Servicios de notificaciones
│   ├── websocket/          # Gestión de WebSockets
│   │   └── socket.handler.ts # Manejo de conexiones WebSocket
│   ├── types/              # Tipos específicos del servicio
│   │   └── index.ts        # Re-exporta tipos necesarios
│   └── index.ts            # Punto de entrada del servicio
├── package.json            # Dependencias del servicio
└── tsconfig.json           # Configuración de TypeScript
```

Funcionalidades principales:
- Envío de notificaciones en tiempo real
- Gestión de suscripciones a canales
- Notificaciones push (opcional)
- Almacenamiento de historial de notificaciones

### API Gateway (`/api-gateway`)

Punto de entrada centralizado para todos los servicios:

```
api-gateway/
├── src/
│   ├── routes/             # Definición de rutas
│   │   ├── auth.routes.ts  # Rutas de autenticación
│   │   ├── map.routes.ts   # Rutas de mapas
│   │   ├── social.routes.ts # Rutas sociales
│   │   └── user.routes.ts  # Rutas de usuarios
│   ├── middleware/         # Middlewares
│   │   ├── auth.middleware.ts # Verificación de tokens
│   │   └── rate-limit.middleware.ts # Límite de peticiones
│   ├── services/           # Servicios del gateway
│   │   └── proxy.service.ts # Proxy a microservicios
│   ├── config/             # Configuraciones
│   │   └── services.config.ts # Configuración de servicios
│   └── index.ts            # Punto de entrada del gateway
├── package.json            # Dependencias del gateway
└── tsconfig.json           # Configuración de TypeScript
```

Funcionalidades principales:
- Enrutamiento de peticiones a los servicios apropiados
- Autenticación centralizada
- Limitación de tasa de peticiones
- Registro y monitoreo de peticiones

### Código Compartido (`/shared`)

Contiene código utilizado por múltiples servicios:

```
shared/
├── libs/                   # Bibliotecas compartidas
│   ├── rabbitmq/           # Cliente de RabbitMQ para comunicación entre servicios
│   │   └── index.ts        # Conectar, publicar y consumir eventos
│   ├── database/           # Utilidades de base de datos
│   │   └── index.ts        # Conexiones y operaciones comunes
│   └── logger/             # Sistema de logging centralizado
│       └── index.ts        # Funciones de logging
├── utils/                  # Utilidades generales
│   ├── validation.ts       # Funciones de validación
│   └── error-handling.ts   # Manejo de errores
└── config/                 # Configuraciones compartidas
    └── env.config.ts       # Configuración de variables de entorno
```

## Comunicación entre Servicios

Los servicios se comunican entre sí mediante:

1. **Eventos**: Utilizando RabbitMQ como broker de mensajes
   - Publicación de eventos cuando ocurren cambios importantes
   - Consumo de eventos para reaccionar a cambios en otros servicios

2. **HTTP**: Para llamadas sincrónicas entre servicios
   - Solicitudes directas cuando se necesita información inmediata

3. **WebSockets**: Para notificaciones en tiempo real
   - Comunicación bidireccional con los clientes 