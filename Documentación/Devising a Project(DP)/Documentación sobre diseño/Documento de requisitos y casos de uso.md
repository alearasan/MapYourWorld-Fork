<p align="center">
  <img src="https://www.ucm.es/al-acmes/file/logo-universidad-sevilla/?ver" alt="Logo Universidad Sevilla" width="200" height="200">
  <img src="https://i.imgur.com/vlzkG4H.png" alt="Imagen Imgur" width="auto" height="200">
</p>

<h1 align="center">Documento de requistos y casos de uso</h1>

<p align="center">
    Grupo 7
</p>
<p align="center">
    ISPP-MapYourWorld
</p>
<p align="center">
    Sprint 1
</p>
<p align="center">
    Alfonso Luis Alonso Lanzarán
</p>
<p align="center">
    12/03/2025
</p>

---

# Documento de Especificación de Requisitos de Software (ERS)

## 1. Introducción

### 1.1 Propósito del documento

El propósito de este documento es detallar de forma clara y estructurada los requisitos del sistemam, estos se redactarán en forma de historia de usuario y abarcarán tanto las funciones mínimas del producto mínimo viable como las adicionales del resto de módulos

### 1.2 Alcance del sistema

El sistema debe permitir a los usuarios desbloquear zonas de un mapa inicialmente no descubierto, interactuar con puntos de interés creándolos y subiendo fotos a aquellos que ya existan. Además debe permitir que los usuarios premium inviten a sus amigos a mapas colaborativos en el que se puede ver el progreso de los participantes en el mapa así como los puntos de interés creados por todos los participantes.

# Requisitos del Sistema

A continuación se agrupan los requisitos en diferentes categorías: funcionales, no funcionales y de información. Cada requisito se expresa en forma de historia de usuario para resaltar el valor que aporta al usuario o al sistema.

---

## 1. Requisitos Funcionales

### Gestión de Usuarios

- **Registro de usuario**  
  *Como usuario no registrado, quiero crear una cuenta con mi nombre de usuario, correo electrónico y contraseña, para poder acceder a las funcionalidades de la aplicación.*
- **Perfil de usuario**  
  *Como usuario registrado, quiero contar con un perfil personal (con foto opcional), para mostrar mi información y acceder a mis datos de manera individual.*
- **Unicidad de credenciales**  
  *Como sistema, necesito asegurar que no haya dos usuarios con el mismo correo electrónico o nombre de usuario, para evitar conflictos e inconsistencias.*
- **Inicio de sesión**  
  *Como usuario registrado, quiero iniciar sesión con mis credenciales, para acceder a mis mapas y configuración personal.*

### Gestión de Planes

- **Suscripción a planes**  
  *Como usuario, quiero suscribirme a un plan (gratuito o premium), para disfrutar de diferentes niveles de funcionalidad según mi elección.*
- **Limitaciones del plan gratuito**  
  *Como administrador del sistema, quiero que los usuarios gratuitos puedan crear únicamente un mapa personal, para respetar las restricciones de su suscripción.*
- **Creación de mapas grupales (Premium)**  
  *Como usuario con plan Premium, quiero crear mapas colaborativos, para descubrir el mundo con mis amigos.*
- **Fechas de suscripción**  
  *Como administrador del sistema, necesito registrar las fechas de inicio y fin de suscripción de cada usuario, para gestionar el acceso a las funcionalidades correspondientes.*
- **Aviso de expiración de suscripción**  
  *Como administrador del sistema, necesito que se recuerde a los usuarios cuándo su suscripción va a terminar, ofreciéndole renovarla para mantener a los ususarios premium*

### Gestión de Mapas

- **Creación de mapas**  
  *Como usuario, quiero crear un mapa personal que pueda descubrir.*
- **Unirse a mapas colaborativos**  
  *Como usuario Premium, quiero crear mapas colaborativos, para interactuar con otros usuarios en la exploración de nuevas áreas.*
- **Invitar amigos a mapas colaborativos**  
  *Como usuario Premium, nvitar a amigos a mapas colaborativos aunque no sean usuarios premium*

### Gestión de Zonas Geográficas (Regiones y Distritos)

- **Almacenar información de regiones**  
  *Como administrador, quiero registrar y mantener la información de cada región (nombre, descripción), para que los usuarios puedan identificar y explorar diferentes zonas.*
- **Almacenar información de distritos**  
  *Como administrador de contenido, quiero registrar y mantener información detallada de los distritos (nombre, descripción, límites, está desbloqueado), para proporcionar un nivel de detalle mayor dentro de cada región.*
- **Jerarquía geográfica**  
  *Como usuario, quiero ver cómo se relacionan los distritos con las regiones, para comprender la estructura geográfica y navegar fácilmente entre ellas.*

### Gestión de Puntos de Interés (POI)

- **Registrar POI**  
  *Como usuario, quiero registrar puntos de interés con nombre, categoría y ubicación, para compartir lugares relevantes o interesantes dentro de una región.*
- **Añadir fotos a POI**  
  *Como usuario, quiero añadir fotos a los pùntos de interés que descubra.*
- **Filtrado de POI**  
  *Como usuario, quiero buscar y filtrar puntos de interés por categoría o ubicación, para encontrar rápidamente lugares específicos (por ejemplo, Monumentos, Estadios, Mercados, etc.).*
- **Asociación con región/distrito**  
  *Como usuario, quiero que cada punto de interés aparezca en la región o distrito correspondiente, para ubicarlo en su contexto geográfico.*

### Gestión de Logros y Estadísticas

- **Creación y asignación de logros**  
  *Como administrador de contenido, quiero definir logros (por ejemplo, “Descubrir 10 POI”), para incentivar a los usuarios a explorar más.*
- **Estadísticas de usuario**  
  *Como usuario, quiero ver mi progreso y estadísticas (POI descubiertos, logros obtenidos), para motivarme y comparar mi avance con otros usuarios.*
- **Actualización automática de estadísticas**  
  *Como sistema, necesito actualizar las estadísticas de cada usuario cuando descubra un nuevo POI o complete un logro, para reflejar en tiempo real su progreso.*

---

## 2. Requisitos No Funcionales

- **Rendimiento**  
  *Como usuario, quiero que el sistema cargue la información de mapas y POI en menos de 3 segundos, para tener una experiencia fluida y sin interrupciones.*
- **Seguridad**  
  *Como usuario, quiero que mi contraseña esté cifrada y que las operaciones críticas se protejan mediante autenticación y autorización, para mantener mis datos seguros.*
- **Usabilidad**  
  *Como usuario, deseo que la interfaz sea intuitiva y clara, para poder navegar fácilmente por regiones, distritos y POI sin requerir conocimientos técnicos.*
- **Confiabilidad y Disponibilidad**  
  *Como usuario, quiero que el sistema esté disponible al menos el 99% del tiempo y que se realicen copias de seguridad periódicas, para no perder mi progreso y acceder al servicio cuando lo necesite.*
- **Mantenibilidad**  
  *Como desarrollador, necesito que el código esté bien documentado y que se implementen despliegues controlados, para facilitar la corrección de errores y la actualización del sistema sin afectar a los usuarios.*
- **Portabilidad**  
  *Como usuario, quiero que la aplicación funcione en navegadores web y en dispositivos móviles (Android), para poder acceder desde cualquier plataforma.*

---

## 3. Requisitos de Información

Estos requisitos están enfocados en la correcta definición y gestión de los datos que utiliza el sistema:

### Información de Usuarios

- **Datos Personales**  
  *El sistema debe almacenar y gestionar información básica de cada usuario, como nombre de usuario, correo electrónico, contraseña cifrada y, opcionalmente, una imagen de perfil.*

### Información de Planes

- **Planes y Suscripciones**  
  *El sistema debe gestionar información sobre los planes disponibles (FREE_PLAN y PREMIUM_PLAN), incluyendo limitaciones, fechas de inicio y fin de la suscripción, y restricciones asociadas (por ejemplo, número de mapas personales permitidos).*

### Información de Mapas

- **Detalles del Mapa**  
  *Cada mapa creado debe incluir datos como nombre, descripción, fecha de creación y estar compuesto de regiones.*

- **Regiones*  
  *El sistema debe almacenar información estructurada sobre regione, incluyendo nombres, descripción. Además, cada región debe estar formada por distritos.*
- **Distritos**  
  *El sistema debe almacenar información estructurada sobre distritos, incluyendo nombre, descripción, límites geográficos y si está desbloqueado o no. Además, se debe mantener la relación jerárquica entre regiones y sus distritos.*

### Información de Puntos de Interés (POI)

- **Datos de POI**  
  *Cada punto de interés debe incluir nombre, descripción, categoría y ubicación geográfica (geometría), imágenes y fecha de creación. Además, se debe relacionar con la región o distrito correspondiente para situarlo en el contexto adecuado.*

### Información de Logros y Estadísticas

- **Logros y Progreso del Usuario**  
  *El sistema debe registrar logros alcanzados y estadísticas relevantes de cada usuario, como el número de POI descubiertos, para ofrecer retroalimentación sobre el progreso y motivar la exploración.*

---

## 4. Casos de uso

### 4.1 Descripción detallada de casos de uso

### Gestión de usuarios

- **Registro de usuario**  
  *El usuario que entra por primera vez a MapYourWorld, toca el botón Crear una cuenta, el sistema le muestra un formulario que debe cumplimentar con un correo un nombre de usuario y una contraseña.*

- **Inicio de sesión**  
  *El usuario registrado en MapYourWorld entra en la aplicación y el sistema le muestra un formulario de inicio de sesión, el usuario registrado introduce sus credenciales(nombre de usuario o correo electrónico y contraseña), aprieta el botón iniciar sesión,si sus credenciales son correctas se inicia la sesión del usuario, si no el sistema vuelve a mostrar el formulario señalando los errores en las credenciales.*

- **Consultar mi perfil**

- **Editar mi perfil**

- **Eliminar mi perfil**

### Gestión de amigos

- **Añadir amigos**  
  *El usuario que ha iniciado sesión accede a una opción del menú lateral llamada "Amigos", en dicha sección se le muestra un botón "Añadir amigos", tras apretarlo el sistema muestra una barra de búsqueda en la que el usuario introduce un nombre de usuario, si el nombre de usuario existe, el sistema muestra el nombre del usuario buscado y su foto de perfil y una opción para enviarle una solicitud de amistad. Si el usuario que ha iniciado sesión aprieta el botón "Enviar solicitud" el sistema le envía una solicitud de amistad que debe ser aceptada o rechazada, si el nombre de usuario no existe el sistema mostrará la barra de búsqueda indicando que el nombre de usuario no existe*

- **Eliminar amigos**
  *El usuario que ha iniciado sesión accede a una opción del menú lateral llamada "Amigos", en dicha sección se le muestra una lista de sus amistades y un botón al lado para eliminar amigos, si el usuario que ha iniciado sesión aprieta el botón "Eliminar amigo", el sistema le muestra una ventana de confirmación con dos botones "Cancelar" y "Eliminar" si el usuario que ha iniciado sesión aprieta el botón "Cancelar", se cierra la ventana de confirmación, si aprieta "Eliminar" se elimina la amistad*

### Gestión de Planes

- **Suscribirse a un plan**

- **Renovar suscripción**

- **Cancelar suscripción(por el usuario)**

- **Cancelar suscripción(por el sistema)**

### Descubrir Mapas

- **Consultar el mapa**

- **Descubrir distritos nuevos el mapa**

### Mapas colaborativos

- **Crear mapa colabortivo**

- **Invitar amigo a mapa colaborativo**

- **Consultar progreso de amigos**

### Puntos de Interés

- **Ver POI**

- **Crear POI en mapa personal/colaborativo**

- **Añadir foto a POI**

### Información de Logros y Estadísticas

- **Consultar estadísticas(usuario)**
  
- **Crear estadística(admin)**

- **Crear logro(admin)**

- **Consultar logros(usuario)**

- **Conseguir logro**
