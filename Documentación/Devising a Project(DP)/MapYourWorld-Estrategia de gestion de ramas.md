# Gestión de Ramas y Versionado

## 1. Estrategia de Gestión de Ramas

### Ramas Principales

#### Rama `main`
- Contiene el código en su versión de producción.
- Solo se fusionan cambios completamente probados y revisados.
- Debe estar en un estado estable en todo momento.
- Las versiones liberadas (releases) se etiquetarán aquí con un número de versión semántica.
- Es la rama principal de desarrollo.
- Integra los cambios de todas las ramas de trabajo.

### Ramas de Trabajo

Para cada trabajo específico se recomienda crear una rama dedicada. Dependiendo del tipo de tarea, se utilizarán los siguientes esquemas de nombres y comandos:

#### Rama para Nuevas Características (Feature)
- **Nomenclatura:** `feature/nombre-caracteristica`
- Se recomienda utilizar esta rama para el desarrollo de nuevas funcionalidades.
- **Flujo de trabajo para ramas feature:**
  1. **Crear la rama para tu característica:**
     ```
     git checkout -b feature/nombre-caracteristica
     ```
  2. **Realizar cambios y commits:**
     ```
     git commit -am 'Añadir nueva característica'
     ```
  3. **Subir la rama al repositorio remoto:**
     ```
     git push origin feature/nombre-caracteristica
     ```
  4. **Crear un Pull Request** para fusionar los cambios en `main`.

### Flujo de Trabajo General

#### Creación de Ramas
1. Al iniciar un nuevo WI, WF o el desarrollo de una nueva característica, se crea una rama basada en `main` utilizando el esquema de nombres correspondiente.
2. Se realizan los cambios y se confirman mediante commits.

#### Revisión y Fusión a `main`
- Cada Pull Request (PR) hacia `main` debe ser revisado y aprobado antes de la fusión.
- Al aprobar el PR, la rama se fusiona en `main` y posteriormente se elimina para mantener la limpieza del repositorio.

---

## 2. Estrategia de Versionado

El sistema de versionado se basa en el esquema de **Versionado Semántico (MAJOR.MINOR.PATCH)**, donde:

- **MAJOR:** Cambia cuando hay modificaciones importantes e incompatibles en el proyecto.
- **MINOR:** Cambia cuando se añaden nuevas funcionalidades de manera compatible con versiones anteriores.
- **PATCH:** Cambia cuando se realizan correcciones de errores y ajustes menores compatibles con versiones anteriores.

### Ejemplos de Versionado
- `v1.0.0`: Primera versión estable de producción.
- `v1.1.0`: Versión con nuevas características, manteniendo la compatibilidad.
- `v1.1.1`: Versión con correcciones menores de errores.

### Flujo de Versionado

#### Liberación en Producción
- Al fusionar en `main` para una nueva versión, se asigna una etiqueta de versión (`vX.Y.Z`).
- El incremento en la versión dependerá de los cambios realizados:
  - Incremento de **MAJOR** para cambios grandes e incompatibles.
  - Incremento de **MINOR** para nuevas funcionalidades compatibles.
  - Incremento de **PATCH** para correcciones de errores menores.

#### Etiquetas en el Repositorio
- Al momento de la fusión en `main`, se crea una etiqueta con la versión en formato `vX.Y.Z`.
- Estas etiquetas sirven para rastrear la historia de las versiones en el repositorio y facilitar la identificación de cambios.
