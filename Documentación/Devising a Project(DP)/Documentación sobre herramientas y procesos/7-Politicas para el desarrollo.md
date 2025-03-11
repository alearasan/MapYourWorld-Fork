# Grupo 7

**ISPP-MapYourWorld**  
_Devising a project_

**Alfonso Alonso, Alejandro Aragón, José María Baquero, Pablo Caballero,  
Ricardo Carrero, Franco Dell Águila, Alberto Escobar, Jaime Gómez,  
Claudio González, Ángel Neria, Pablo Olivencia, Antonio Porcar, Alba Ramos,  
Pedro Pablo Santos, Manuel Vélez, Gonzalo García**

19/02/2025

---

### CONTROL DE VERSIONES

| **VERSIÓN** | **FECHA**    | **COMENTARIOS**               | **AUTOR**                        |
|-------------|--------------|-------------------------------|----------------------------------|
| v1.0        | 19/02/2025   | Creación del documento        | Pedro Pablo Santos               |
| v1.1        | 19/02/2025   | Revisión del formato          | Ricardo Carrero                  |
| V1.2        | 05/03/2025   | Actualización de documento    | Manuel Vélez                     |

---

# Índice

- [1. Convenciones de Desarrollo](#convenciones-de-desarrollo)
  - [1.1. Política de Commits](#política-de-commits)
  - [1.2. Gestión de Issues y Pull Requests](#gestión-de-issues-y-pull-requests)
    - [1.2.1. Responsabilidades](#responsabilidades)
  - [1.3. Estrategia de Ramas](#estrategia-de-ramas)
  - [1.4. Flujo de Trabajo](#flujo-de-trabajo)

# Convenciones de Desarrollo

Este documento define las buenas prácticas para la gestión del código, commits, issues, pull requests y la estrategia de ramas en nuestro equipo de desarrollo.

## Política de Commits

Para mantener claridad y uniformidad en el historial del repositorio, seguiremos la siguiente convención en los mensajes de commit:

- **feat:** Cuando se implemente una nueva funcionalidad. El modelo de mensaje será "*feat: nombre de la funcionalidad, explicación breve*".
- **fix:** Cuando se realicen correcciones o ajustes en una funcionalidad existente. El modelo será "*fix: nombre de la funcionalidad, explicación breve*".
- **test:** Cuando se agreguen o modifiquen pruebas. El modelo será "*test: nombre de la funcionalidad, qué test se han realizado*".
- **chore:** Cuando se actualicen dependencias. El modelo será "chore: dependencias que se han actualizado".
- **refactor:** Cuando el código se actualice sin cambiar la funcionalidad, con el objetivo de mejorar su entendimiento. El modelo será "refactor: nombre de la funcionalidad mejorada, explicación breve de lo que se ha hecho".
- **docs:** Cuando se añada nueva documentación al proyecto. El modelo será "docs: documento añadido".
- **style:** Cuando se modifique únicamente el estilo del código, como cambiar el nombre de una variable o eliminar un comentario. El modelo será "style: dónde se ha realizado un cambio de estilo, de forma breve".

Cada commit debe ser claro y conciso, evitando mensajes genéricos como "arreglos" o "cambios".

## Gestión de Issues y Pull Requests

Para estructurar un issue, se establecerá un título descriptivo, seguido de una breve descripción y la asignación de la prioridad.

Trabajaremos con un **Project** en el que las tareas estarán organizadas en diferentes columnas:

- **To Do:** Contiene las tareas pendientes de desarrollo.
- **In Progress:** Cuando un desarrollador comience a trabajar en una tarea, deberá moverla a esta columna y asignarse como responsable.
- **Review:** Una vez completado el desarrollo, se creará una pull request y se asignará un revisor, quien revisará la implementación antes de aprobar la integración. La aprobación se realizará mediante un mensaje positivo; en caso de que el código no esté correcto, se deberá, en la medida de lo posible, indicar en qué falla.
- **Done:** Cuando la pull request sea aprobada y fusionada, la tarea se moverá a esta columna y se considerará finalizada.

Para las pull requests se asignarán dos revisores, encargados de verificar que no se hayan modificado archivos que no deban cambiar y de asegurar la corrección del código, evitando problemas al integrar funcionalidades en la rama *main* y controlando posibles bugs o errores.

### Responsabilidades

- **Desarrollador:** Asignarse la tarea, moverla a "In Progress", crear la pull request y asignar un revisor.
- **Revisor:** Revisar el código asegurándose de que cumpla con los estándares antes de aprobar la pull request.

## Estrategia de Ramas

Para mantener un flujo de trabajo ordenado, seguiremos la siguiente estructura de ramas:

- **main:** Rama estable con el código listo para producción.
- **develop:** Rama en la que se enviarán todas las pull requests antes de pasar los cambios a *main*, permitiendo la corrección de posibles errores críticos.
- **feature/***: Para nuevas funcionalidades. Ejemplo: *feature/loginPage*.
- **hotfix/***: Para correcciones urgentes en producción. Ejemplo: *hotfix/paymentBug*.
- **test/***: Rama en la que se realizarán los tests de un determinado módulo o funcionalidad.

Todas estas ramas deberán eliminarse una vez que la funcionalidad para la que fueron creadas sea completada.

## Flujo de Trabajo

1. Crear una nueva rama a partir de *main* según el tipo de tarea.
2. Desarrollar la funcionalidad o corrección.
3. Abrir una pull request contra *main*.
4. Una vez revisada y aprobada, integrar la funcionalidad en *main*.
