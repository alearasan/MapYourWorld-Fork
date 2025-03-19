<p align="center">
  <img src="https://www.ucm.es/al-acmes/file/logo-universidad-sevilla/?ver" alt="Logo Universidad Sevilla" width="200" height="200">
  <img src="https://i.imgur.com/vlzkG4H.png" alt="Imagen Imgur" width="auto" height="200">
</p>

<h1 align="center">Análisis de Riesgos</h1>

<p align="center">
    Grupo 7
</p>
<p align="center">
    ISPP-MapYourWorld
</p>
<p align="center">
    Devising a project
</p>
<p align="center">
    Alejandro Aragón, Claudio González,  Gonzalo García.
</p>
<p align="center">
    15/02/2025
</p>

**CONTROL DE VERSIONES**

| VERSIÓN | FECHA      | COMENTARIOS        | AUTOR                |
|---------|------------|--------------------|----------------------|
| V1.0    | 15/02/2025 | Creación inicial   | Gonzalo García, Claudio González     |
| V1.1    | 03/03/2025 | Riesgos Semana 5   | Alejandro Aragón     |

<!-- omit in toc--> # Índice

- [1. Riesgos Técnicos](#1-riesgos-técnicos)
  - [1.1. Riesgo 1: Escalabilidad y Rendimiento](#11-riesgo-1-escalabilidad-y-rendimiento)
  - [1.2. Riesgo 2: Integración de Microservicios y Mensajería](#12-riesgo-2-integración-de-microservicios-y-mensajería)
  - [1.3. Riesgo 3: Integridad y Seguridad de Datos Geoespaciales](#13-riesgo-3-integridad-y-seguridad-de-datos-geoespaciales)
- [2. Riesgos de Seguridad y Cumplimiento Normativo](#2-riesgos-de-seguridad-y-cumplimiento-normativo)
  - [2.1. Riesgo 4: Brechas de Seguridad y Ciberataques](#21-riesgo-4-brechas-de-seguridad-y-ciberataques)
  - [2.2. Riesgo 5: Cumplimiento Legal en Diversas Regiones](#22-riesgo-5-cumplimiento-legal-en-diversas-regiones)
- [3. Riesgos de Producto y Mercado](#3-riesgos-de-producto-y-mercado)
  - [3.1. Riesgo 6: Falta de Interés del Mercado](#31-riesgo-6-falta-de-interés-del-mercado)
  - [3.2. Riesgo 7: Incapacidad de Monetizar](#32-riesgo-7-incapacidad-de-monetizar)
  - [3.3. Riesgo 8: Cambios Regulatorios en Turismo y Geolocalización](#33-riesgo-8-cambios-regulatorios-en-turismo-y-geolocalización)
- [4. Riesgos Organizacionales y de Equipo](#4-riesgos-organizacionales-y-de-equipo)
  - [4.1. Riesgo 9: Pérdida de Conocimientos Críticos](#41-riesgo-9-pérdida-de-conocimientos-críticos)
  - [4.2. Riesgo 10: Descoordinación Interna](#42-riesgo-10-descoordinación-interna)
- [5. Riesgos de Calidad y Testeo](#5-riesgos-de-calidad-y-testeo)
  - [5.1. Riesgo 11: Baja Cobertura de Pruebas](#51-riesgo-11-baja-cobertura-de-pruebas)
  - [5.2. Riesgo 12: Compatibilidad Multiplataforma](#52-riesgo-12-compatibilidad-multiplataforma)
- [6. Riesgos de Marketing y Relaciones Públicas](#6-riesgos-de-marketing-y-relaciones-públicas)
  - [6.1. Riesgo 13: Mala Gestión de Redes Sociales](#61-riesgo-13-mala-gestión-de-redes-sociales)
  - [6.2. Riesgo 14: Percepción Pública Negativa (Geolocalización)](#62-riesgo-14-percepción-pública-negativa-geolocalización)
- [7. Planificar la Respuesta a los Riesgos de forma General](#7-planificar-la-respuesta-a-los-riesgos-de-forma-general)
- [8. Implementar la Respuesta a los Riesgos](#8-implementar-la-respuesta-a-los-riesgos)
- [9. Controlar los Riesgos](#9-controlar-los-riesgos)
  - [9.1. Actualización -- Semana 5](#91-actualización----semana-5)
    - [9.1.1. Riesgo 17: Problemas en los Despliegues](#911-riesgo-17-problemas-en-los-despliegues)
    - [9.1.2. Riesgo 18: Desnivel de Conocimiento Tecnológico en el Equipo](#912-riesgo-18-desnivel-de-conocimiento-tecnológico-en-el-equipo)
    - [9.1.3. Riesgo 19: Falta de Definición Temprana de la Arquitectura](#913-riesgo-19-falta-de-definición-temprana-de-la-arquitectura)
    - [9.1.4. Riesgo 20: Uso de Librerías Obsoletas con Vulnerabilidades de Seguridad](#914-riesgo-20-uso-de-librerías-obsoletas-con-vulnerabilidades-de-seguridad)


# 1. Riesgos Técnicos

## 1.1. Riesgo 1: Escalabilidad y Rendimiento

La aplicación puede saturarse si el número de usuarios aumenta repentinamente, superando la capacidad de la infraestructura inicial. La falta de un plan de escalabilidad y recursos insuficientes pueden generar cuellos de botella que afecten la experiencia del usuario.

*Consecuencias:*

- Caídas del servicio.

- Deterioro de la reputación.

- Reducción de la base de usuarios.

*Respuesta:*

- Monitorear continuamente el rendimiento del sistema (CPU, RAM).

- Diseñar un plan de migración hacia servicios en la nube (AWS, Azure).

- Implementar herramientas de caché y balanceadores de carga conforme la demanda lo requiera.

## 1.2. Riesgo 2: Integración de Microservicios y Mensajería

La adopción de Apache Kafka para la comunicación entre microservicios puede añadir complejidad si el equipo carece de la experiencia necesaria. Esto puede derivar en configuraciones inadecuadas, bloqueos en las colas o incluso pérdida de datos.

*Consecuencias:*

- Retrasos en el procesamiento de eventos.

- Inconsistencias en la información.

*Respuesta:*

- Capacitar al equipo en Apache Kafka.

- Realizar pruebas de estrés periódicas.

- Diseñar microservicios con mecanismos de reintentos y tolerancia a fallos.

## 1.3. Riesgo 3: Integridad y Seguridad de Datos Geoespaciales

La gestión de información geolocalizada con PostgreSQL y PostGIS requiere un mantenimiento meticuloso de los índices espaciales y de migraciones precisas. Errores mínimos pueden provocar corrupción de datos o bloqueos en la base de datos.

*Consecuencias:*

- Pérdida de datos geoespaciales.

- Interrupciones en el servicio.

- Inconsistencias en la aplicación.

*Respuesta:*

- Programar copias de seguridad automáticos.

- Realizar auditorías periódicas del sistema.

- Validar las migraciones mediante scripts previamente testeados antes de implementarlos en producción.

# 2. Riesgos de Seguridad y Cumplimiento Normativo

## 2.1. Riesgo 4: Brechas de Seguridad y Ciberataques

La posible exposición de datos de geolocalización o el acceso no autorizado a la información de los usuarios representa un riesgo crítico, tanto por el daño reputacional como por las posibles sanciones legales.

*Consecuencias:*

- Sanciones económicas (RGPD, CCPA).

- Demandas civiles.

- Deterioro de la imagen del proyecto.

*Consecuencias Legales y Económicas Adicionales:*

- Multas de hasta 20 millones de euros o el 4% de la facturación anual, según la normativa RGPD.

*Respuesta:*

- Realizar auditorías de seguridad (penetration tests).

- Cifrar datos en reposo y en tránsito.

- Implementar un sistema de detección de intrusiones (IDS).

## 2.2. Riesgo 5: Cumplimiento Legal en Diversas Regiones

El despliegue del proyecto en múltiples regiones implica cumplir con legislaciones diversas (por ejemplo, RGPD en Europa o CCPA en California). No adaptar la aplicación a estos marcos legales puede resultar en multas y bloqueos por no gestionar adecuadamente los requisitos legales de cada zona.

*Consecuencias:*

- Posible prohibición de la aplicación.

- Multas elevadas.

- Daño a la reputación.

*Consecuencias Legales y Económicas Adicionales:*

- Multas elevadas, pérdida de confianza y sanciones monetarias significativas.

*Respuesta:*

- Implementar un módulo de gestión de consentimientos.

- Mantener un contacto continuo con asesores legales.

- Actualizar la política de privacidad conforme a cada región.

# 3. Riesgos de Producto y Mercado

## 3.1. Riesgo 6: Falta de Interés del Mercado

Si el mercado objetivo no adopta la aplicación en la medida esperada, se corre el riesgo de no alcanzar la masa crítica necesaria, lo que puede generar pérdidas significativas debido a bajos niveles de descarga y uso.

*Consecuencias:*

- Ingresos insuficientes.

- Desaprovechamiento de la inversión.

- Posible cierre del proyecto.

*Respuesta:*

- Validar hipótesis mediante un MVP.

- Refuerzo de campañas publicitarias.

- Establecer alianzas estratégicas (ej: con influencers de viajes).

## 3.2. Riesgo 7: Incapacidad de Monetizar

El modelo de negocio Freemium puede fracasar si los usuarios no optan por planes premium o si la publicidad resulta demasiado invasiva, dificultando así la cobertura de los costos operativos.

*Consecuencias:*

- Dificultad para cubrir los costos operativos.

- Necesidad de recortar funciones.

*Consecuencias Económicas Adicionales:*

- Falta de liquidez y riesgo de cierre del proyecto.

*Respuesta:*

- Realizar experimentos A/B con diferentes estrategias de precios.

- Establecer acuerdos con empresas del sector turístico.

- Diversificar las fuentes de ingresos (licencias B2B, venta de datos anónimos).

## 3.3. Riesgo 8: Cambios Regulatorios en Turismo y Geolocalización

Las leyes relacionadas con la protección de espacios naturales y la gestión de datos geoespaciales pueden variar, lo que obligaría a realizar ajustes drásticos en la aplicación.

*Consecuencias:*

- Rediseño del producto.

- Eliminación de funciones.

- Potenciales sanciones.

*Respuesta:*

- Supervisar continuamente las directivas emergentes.

- Colaborar estrechamente con las autoridades turísticas para anticipar y adaptarse a los cambios.

# 4. Riesgos Organizacionales y de Equipo

## 4.1. Riesgo 9: Pérdida de Conocimientos Críticos

La salida de miembros con conocimientos especializados puede retrasar el proyecto e incrementar los costos de formación de nuevos integrantes, ocasionando una pérdida importante de recursos humanos.

*Consecuencias:*

- Retrasos en las entregas.

- Necesidad de formar sustitutos.

*Respuesta:*

- Documentar todos los procesos (Plan de Gestión del Conocimiento).

- Implantar políticas de retención.

- Fomentar la participación colaborativa.

## 4.2. Riesgo 10: Descoordinación Interna

Una comunicación deficiente dentro del equipo puede generar retrasos, superposición de tareas y confusión sobre prioridades. Ejemplos: falta de fluidez en Microsoft Teams, backlog desactualizado, etc.

*Consecuencias:*

- Ineficiencia en los sprints.

- Pérdida de calidad.

*Respuesta:*

- Mantener reuniones semanales.

- Utilizar recordatorios automáticos.

- Implementar herramientas Kanban para la planificación de tareas.

# 5. Riesgos de Calidad y Testeo

## 5.1. Riesgo 11: Baja Cobertura de Pruebas

La falta de pruebas unitarias, de integración o de sistema adecuadas puede provocar que el producto presente numerosos bugs en producción.

*Consecuencias:*

- Incremento de incidencias post-lanzamiento.

- Retrabajo.

- Deterioro de la reputación.

*Respuesta:*

- Establecer un umbral mínimo de cobertura (Definition of Done).

- Automatizar las pruebas mediante CI/CD.

- Realizar revisiones de QA en cada sprint.

## 5.2. Riesgo 12: Compatibilidad Multiplataforma

Diferentes versiones de Android, iOS o navegadores web pueden generar problemas de visualización o rendimiento en React Native.

*Consecuencias:*

- Experiencia de usuario deficiente.

- Calificaciones bajas en las tiendas de aplicaciones.

*Respuesta:*

- Utilizar servicios de testing en la nube.

- Priorizar los dispositivos y versiones más utilizados según estudios de mercado.

# 6. Riesgos de Marketing y Relaciones Públicas

## 6.1. Riesgo 13: Mala Gestión de Redes Sociales

Una comunicación ineficaz en redes sociales puede hacer que la aplicación no llegue a su público objetivo o se perciba como irrelevante, debido a publicaciones mal enfocadas o tardías, o la ausencia de un community manager.

*Consecuencias:*

- Bajo engagement.

- Dificultad para alcanzar la masa crítica de usuarios.

*Respuesta:*

- Elaborar un calendario editorial.

- Colaborar con microinfluencers.

- Medir y analizar los KPIs de las campañas.

## 6.2. Riesgo 14: Percepción Pública Negativa (Geolocalización)

Parte de la audiencia podría considerar que la aplicación invade su privacidad o que los datos de ubicación pueden ser mal utilizados, generando la percepción de que la app es intrusiva.

*Consecuencias:*

- Protestas en redes sociales.

- Boicots.

- Daño a la reputación.

*Respuesta:*

- Redactar una política de privacidad clara y transparente.

- Designar un portavoz que atienda y gestione las dudas de la comunidad.

# 7. Planificar la Respuesta a los Riesgos de forma General

Se definirán estrategias para mitigar, evitar, transferir o aceptar los riesgos identificados:

- **Competencia con IA avanzada:** Desarrollo de características diferenciadoras que, aunque nuestra competencia use inteligencia artificial nos podamos diferenciar de esta con funcionalidades originales

- **Ciberataques:** Implementación de cifrado de datos, auditorías de seguridad periódicas y concienciación en ciberseguridad para cumplirtodo lo establecido en la ley de protección de datos

- **Dependencia de usuarios:** Estrategia de marketing agresiva, incentivos para usar la aplicación, haciendo promociones fuertes basadas en estudios de nuestros clientes para tener más retención de usuarios

# 8. Implementar la Respuesta a los Riesgos

Se ejecutarán las estrategias definidas en la planificación, asegurando:

- Asignación de recursos para cada medida de mitigación según la prioridad establecida

- Seguimiento de la efectividad de las acciones tomadas cuando toque control de riesgos

- Ajustes según sea necesario basándose en datos y repetición de análisis de riesgos

# 9. Controlar los Riesgos

Para cada semana de trabajo en las 4 primeras semanas de clase, y luego en cada sprint que hagamos, se revisarán los riesgos establecidos, se reevaluarán si es necesario, se añadirán nuevos si se identifican y se verá si se está aplicando las respuestas al riesgo que se identificaron de la manera adecuada.

## 9.1. Actualización -- Semana 5

Durante la revisión de riesgos en el sprint actual, se han identificado los siguientes nuevos riesgos:

### 9.1.1. Riesgo 17: Problemas en los Despliegues

Existen dudas sobre la estrategia de despliegue simultáneo para el backend y frontend, considerando la necesidad de mantener disponibles todas las versiones hasta la finalización de la evaluación. Se evalúan tres opciones: mantener todos los despliegues activos, activar versiones previas bajo demanda o utilizar servidores diferenciados por rendimiento. Cada alternativa tiene implicaciones en consumo de recursos, disponibilidad y tiempos de activación.

*Consecuencias:*

- Indisponibilidad temporal de versiones previas si se activan bajo demanda.

- Alto consumo de recursos si se mantienen todas las versiones activas.

- Complejidad en la gestión de entornos si se usan servidores diferenciados.

*Respuesta:*

- Definir una estrategia óptima de despliegue según los recursos disponibles.

- Evaluar la escalabilidad y automatizar despliegues para minimizar tiempos de espera.

- Monitorear el uso de recursos y ajustar la estrategia según el rendimiento observado.

### 9.1.2. Riesgo 18: Desnivel de Conocimiento Tecnológico en el Equipo

Se ha identificado una brecha de conocimiento técnico entre los miembros del equipo, lo que ha generado dependencia de ciertos desarrolladores y ha ralentizado la integración de nuevas tecnologías. Esto podría afectar la eficiencia del desarrollo y aumentar los riesgos en la implementación de funcionalidades críticas.

Para abordar esta situación, el 02/02/2025 se llevó a cabo una reunión con el mayor conocedor de la tecnología utilizada en el proyecto (Gonzalo), en la cual se aclaró la estructura base y el funcionamiento interno del sistema. Como resultado, se elaboró un documento detallado sobre la arquitectura backend, abordando aspectos clave como la integración de microservicios, la comunicación asíncrona y las estrategias de resiliencia.

*Consecuencias:*

- Sobrecarga de trabajo para los miembros con mayor experiencia.

- Retrasos en la integración y desarrollo de nuevas funcionalidades.

- Dificultad en la resolución de problemas cuando los especialistas no están disponibles.

*Respuesta:*

- Creación de un documento técnico detallado que explica la arquitectura y las tecnologías utilizadas, proporcionando una base de consulta para el equipo.

- Fomentar la documentación de procesos y mejores prácticas para facilitar la consulta por parte de todos los miembros del equipo.

- Asignar tareas de distinta complejidad para permitir el aprendizaje gradual y distribuir mejor la carga de trabajo.

### 9.1.3. Riesgo 19: Falta de Definición Temprana de la Arquitectura

Se decidió adoptar la arquitectura MVC (Modelo-Vista-Controlador) como estándar para el desarrollo de los módulos del proyecto, ya que es el enfoque con el que el equipo tiene mayor experiencia.

*Consecuencias:*

- Diferencias en la estructura y organización del código entre módulos, dificultando la integración.

- Aumento en la complejidad del mantenimiento debido a implementaciones heterogéneas.

- Riesgo de que algunos módulos no sigan correctamente el patrón, generando acoplamiento innecesario.

*Respuesta:*

- Definir un estándar claro para la implementación de MVC en el proyecto, asegurando que todos los módulos sigan la misma estructura.

- Crear una guía de buenas prácticas para el desarrollo basado en MVC.

- Realizar revisiones de código periódicas para detectar y corregir inconsistencias en la implementación.

### 9.1.4. Riesgo 20: Uso de Librerías Obsoletas con Vulnerabilidades de Seguridad

Se ha identificado que algunas dependencias utilizadas en el proyecto pueden estar desactualizadas, lo que podría exponer el sistema a vulnerabilidades de seguridad conocidas. La falta de un proceso de control y análisis en la incorporación de nuevas librerías aumenta el riesgo de introducir componentes con fallos de seguridad o sin soporte activo.

*Consecuencias:*

- Exposición del sistema a vulnerabilidades conocidas, lo que podría ser explotado por atacantes.

- Pérdida de compatibilidad o fallos inesperados debido al uso de librerías sin soporte activo.

- Posibles incumplimientos de normativas de seguridad y protección de datos.

*Respuesta:*

- Establecer un plan de análisis de dependencias para evaluar cada nueva librería añadida al proyecto.

- Actualizar a versiones más recientes y seguras aquellas librerías que ya están en uso.

- Implementar herramientas automáticas de análisis de seguridad en dependencias (como npm audit o Dependabot).
