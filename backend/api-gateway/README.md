# API Gateway - MapYourWorld

## Descripción General
El API Gateway es el componente central de la arquitectura de microservicios de MapYourWorld, actuando como punto de entrada único para todas las solicitudes de los clientes. Este componente se encarga de enrutar las peticiones a los microservicios correspondientes, implementar mecanismos de seguridad, y gestionar la comunicación entre servicios.

## Características Principales

### 1. Enrutamiento de Peticiones
- **Enrutamiento dinámico**: Redirección de solicitudes a los microservicios apropiados.
- **Balanceo de carga**: Distribución equilibrada de solicitudes entre instancias de servicios.
- **Versiones de API**: Soporte para diferentes versiones de endpoints.

### 2. Seguridad
- **Autenticación JWT**: Verificación de tokens JWT para identificar usuarios.
- **Control de acceso**: Implementación de roles y permisos.
- **Rate limiting**: Protección contra ataques de fuerza bruta y DoS.
- **Validación de entradas**: Filtrado de datos maliciosos antes de llegar a los microservicios.

### 3. Sistema de Mensajería RabbitMQ
- **Publicación/Suscripción**: Comunicación asíncrona entre microservicios.
- **Mensajes persistentes**: Garantía de entrega incluso en caso de fallos.
- **Colas de mensajes fallidos (DLQ)**: Gestión de mensajes fallidos para mayor robustez.
- **Reintentos automáticos**: Mecanismo de reintento con backoff exponencial.
- **Monitoreo de mensajería**: Seguimiento de métricas y estado de colas.

### 4. Resiliencia
- **Circuit Breaker**: Protección contra fallos en cascada utilizando el patrón circuit breaker.
- **Timeouts configurables**: Control de tiempos máximos de respuesta.
- **Reintentos inteligentes**: Reintentos con backoff exponencial para operaciones fallidas.
- **Gestión de errores centralizada**: Manejo uniforme de excepciones.

### 5. Caché
- **Caché en memoria**: Almacenamiento temporal de respuestas frecuentes.
- **Políticas de expiración**: Configuración de TTL por tipo de recurso.
- **Invalidación selectiva**: Actualización de caché cuando cambian los datos.

### 6. Logging y Monitoreo
- **Logging estructurado**: Registro detallado de todas las operaciones.
- **Trazabilidad**: Seguimiento de peticiones a través de microservicios (ID de correlación).
- **Métricas de rendimiento**: Recopilación de datos sobre latencia, tasas de error, etc.
- **Monitoreo de salud**: Verificación continua del estado de los servicios.

## Arquitectura

El API Gateway sigue una arquitectura basada en capas:

### 1. Capa de Entrada
- **Controllers**: Recepción y validación inicial de peticiones.
- **Middleware de autenticación**: Verificación de identidad de usuarios.
- **Middleware de validación**: Comprobación de formato y contenido de solicitudes.

### 2. Capa de Enrutamiento
- **Enrutadores dinámicos**: Redirección a microservicios basada en la ruta y el método.
- **Balanceadores**: Distribución equitativa de carga entre instancias.

### 3. Capa de Integración
- **Adaptadores de servicio**: Interfaces para comunicación con cada microservicio.
- **Cliente HTTP**: Gestión de peticiones HTTP a microservicios.
- **Cliente RabbitMQ**: Gestión de mensajería asíncrona.

### 4. Capa de Salida
- **Transformadores de respuesta**: Formato uniforme de respuestas.
- **Middleware de errores**: Manejo centralizado de excepciones.

## Sistema de Mensajería RabbitMQ

El API Gateway utiliza RabbitMQ como sistema de mensajería para comunicación asíncrona entre microservicios. Las principales características de esta implementación son:

### Características
- **Conector robusto**: Implementación con reconexión automática y manejo de errores.
- **Colas de mensajes fallidos (DLQ)**: Captura de mensajes fallidos para análisis y reprocesamiento.
- **Mecanismo de reintentos**: Reintentos automáticos con backoff exponencial.
- **Sistema de monitoreo**: Métricas de mensajes enviados, recibidos y fallidos.
- **Patrones de intercambio**: Soporte para diversos patrones de comunicación (topic, direct, fanout).

### Componentes
- **ConectorRabbitMQ**: Clase principal para gestionar conexiones y canales.
- **ProcesadorDeadLetter**: Utilidad para monitorear y procesar mensajes en DLQ.
- **Funciones auxiliares**: API simplificada para publicación y suscripción.

### Eventos soportados
El sistema soporta diversos tipos de eventos categorizados por dominio:
- **Usuario**: creación, actualización, eliminación, autenticación.
- **Mapa**: creación, actualización, visualización, compartición.
- **Notificaciones**: creación, lectura, envío.
- **Social**: comentarios, me gusta, compartir.
- **Sistema**: errores, advertencias, métricas, salud.

## Configuración

El API Gateway es altamente configurable mediante variables de entorno:

### General
- `PORT`: Puerto en el que escucha el API Gateway (por defecto: 3000)
- `NODE_ENV`: Entorno de ejecución (development, production)

### Microservicios
- `AUTH_SERVICE_URL`: URL del servicio de autenticación
- `USER_SERVICE_URL`: URL del servicio de usuarios
- `MAP_SERVICE_URL`: URL del servicio de mapas
- `NOTIFICATION_SERVICE_URL`: URL del servicio de notificaciones
- `SOCIAL_SERVICE_URL`: URL del servicio social

### RabbitMQ
- `RABBITMQ_HOST`: Servidor de RabbitMQ (por defecto: localhost)
- `RABBITMQ_PORT`: Puerto de RabbitMQ (por defecto: 5672)
- `RABBITMQ_USER`: Usuario de RabbitMQ (por defecto: guest)
- `RABBITMQ_PASS`: Contraseña de RabbitMQ (por defecto: guest)
- `RABBITMQ_VHOST`: VHost de RabbitMQ (por defecto: /)
- `RABBITMQ_EXCHANGE`: Exchange principal (por defecto: mapyourworld)
- `RABBITMQ_MAX_RECONNECT`: Máximo número de intentos de reconexión
- `RABBITMQ_RETRY_DELAY`: Tiempo base entre reintentos en ms
- `RABBITMQ_MAX_RETRIES`: Máximo número de reintentos para mensajes fallidos

### Seguridad
- `JWT_SECRET`: Clave secreta para firmar y verificar tokens JWT
- `JWT_EXPIRATION`: Tiempo de expiración de tokens

### Caché
- `CACHE_TTL`: Tiempo de vida por defecto para entradas en caché
- `CACHE_MAX_SIZE`: Tamaño máximo de la caché en memoria

## Uso

### Instalación y ejecución
```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev

# Iniciar en modo producción
npm run start
```

### Monitoreo de RabbitMQ
```bash
# Iniciar monitoreo de colas de mensajes fallidos
npm run monitor-dlq
```

## Endpoints documentados
La documentación completa de endpoints está disponible en:
- Swagger UI: `/api-docs`
- Documentación estática: `/docs`

## Salud y diagnóstico
- Estado de servicios: `/health`
- Métricas: `/metrics`
- Estado de RabbitMQ: `/health/rabbitmq`

## Mejoras Recientes

### Sistema de Colas RabbitMQ

Se han implementado mejoras significativas en la integración con RabbitMQ:

#### Gestión de Colas de Mensajes Fallidos (DLQ)

- **Estructura de DLQ unificada**: Las colas de mensajes fallidos ahora siguen una convención de nombres consistente (`mapyourworld_api-gateway_fallidos_eventos_*`).
- **TTL configurable**: Los mensajes en colas DLQ tienen un TTL de 2 horas (7,200,000 ms) configurable.
- **Verificación automática**: El sistema verifica automáticamente la existencia de las colas DLQ durante el arranque.

```typescript
// Verificación de colas DLQ
const conector = obtenerConectorRabbitMQ(nombreServicio);
await conector.verificarColasDLQ();
```

#### Manejo de Errores Mejorado

- **Optional Chaining**: Uso de encadenamiento opcional para mejorar la legibilidad y seguridad del código.
- **Reconexión inteligente**: Detección y manejo mejorado de errores de conexión.
- **Control de errores específicos**: Diferenciación entre errores de cola no existente y otros errores críticos.

#### Scripts de Administración de Colas

- **Limpieza de colas**: Script para purgar colas existentes respetando las configuradas.
- **Creación de colas**: Script para crear colas con la configuración correcta.
- **Forzado de setup**: Opción para forzar la recreación de colas con configuración actualizada.

```bash
# Recreación forzada de colas
RABBITMQ_FORCE_SETUP=true npx ts-node src/colasConfig/setup-crear-colas.ts
```

#### Suscripción Resiliente

- **Formateo automático de nombres**: Las funciones de suscripción formatean automáticamente los nombres de cola para mantener convenciones.
- **Helper de verificación**: La función `obtenerNombreColaCompleto` evita la duplicación de prefijos.
- **Evita duplicación de prefijos**: Se evita añadir múltiples veces el prefijo "mapyourworld_" a los nombres de cola.

#### Monitorización

- **Logs mejorados**: Mensajes de log claros y descriptivos para todas las operaciones de RabbitMQ.
- **Verificación explícita de DLQ**: Ahora se muestra con checkmarks la verificación de cada cola DLQ.
- **Métricas detalladas**: Conteo de mensajes enviados, recibidos, procesados y fallidos. 

## Guía de Integración para Microservicios

Esta sección proporciona información práctica sobre cómo conectar un nuevo microservicio al sistema de mensajería RabbitMQ existente.

### Diagramas de Arquitectura de Mensajería

#### Flujo de Publicación de Eventos

```
┌─────────────────┐      ┌──────────────────┐      ┌───────────────────┐
│                 │      │                  │      │                   │
│  Microservicio  │─────▶│  API Gateway     │─────▶│  Exchange         │
│  (Publicador)   │      │  (Coordinador)   │      │  "mapyourworld"   │
│                 │      │                  │      │                   │
└─────────────────┘      └──────────────────┘      └──────────┬────────┘
                                                             │
                                                             ▼
                         ┌─────────────────────────────────────────────────┐
                         │                                                 │
                         │     Enrutamiento basado en clave de routing     │
                         │                                                 │
                         └───┬─────────────────┬───────────────────┬───────┘
                             │                 │                   │
                             ▼                 ▼                   ▼
                  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
                  │                  │ │                  │ │                  │
                  │  Cola Servicio A │ │  Cola Servicio B │ │  Cola Servicio C │
                  │                  │ │                  │ │                  │
                  └──────────────────┘ └──────────────────┘ └──────────────────┘
```

#### Arquitectura de Dead Letter Queues (DLQ)

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│                 │      │                  │      │                 │
│  Cola Principal │─────▶│  Procesamiento   │─────▶│  Procesado OK   │
│  de Eventos     │      │  de Mensaje      │      │  (ACK)          │
│                 │      │                  │      │                 │
└─────────────────┘      └──────────────────┘      └─────────────────┘
        │                         │
        │                         │ Error/Fallo  
        │                         ▼
        │               ┌──────────────────┐      ┌─────────────────┐
        │               │                  │      │                 │
        └──────────────▶│  Dead Letter    │─────▶│  Análisis y     │
          Después de    │  Exchange (DLX) │      │  Reprocesado    │
          reintentos    │  "mapyourworld. │      │  Manual         │
          fallidos      │  mensaje-fallido"│      │                 │
                        └──────────────────┘      └─────────────────┘
                                 │
                                 ▼
               ┌─────────────────────────────────────┐
               │                                     │
               │ Dead Letter Queue (DLQ)            │
               │ mapyourworld_api-gateway_fallidos_ │
               │ eventos_[categoria]                │
               │                                     │
               └─────────────────────────────────────┘
```

### Integración de un Nuevo Microservicio

Para integrar un nuevo microservicio con el sistema de mensajería, sigue estos pasos:

#### 1. Crear o Actualizar el Script de Configuración de Colas

Actualiza `backend/api-gateway/src/colasConfig/setup-crear-colas.ts` para incluir las colas necesarias para tu servicio:

```typescript
// Añadir la nueva cola para tu servicio
const COLAS_A_CREAR = [
  // Colas existentes
  'api-gateway_eventos_auth',
  'api-gateway_eventos_mapas',
  // Nueva cola para tu servicio
  'api-gateway_eventos_mi_servicio'
];
```

#### 2. Implementar un Manejador de Eventos en el Servicio

Implementa un controlador o servicio que procesará los eventos:

```typescript
// En tu microservicio: src/services/event-handler.service.ts
import { suscribirseACategoria } from 'ruta-al-conector-rabbitmq';

class EventHandlerService {
  private readonly NOMBRE_SERVICIO = 'mi-servicio';
  
  async iniciar(): Promise<void> {
    await this.suscribirseAEventosMiServicio();
  }
  
  private async suscribirseAEventosMiServicio(): Promise<void> {
    try {
      const idSuscripcion = await suscribirseACategoria(
        this.NOMBRE_SERVICIO,
        'api-gateway_eventos_mi_servicio', // Nombre de cola completo
        'mi-servicio',                     // Categoría para filtrado
        this.procesarEventoMiServicio.bind(this)
      );
      
      console.log(`Suscripción a eventos establecida: ${idSuscripcion}`);
    } catch (error) {
      console.error('Error al suscribirse a eventos:', error);
      throw error;
    }
  }
  
  private async procesarEventoMiServicio(mensaje: any, metadatos: any): Promise<void> {
    // Implementar lógica de procesamiento aquí
    console.log('Evento recibido:', mensaje);
    
    // Procesar según el tipo de evento
    switch(mensaje.tipo) {
      case 'mi-servicio.crear':
        await this.procesarCreacion(mensaje.datos);
        break;
      case 'mi-servicio.actualizar':
        await this.procesarActualizacion(mensaje.datos);
        break;
      default:
        console.warn(`Tipo de evento no manejado: ${mensaje.tipo}`);
    }
  }
}
```

#### 3. Publicar Eventos desde tu Microservicio

Para publicar eventos que serán consumidos por otros servicios:

```typescript
// En tu microservicio
import { publicarEvento } from 'ruta-al-conector-rabbitmq';

class MiServicioController {
  async crearRecurso(datos: any): Promise<void> {
    // Tu lógica de negocio aquí
    const nuevoRecurso = await this.servicio.crear(datos);
    
    // Publicar evento para informar a otros servicios
    await publicarEvento(
      'mi-servicio.creado',
      { 
        id: nuevoRecurso.id,
        nombre: nuevoRecurso.nombre,
        // Incluir solo datos relevantes para otros servicios
      },
      'mi-servicio' // Nombre del servicio publicador
    );
    
    return nuevoRecurso;
  }
}
```

#### 4. Ejecutar los Scripts de Configuración

Antes de iniciar tu servicio, asegúrate de que las colas estén correctamente configuradas:

```bash
# Desde el directorio api-gateway
cd backend/api-gateway

# Si necesitas recrear las colas (cuidado: esto eliminará mensajes existentes)
RABBITMQ_FORCE_SETUP=true npx ts-node src/colasConfig/setup-crear-colas.ts

# O simplemente crear las que faltan
npx ts-node src/colasConfig/setup-crear-colas.ts
```

#### 5. Consideraciones Importantes

- **Convención de nombres**: Sigue la convención `api-gateway_eventos_[nombre-servicio]` para colas y `[nombre-servicio].[accion]` para claves de enrutamiento.
- **Manejo de errores**: Implementa un manejo adecuado de errores en tu callback de procesamiento.
- **Idempotencia**: Diseña tus manejadores para ser idempotentes, ya que un mensaje podría procesarse más de una vez.
- **Serialización**: Asegúrate de que los datos publicados sean serializables (JSON).
- **Tamaño de mensajes**: Mantén los mensajes pequeños. Para datos grandes, pasa referencias en lugar del contenido completo. 