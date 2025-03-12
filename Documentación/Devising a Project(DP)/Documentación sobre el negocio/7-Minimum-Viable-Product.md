<p align="center">
  <img src="https://www.ucm.es/al-acmes/file/logo-universidad-sevilla/?ver" alt="Logo Universidad Sevilla" width="200" height="200">
  <img src="https://i.imgur.com/vlzkG4H.png" alt="Imagen Imgur" width="auto" height="200">
</p>

<h1 align="center">Minimum Viable Product</h1>

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
    Alfonso Alonso, Alejandro Aragón, José María Baquero, Pablo Caballero, Ricardo Carreño, Franco Dell Águila, Alberto Escobar, Jaime Gómez, Claudio González, Ángel Neria, Pablo Olivencia, Antonio Porcar, Alba Ramos, Pedro Pablo Santos, Manuel Vélez, Gonzalo García.
</p>

<p align="center">
    04/02/2025
</p>


### CONTROL DE VERSIONES

| VERSIÓN | FECHA      | COMENTARIOS                                     | AUTOR                                            |
| ------- | ---------- | ----------------------------------------------- | ------------------------------------------------ |
| v1.0    | 04/02/2025 | Primera versión                                 | Manuel Vélez, Pedro Pablo Santos                 |
| v1.1    | 04/02/2025 | Cambios menores                                 | Manuel Vélez, Ángel Neria                        |
| v1.2    | 04/02/2025 | Revisión del formato                            | Ricardo Carreño                                  |
| v1.2.1  | 05/02/2025 | Revisión del formato                            | Ricardo Carreño                                  |
| v1.3.1  | 01/02/2025 | Cambio en MVP y Casos de uso esenciales         | Ángel Neria                                      |
| v1.3.1  | 01/02/2025 | Casos de uso para cada tipo de público objetivo | Antonio Porcar, Alejandro Aragón                 |
| v1.4.0  | 07/02/2025 | Cambios en los casos de uso core                | Ángel Neria Acal                                 |
| v1.5.0  | 09/02/2025 | Revisión del documento                          | Antonio Porcar, Pablo Olivencia, Ricardo Carreño |

---

## Índice

- [1. Introducción](#1-introducción)
- [2. Público Objetivo](#2-público-objetivo)
- [3. Casos de uso core](#3-casos-de-uso-core)
- [4. Funcionalidades del MVP](#4-funcionalidades-del-mvp)
- [5. Roles de cliente](#5-roles-de-cliente)
  - [5.1. Consideraciones Comunes](#51-consideraciones-comunes)
- [6. Valor e innovación del proyecto](#6-valor-e-innovación-del-proyecto)
  - [6.1. Tipo de proyecto](#61-tipo-de-proyecto)
  - [6.2. Innovación del servicio](#62-innovación-del-servicio)
  - [6.3. Innovación del modelo de negocio](#63-innovación-del-modelo-de-negocio)
  - [6.4. Innovación tecnológica](#64-innovación-tecnológica)



# 1. Introducción

MapYourWorld es una aplicación web y móvil que permite a los usuarios
completar de forma interactiva un mapa virtual del mundo visitando
localizaciones en la vida real. El objetivo principal es ofrecer una
forma visual y socialmente atractiva de registrar y compartir tus
experiencias de viaje, con una serie de funcionalidades clave en su
versión gratuita y funcionalidades extra en su versión de pago.

MapYourWorld aporta una forma interactiva y visualmente atractiva para
compartir y documentar el progreso de tus recorridos a lo largo de todo
el planeta. La aplicación no sólo permite a los usuarios ver las
localizaciones que ha visitado, sino que también motiva a explorar
nuevos destinos a través de una interfaz interactiva y social.

# 2. Público Objetivo

El público objetivo para una aplicación de exploración y descubrimiento
del mundo está compuesto por personas curiosas, aventureras y
apasionadas por conocer nuevos lugares. Este segmento incluye tanto a
viajeros frecuentes que buscan plasmar sus recorridos como a
exploradores urbanos que disfrutan descubriendo los rincones ocultos de
su propia ciudad. Lo que los une es el deseo constante de ampliar sus
horizontes y convertir cada paso en una nueva experiencia.

Este público abarca a personas que documentan sus viajes, comparten sus
hallazgos en redes sociales y valoran las herramientas interactivas que
les permiten visualizar sus travesías. También incluye a quienes
encuentran placer en redescubrir sus barrios, parques y senderos,
transformando la rutina diaria en una aventura constante.

En conjunto, este diverso público comparte un espíritu común: la
fascinación por el descubrimiento y la necesidad de dejar huella ya sea
recorriendo continentes lejanos o simplemente dando una vuelta por la
esquina.

# 3. Casos de uso core
| **Visualización de un mapa personal interactivo** |  |
|:-------------------------------------------------:|:-----------------------------------:|
| **Actor Principal** | Viajero |
| **Objetivo** | Permitir a los usuarios consultar sus localizaciones visitadas y puntos de interés a través de un mapa interactivo del mundo. |
| **Precondiciones** | \- |
| **Flujo del caso de uso** | 1. El usuario tendrá una visión general del mapa del mundo, en la que se encontrarán marcadas con un color diferente aquellas localizaciones visitadas y con marcadores los puntos de interés. Esta será la pantalla principal. <br> 2. El usuario puede desplazarse por el mapa utilizando gestos. <br> 3. El usuario podrá tocar una zona y se mostrará una ventana emergente con los detalles de los puntos de interés de ese lugar. |

---

| **Exploración de zonas no descubiertas** |  |
|:----------------------------------------:|:-----------------------------------:|
| **Actor Principal** | Viajero |
| **Objetivo** | Facilitar la detección y registro de nuevas zonas del mapa aún no descubiertas. |
| **Precondiciones** | \- El dispositivo debe contar con la geolocalización activada para identificar sitios cercanos. <br> \- La aplicación debe estar iniciada. |
| **Flujo del caso de uso** | 1. El cliente se desplaza físicamente hacia la zona que quiere descubrir. <br> 2. Una vez situado físicamente dentro de la zona a descubrir, se desbloquea la localización en el mapa personal. |

---

| **Registro de puntos de interés** |  |
|:---------------------------------:|:-----------------------------------:|
| **Actor Principal** | Viajero |
| **Objetivo** | Permitir a los usuarios registrar sus localizaciones de interés mediante marcadores en el mapa interactivo. |
| **Precondiciones** | \- El usuario debe haber descubierto la zona previamente. |
| **Flujo del caso de uso** | 1. El usuario selecciona la zona del mapa en la que quiere añadir un punto de interés. <br> 2. El usuario podrá tocar una zona y se mostrará una ventana emergente con los detalles de los puntos de interés de ese lugar y una opción para añadir un nuevo punto de interés. <br> 3. Al seleccionar la opción de crear un nuevo punto de interés, la aplicación solicita mediante un formulario datos para añadir un marcador, siendo solicitados la ubicación y opcionalmente una descripción, una etiqueta y fotografías. <br> 4. En este punto aparecerá en el mapa interactivo el punto de interés registrado con un marcador. |

---

| **Creación de Mapas Colaborativos** |  |
|:-----------------------------------:|:-----------------------------------:|
| **Actor Principal** | Viajero |
| **Objetivo** | Permitir a los usuarios crear mapas colaborativos, en los que varios jugadores pueden compartir su progreso mutuo dentro de un mismo mapa. |
| **Precondiciones** | \- Si se trata de un usuario con plan gratuito, este no puede pertenecer a otro mapa colaborativo. <br> \- Un mapa colaborativo debe estar formado entre 2 y 5 personas. |
| **Flujo del caso de uso** | 1. El cliente selecciona "Crear Mapa Colaborativo" en el menú de funciones. <br> 2. Define los detalles iniciales del mapa: nombre, descripción y usuarios invitados. <br> 3. Los usuarios invitados se unen al mapa colaborativo aceptando la invitación dentro del menú de funciones. <br> 4. El mapa se actualiza en tiempo real conforme los colaboradores visitan zonas o añaden puntos de interés. |


# 4. Funcionalidades del MVP

-   **Registro de usuario:** Permite a los usuarios crear una cuenta
    para guardar su progreso y personalizar su experiencia.

-   **Inicio de sesión:** Proporciona acceso seguro a las cuentas
    existentes, asegurando la continuidad de la exploración.

-   **Funcionalidades core:** Incluye el seguimiento GPS, visualización
    del mapa con áreas exploradas y gamificación de la experiencia.

-   **Sistema de logros y estadísticas:** Motiva a los usuarios mediante
    recompensas virtuales al cumplimentar desafíos.

-   **Módulo social:** Permite a los usuarios establecer un sistema de
    amistad con otros usuarios.

-   **Pago de suscripciones:** Se ofrece la posibilidad de mejorar la
    experiencia de usuario mediante el pago de una suscripción premium
    mensual.

# 5. Roles de cliente

En la aplicación se diferencian dos roles principales, clientes
gratuitos o clientes premium, que determinan el acceso y el uso de las
funcionalidades disponibles para cada rol:

El cliente gratuito es aquel individuo que se ha registrado en la
plataforma y no paga ningún tipo de suscripción. Este rol otorga acceso
a la experiencia básica de MapYourWorld, permitiendo explorar y utilizar
las funcionalidades fundamentales de la aplicación, **este rol conlleva
la visualización de anuncios**.

**Funcionalidades Comunes:**

-   **Visualización de un mapa personal interactivo.**

-   **Exploración de zonas no descubiertas.**

-   **Registro de puntos de interés:** Para clientes gratuitos esta
    funcionalidad limitará su uso a la creación de un punto de interés
    por zona.

-   **Unión a mapas colaborativos:** Para clientes gratuitos esta
    funcionalidad limitará su uso a la unión a un mapa colaborativo por
    cliente.

-   **Envío de solicitud de amistad.**

-   **Aceptación/denegación de solicitud de amistad.**

-   **Cumplimiento de logros.**

Respecto al cliente de pago, aquel que ha pagado por una suscripción
en la aplicación, accede a funcionalidades adicionales y exclusivas que
enriquecen y amplían la experiencia de uso en la plataforma, además de
tener las funcionalidades del cliente gratuito, **este rol conlleva la
eliminación de anuncios**.

**Funcionalidades Premium:**

-   **Creación de logros.**

-   **Creación de mapas colaborativos.**

-   **Visualización de estadísticas sobre el avance en la aplicación.**

-   **Comparación de estadísticas con otros usuarios.**



## 5.1. Consideraciones Comunes

-   **Actualización de Rol:**

Los usuarios registrados tienen la opción de pasar a la versión Premium
en cualquier momento mediante el proceso de suscripción, lo que
actualizará su rol y desbloqueará las funcionalidades exclusivas sin
necesidad de volver a registrarse o perder el historial de actividades.

-   **Seguridad y Privacidad:**

Tanto el Usuario como el Cliente cuentan con mecanismos de seguridad
robustos, que incluyen autenticación segura y la protección de datos
personales, garantizando una experiencia confiable y segura en la
plataforma.

Esta diferenciación de roles permite que MapYourWorld ofrezca una
experiencia atractiva a un amplio público, facilitando el acceso a
funcionalidades básicas para todos y, al mismo tiempo, generando un
canal de monetización a través de la suscripción premium.

# 6. Valor e innovación del proyecto

## 6.1. Tipo de proyecto

MapYourWorld se podría clasificar como un *Service Project*, ya que la
aplicación no es una herramienta, sino un servicio digital estructurado
que sirve como complemento a una experiencia turística, permitiendo
registrar y visualizar sus experiencias en un mapa interactivo.

Sin embargo, podemos encontrar elementos de emparejamiento, ya que
existen funciones sociales básicas, como la utilidad de solicitudes de
amistad a otros usuarios. A pesar de ello, su valor radica en ofrecer un
servicio de visualización y gamificación, no en la intermediación entre
usuarios.

## 6.2. Innovación del servicio

**Moderada**. Con esta aplicación se produce una gamificación del
turismo, introduciendo insignias y desafíos basados en viajes, esta idea
no es completamente nueva, ya que otras aplicaciones emplean estrategias
similares.

> 

## 6.3. Innovación del modelo de negocio

**Baja**. El modelo *Freemium* consiste en ofrecer un servicio básico
gratuito, aumentando la funcionalidad base mediante el pago de una
suscripción a la plataforma. Este modelo es ampliamente utilizado y con
un enfoque que se ha usado durante años.

## 6.4. Innovación tecnológica

**Moderada-Alta**. Aunque MapYourWorld no es disruptiva en cuanto a
tecnología per se, existe cierto grado avanzado de innovación
tecnológica debido a la forma en la que se combinan tecnologías como la
geolocalización y estrategias como la gamificación para crear una
experiencia de usuario nueva con un componente social.