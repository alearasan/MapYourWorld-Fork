![Portada](../Imagenes/Herramientasyprocesos/Portada-an.png)

### CONTROL DE VERSIONES

| **VERSIÓN** | **FECHA**    | **COMENTARIOS**               | **AUTOR**                        |
|-------------|--------------|-------------------------------|----------------------------------|
| v1          | 06/03/2025   | Creación del documento        | Pablo Caballero María            |

---

# Tabla de contenido

- [1. Introducción](#introducción)
- [2. Análisis del pipeline](#análisis-del-pipeline)
  - [2.1. Validación de mensajes de commit](#validación-de-mensajes-de-commit)
  - [2.2. Análisis de estilo y formato de código](#análisis-de-estilo-y-formato-de-código)
  - [2.3. Análisis estático de código](#análisis-estático-de-código)
  - [2.4. Ejecución de pruebas automatizadas](#ejecución-de-pruebas-automatizadas)
  - [2.5. Escaneo de Seguridad y Dependencias](#escaneo-de-seguridad-y-dependencias)
  - [2.6. Despliegue Automatizado (CD)](#despliegue-automatizado-cd)
  - [2.7. Monitoreo y Observabilidad](#monitoreo-y-observabilidad)
- [3. Conclusiones](#conclusiones)

# Introducción

En el proceso de desarrollo de software, la integración y entrega continua (CI/CD) juegan un papel fundamental para garantizar la calidad, estabilidad y rapidez en la entrega de nuevas funcionalidades. Implementar un pipeline de CI/CD eficiente implica la combinación de diversas herramientas que automatizan tareas clave, como la validación de mensajes de commit, análisis de estilo de código, ejecución de pruebas, construcción de artefactos y despliegue en distintos entornos, entre otras.

Este documento analiza y compara diferentes herramientas utilizadas en cada etapa del proceso de CI/CD, evaluando sus características, ventajas y limitaciones. El objetivo es proporcionar una visión clara de las opciones disponibles para optimizar el flujo de desarrollo y garantizar entregas confiables y automatizadas.

# 2. Análisis del pipeline

### 2.1. Validación de mensajes de commit

La validación de los mensajes de commit es una tarea fundamental en un pipeline de CI/CD, ya que permite ajustarse a las convenciones de *conventional commit* que hemos definido, con el objetivo de mantener un historial de cambios estructurado y fácil de entender. Esto, a su vez, facilita la generación automática de *changelogs*, mejora la trazabilidad del código y agiliza la revisión de cambios. Para automatizar esta validación, existen herramientas como **commitlint**, que verifica que los mensajes sigan el formato definido, y **Husky**, que permite ejecutar verificaciones antes de que un commit sea registrado en el repositorio. Asimismo, GitHub Actions permite definir *workflows* de prehook para verificar la corrección de los mensajes de commit.

### 2.2. Análisis de estilo y formato de código

El análisis de estilo y formato de código es esencial para garantizar la uniformidad y legibilidad del código fuente. Aplicar reglas de estilo evita inconsistencias y facilita la colaboración entre los desarrolladores al mantener una estructura homogénea en el código. Herramientas como **ESLint** y **Prettier** en JavaScript (existen otras para otros lenguajes, como **Black** para Python) permiten detectar y, opcionalmente, corregir automáticamente errores de formato, asegurando que el código cumpla con las normas establecidas en el equipo.

### 2.3. Análisis estático de código

El análisis estático de código es una técnica que permite identificar errores y vulnerabilidades sin necesidad de ejecutar el software. A través de esta práctica, es posible detectar problemas de sintaxis, malas prácticas, riesgos de seguridad y posibles fallos de rendimiento antes de que el código llegue a producción. Herramientas como **SonarQube** o **CodeQL** escanean el código en busca de patrones problemáticos y generan reportes detallados con sugerencias de mejora. Además, algunas herramientas se integran con los repositorios de código para realizar análisis automáticos en cada commit o pull request.

### 2.4. Ejecución de pruebas automatizadas

Las pruebas automatizadas son un pilar clave en cualquier pipeline de CI/CD, ya que garantizan que los cambios en el código no introduzcan errores en el software. Este proceso abarca diferentes niveles de validación, incluyendo pruebas unitarias, pruebas de integración y pruebas end-to-end (E2E). Las pruebas unitarias verifican el correcto funcionamiento de módulos individuales del código, mientras que las pruebas de integración aseguran la comunicación entre componentes, y las pruebas E2E evalúan el comportamiento completo del sistema desde la perspectiva del usuario. Herramientas como **Jest** para JavaScript y **React Testing Library** para pruebas de frontend permiten ejecutar automáticamente estas validaciones en cada nueva modificación del código.

### 2.5. Escaneo de Seguridad y Dependencias

El análisis de seguridad es un componente fundamental en cualquier pipeline de CI/CD, ya que permite detectar vulnerabilidades tanto en el código fuente como en las dependencias del proyecto. Nuestra aplicación depende de muchas bibliotecas de terceros (en este caso, npm), y cualquier vulnerabilidad en estas puede representar un riesgo para la seguridad del sistema. Herramientas como **Dependabot**, **Snyk** y **Trivy** analizan las dependencias en busca de versiones obsoletas o con fallos de seguridad conocidos, mientras que otras herramientas de análisis estático como **SonarQube** también pueden detectar ciertas vulnerabilidades.

### 2.6. Despliegue Automatizado (CD)

El despliegue automatizado es la fase en la que el software es entregado en entornos de prueba, *staging* o producción de forma controlada y sin intervención manual. Herramientas como **GitHub Actions** y **GitLab CI/CD** permiten gestionar el despliegue de manera automatizada, asegurando que cada nueva versión del software se distribuya de forma confiable y reproducible.

### 2.7. Monitoreo y Observabilidad

Una vez que el software ha sido desplegado, es fundamental contar con herramientas de monitoreo y observabilidad para detectar problemas de rendimiento, errores inesperados y métricas clave sobre el comportamiento del sistema. Este proceso implica la recopilación y análisis de *logs*, métricas y trazas de ejecución para obtener una visión completa de la salud de la aplicación. Herramientas como **Prometheus** y **Grafana** permiten monitorear métricas en tiempo real, mientras que soluciones como **New Relic** y **ELK Stack** (Elasticsearch, Logstash, Kibana) facilitan la visualización y análisis de registros.

# 3. Conclusiones

Para la implementación del pipeline de CI/CD, hemos seleccionado herramientas con las que estamos familiarizados, ya que en un desarrollo tan grande y dinámico es importante priorizar la facilidad de desarrollo, a la vez que se ofrece solución a nuestras necesidades.

Para la validación de mensajes de commit, utilizaremos **GitHub Actions** con un prehook, asegurando que los commits cumplan con un formato predefinido antes de ser registrados en el repositorio. Aunque existen alternativas como Husky, optar por GitHub Actions evita dependencias adicionales en el entorno local de los desarrolladores y centraliza la validación en el flujo CI/CD.

En cuanto al análisis estático y la detección de vulnerabilidades, utilizaremos **SonarCloud**, que ofrece una integración nativa con GitHub, reportes detallados y análisis *out of the box* de un amplio conjunto de métricas acerca del proyecto, superando herramientas como **CodeClimate** en términos de profundidad de análisis y facilidad de configuración.

Para el formato del código, **ESLint** ha sido elegido por su flexibilidad y amplia adopción en la comunidad de JavaScript y React, proporcionando reglas configurables y mayor personalización que herramientas más simples como Prettier, que se centra únicamente en el formato sin validar buenas prácticas.

Las pruebas automatizadas se ejecutarán con **GitHub Actions**, utilizando **Jest** y **React Testing Library** para validar el correcto funcionamiento del código, ya que estas herramientas están diseñadas específicamente para entornos JavaScript y React, superando alternativas como Mocha o Enzyme en términos de compatibilidad y facilidad de uso.

Para la gestión de dependencias, **Dependabot** será responsable de detectar y actualizar automáticamente librerías vulnerables o desactualizadas, evitando riesgos de seguridad y asegurando que el proyecto utilice versiones seguras y estables sin necesidad de intervención manual.

Finalmente, el despliegue se realizará mediante un **script personalizado ejecutado desde un workflow de GitHub Actions**, lo que permite adaptar el proceso a los requisitos específicos del proyecto y de la Raspberry Pi donde será alojado. Aunque existen soluciones más avanzadas como ArgoCD o Ansible, un script directo proporciona mayor control y simplicidad para un entorno autogestionado, evitando configuraciones innecesarias para un despliegue de menor escala.

Para la monitorización del rendimiento de la aplicación, hemos optado por scripts personalizados en **TypeScript**, lo que permite un control con una granularidad muy fina y asegura que la solución se adapte a nuestras necesidades particulares, eliminando complejidad y dependencias innecesarias.

Esta combinación de herramientas nos permite construir un pipeline eficiente, seguro y bien integrado con el ecosistema de GitHub, optimizando el desarrollo y la entrega del software.
