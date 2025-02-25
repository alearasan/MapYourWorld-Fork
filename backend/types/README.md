# Estructura de Tipos Centralizada

Este directorio contiene todos los tipos e interfaces utilizados por los diferentes servicios del backend. 
La centralización ayuda a mantener la coherencia y evita la duplicación de tipos entre servicios.

## Estructura

```
types/
├── common/
│   └── common.types.ts     # Tipos comunes a todos los servicios
├── auth/
│   └── auth.types.ts       # Tipos de autenticación y usuarios
├── map/
│   └── map.types.ts        # Tipos de mapas y puntos de interés
├── user/
│   └── user.types.ts       # Tipos de perfiles de usuario
├── social/
│   └── social.types.ts     # Tipos para funcionalidades sociales
├── notification/
│   └── notification.types.ts # Tipos para el sistema de notificaciones
└── index.ts                # Archivo principal de exportación
```

## Cómo importar

Puedes importar tipos de varias maneras:

### Importación directa de tipos comunes
```typescript
import type { UUID, ISODateString } from '@types';
```

### Importación de tipos específicos de un servicio
```typescript
import type { Auth } from '@types';

// Uso
const userData: Auth.UserData = {
  // ...
};
```

### Múltiples tipos de diferentes servicios
```typescript
import type { UUID, Auth, Map } from '@types';

// Uso
const userData: Auth.UserData = { /* ... */ };
const district: Map.District = { /* ... */ };
```

## Aliasing

En el `tsconfig.json` se han configurado los siguientes alias:

```json
"paths": {
  "@backend/*": ["./*"],
  "@shared/*": ["../shared/*"],
  "@types/*": ["./types/*"],
  "@types": ["./types"]
}
```

## Mejores prácticas

1. Siempre usa el alias `@types` para importar tipos centralizados
2. Mantén los tipos organizados en sus carpetas correspondientes
3. Usa `import type` en lugar de `import` para importaciones de tipos (opcional)
4. Asegúrate de que los tipos sean coherentes entre servicios
5. Utiliza los tipos comunes siempre que sea posible
6. Documenta los tipos con comentarios JSDoc 