# Guía de Ayuda para MapYourWorld

Este documento proporciona información sobre las herramientas y scripts disponibles para facilitar el desarrollo del proyecto MapYourWorld.

## Scripts de Utilidad

El proyecto incluye varios scripts de utilidad ubicados en la carpeta `/scripts` que te ayudarán en diferentes tareas de desarrollo.

### Ejecución de Scripts

Para ejecutar cualquiera de estos scripts, usa el siguiente comando desde la raíz del proyecto:

```bash
# Usando npm
npm run script -- scripts/nombre-del-script.ts

# Usando yarn
yarn script scripts/nombre-del-script.ts
```

## Scripts Disponibles

### `setup.ts`

Este script configura el entorno de desarrollo inicial, instalando todas las dependencias necesarias y realizando la configuración básica del proyecto.

**Uso recomendado**: Cuando recién clonas el repositorio o necesitas reiniciar la configuración del proyecto.

```bash
npm run script -- scripts/setup.ts
```

### `check-imports.ts`

Verifica que todas las importaciones en el código sean correctas y sigan los estándares del proyecto. Ayuda a prevenir errores comunes de importación y mantiene la coherencia del código.

**Uso recomendado**: Antes de crear un pull request para asegurar que tus importaciones son correctas.

```bash
npm run script -- scripts/check-imports.ts
```

### `check-versions.ts`

Comprueba que las versiones de las dependencias sean consistentes en todo el proyecto, evitando conflictos de versiones entre los diferentes microservicios.

**Uso recomendado**: Cuando añades nuevas dependencias o actualizas las existentes.

```bash
npm run script -- scripts/check-versions.ts
```

### `clean-node-modules.ts`

Elimina todos los directorios `node_modules` del proyecto para limpiar espacio o resolver problemas de dependencias.

**Uso recomendado**: Cuando experimentas problemas extraños con las dependencias o necesitas liberar espacio en disco.

```bash
npm run script -- scripts/clean-node-modules.ts
```

### `deploy.ts`

Automatiza el proceso de despliegue de la aplicación, preparando los archivos necesarios y subiéndolos al entorno correspondiente. (en desarrollo)

**Uso recomendado**: Cuando estás listo para desplegar una nueva versión de la aplicación.

```bash
npm run script -- scripts/deploy.ts [--entorno=desarrollo|produccion]
```

## Flujo de Trabajo Recomendado

1. Después de clonar el repositorio, ejecuta `setup.ts` para configurar tu entorno.
2. Durante el desarrollo, usa `check-imports.ts` para verificar tus importaciones.
3. Antes de subir cambios, ejecuta `check-versions.ts` para asegurar la consistencia.
4. Si encuentras problemas con las dependencias, prueba con `clean-node-modules.ts`.
5. Cuando quieras desplegar, utiliza `deploy.ts` con el entorno correspondiente.

## Solución de Problemas Comunes

Si encuentras problemas al ejecutar algún script, intenta los siguientes pasos:

1. Asegúrate de estar en la raíz del proyecto
2. Verifica que tengas instalado Node.js v16 o superior
3. Ejecuta `npm install` para asegurarte de tener todas las dependencias
4. Si persisten los problemas, contacta al equipo internamente