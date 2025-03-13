# Sistema de Eventos para MapYourWorld

## Introducción

Este documento describe el sistema de comunicación basado en eventos implementado en MapYourWorld para la comunicación entre microservicios. El sistema utiliza RabbitMQ como broker de mensajes y sigue un patrón de publicación/suscripción.

## Arquitectura del Sistema

El sistema de eventos de MapYourWorld está diseñado para permitir la comunicación asíncrona entre los diferentes microservicios de la plataforma:

```
                   +----------------+
                   |                |
                   |   RabbitMQ     |
                   |                |
                   +--------+-------+
                            ^
                            |
            +---------------+---------------+
            |               |               |
  +---------v--+    +-------v----+    +----v-------+
  |            |    |            |    |            |
  | Map        |    | User       |    | Auth       |
  | Service    |    | Service    |    | Service    |
  |            |    |            |    |            |
  +------+-----+    +------+-----+    +------+-----+
         ^                 ^                 ^
         |                 |                 |
         |                 |                 |
  +------v-----------------v-----------------v-----+
  |                                                |
  |                API Gateway                     |
  |                                                |
  +------------------------------------------------+
```

## Tipos de Eventos

Los eventos están categorizados por dominio y definidos en la enumeración `TipoEvento`:

- Eventos de Usuario: `usuario.creado`, `usuario.actualizado`, etc.
- Eventos de Mapa: `mapa.creado`, `mapa.actualizado`, etc.
- Eventos de Notificación: `notificacion.creada`, `notificacion.enviada`, etc.
- Eventos Sociales: `social.comentario.creado`, `social.me_gusta.creado`, etc.
- Eventos de Sistema: `sistema.error`, `sistema.metricas`, etc.

## Estructura de los Mensajes

Cada mensaje de evento sigue esta estructura:

```typescript
interface MensajeEvento {
  tipo: string | TipoEvento;
  datos: any;
  metadatos: {
    timestamp: number;
    idUsuario?: string;
    idDispositivo?: string;
    idCorrelacion?: string;
    servicioOrigen: string;
  };
}
```

## Guía de Implementación para Microservicios

### 1. Instalación de Dependencias

Todos los microservicios deben incluir:

```bash
npm install amqplib
npm install @types/amqplib --save-dev
```

### 2. Configuración de Variables de Entorno

Configura las siguientes variables en el archivo `.env` de cada microservicio:

```
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASS=guest
RABBITMQ_VHOST=/
RABBITMQ_EXCHANGE=mapyourworld
```

En entorno de producción, usar valores apropiados y seguros.

### 3. Publicación de Eventos

Para publicar eventos desde un microservicio:

```typescript
import { publicarEvento, TipoEvento } from '../models/rabbit-mq';

// En alguna función del servicio
async function crearUsuario(datosUsuario) {
  // Lógica para crear el usuario
  const usuarioCreado = await usuarioRepository.save(datosUsuario);
  
  // Publicar evento
  await publicarEvento(
    'user-service', // Nombre del servicio
    TipoEvento.USUARIO_CREADO, // Tipo de evento
    {
      id: usuarioCreado.id,
      email: usuarioCreado.email,
      nombre: usuarioCreado.nombre,
      fechaCreacion: usuarioCreado.fechaCreacion
    },
    usuarioCreado.id // ID del usuario relacionado
  );
  
  return usuarioCreado;
}
```

### 4. Suscripción a Eventos

Para que un microservicio se suscriba a eventos específicos:

```typescript
import { suscribirseAEventos, TipoEvento } from '../models/rabbit-mq';

// Al iniciar el microservicio
async function inicializarSuscripcionesEventos() {
  await suscribirseAEventos(
    'notification-service',
    'notificaciones_mapas',
    [TipoEvento.MAPA_CREADO, TipoEvento.MAPA_COMPARTIDO],
    async (mensaje, claveEnrutamiento) => {
      // Lógica para procesar el evento
      console.log(`Evento recibido: ${mensaje.tipo}`);
      
      // Ejemplo: crear notificación cuando un mapa es compartido
      if (mensaje.tipo === TipoEvento.MAPA_COMPARTIDO) {
        await crearNotificacionMapaCompartido(mensaje.datos);
      }
    }
  );
}
```

## Seguridad y Buenas Prácticas

1. **Autenticación**: Configurar RabbitMQ con credenciales seguras y SSL en producción.

2. **Validación de Mensajes**: Validar siempre la estructura y contenido de los mensajes.

3. **Manejo de Errores**: Implementar estrategias de retroceso exponencial para reintentos.

4. **Correlación de Eventos**: Usar IDs de correlación para seguimiento de acciones.

5. **Monitoreo**: Configurar alertas para colas que crezcan demasiado.

6. **Pruebas**: Crear pruebas específicas para la comunicación basada en eventos.

## Claves de Enrutamiento

El sistema usa claves de enrutamiento basadas en tópicos:

- `usuario.*`: Todos los eventos relacionados con usuarios
- `mapa.*`: Todos los eventos relacionados con mapas
- `#`: Todos los eventos (usar con precaución)

## Manejo de Fallos

El sistema implementa estas estrategias para manejo de fallos:

1. **Reconexión Automática**: Con backoff exponencial en caso de desconexión.

2. **Persistencia de Mensajes**: Las colas son durables para evitar pérdida de mensajes.

3. **Acknowledgments**: Los mensajes deben ser explícitamente confirmados.

4. **Dead Letter Queues**: Para mensajes no procesables.

## Más Información

Para implementaciones más específicas, consultar el código fuente del API Gateway:
- `models/rabbit-mq/rabbit-mq.ts`: Implementación del conector
- `services/event-handler.service.ts`: Servicio de gestión de eventos
- `services/event-security.service.ts`: Servicios de seguridad para eventos

---

Para dudas o problemas adicionales, contactar al equipo de desarrollo. 