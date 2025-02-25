# Frontend de MapYourWorld

Este directorio contiene el frontend de la aplicación MapYourWorld, implementado con React Native.

## Estado del Proyecto

El frontend se encuentra actualmente en desarrollo. Se han establecido las bases y estructura principal, pero varios módulos están todavía en proceso de construcción.

## Dependencias Principales

Se han instalado las siguientes bibliotecas principales:

- **React Native**: Framework principal para el desarrollo móvil multiplataforma
- **Tailwind CSS para React Native**: Se ha integrado esta biblioteca para estilizar la aplicación con un enfoque utility-first
- **React Navigation**: Para la navegación entre pantallas

## Estructura del Proyecto (en desarrollo)

```
frontend/
├── assets/                 # Recursos estáticos (imágenes, fuentes, etc.)
├── components/             # Componentes reutilizables
├── screens/                # Pantallas de la aplicación
├── navigation/             # Configuración de navegación
├── hooks/                  # Custom hooks
├── contexts/               # Context API para estado global
├── services/               # Servicios para comunicación con el backend
├── utils/                  # Utilidades y helpers
├── styles/                 # Configuración de estilos (Tailwind)
├── app.json                # Configuración de la aplicación
├── package.json            # Dependencias del proyecto
└── App.tsx                 # Punto de entrada de la aplicación
```

## Módulos en Construcción

Los siguientes módulos están actualmente en desarrollo:

- **Sistema de Autenticación**: Pantallas de registro, inicio de sesión y recuperación de contraseña
- **Exploración de Mapas**: Visualización de mapas y puntos de interés
- **Funcionalidades Sociales**: Comentarios, likes y perfiles de usuario
- **Sistema de Notificaciones**: Notificaciones en tiempo real

## Configuración de Tailwind CSS

Se ha instalado la biblioteca de Tailwind CSS para React Native, que permite utilizar clases de utilidad similares a Tailwind en el desarrollo de aplicaciones React Native. La configuración se encuentra en el directorio `/styles`.

### Ejemplo de uso:

```jsx
import { View, Text } from 'react-native';
import { styled } from 'nativewind';

// Componentes con soporte para clases de Tailwind
const StyledView = styled(View);
const StyledText = styled(Text);

export default function MyComponent() {
  return (
    <StyledView className="flex-1 items-center justify-center bg-gray-100">
      <StyledText className="text-xl font-bold text-blue-500">
        ¡Hola, MapYourWorld!
      </StyledText>
    </StyledView>
  );
}
```

## Próximos Pasos

- Completar la integración con el backend
- Implementar todos los diseños de UI/UX
- Optimizar el rendimiento para diferentes dispositivos
- Configurar pruebas automatizadas 