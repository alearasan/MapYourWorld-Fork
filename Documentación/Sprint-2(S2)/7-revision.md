<p align="center">
  <img src="https://www.ucm.es/al-acmes/file/logo-universidad-sevilla/?ver" alt="Logo Universidad Sevilla" width="200" height="200">
  <img src="https://i.imgur.com/vlzkG4H.png" alt="Imagen Imgur" width="auto" height="200">
</p>

<h1 align="center">Guia de Revisión</h1>

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
    Jaime Gómez Marín, Ángel Neria Acal, José María Baquero Rodríguez, Pablo Caballero María
</p>

<p align="center">
    12/03/2025
</p>

---
**CONTROL DE VERSIONES**

| VERSIÓN | FECHA     | COMENTARIOS              | AUTOR              |
|---------|-----------|--------------------------|--------------------|
| V1      | 12/03/2025| Primera versión          | Jaime Gómez Marín, Ángel Neria Acal y José María Baquero Rodríguez     |
| V2      | 13/03/2025| Actualización del documento| Ángel Neria Acal y José María Baquero Rodríguez     |
| V3      | 13/03/2025| Actualización del documento| Pablo Caballero María     |
| V3      | 27/03/2025| Segunda versión| José María Baquero Rodríguez y Ángel Neria Acal     |

---
## 1. Mapeo Explícito de Casos de Uso (UC) a Interacciones


### 1.1. No Matchmaking


- **(Mejora) Bienvenida**:  
  El usuario tiene la opcion de iniciar sesión con una cuenta existente o registrarse en el sistema con una nueva cuenta. También se peude realizar una gestión del usu de cookies, 
  ![Registro](./Images/bienvenidaWeb.png)
  *(Caso de uso implementado en #S2)*


- **(Mejora) Registro**:  
  El usuario se registra en el sistema proporcionando su nombre, correo electrónico y contraseña a través de un formulario. Para completar el registro es necesario que el nuevo usuario lea y acepte los términos y condiciones de uso.
  ![Registro](./Images/registroWeb.png)
 *(Caso de uso implementado en #S2)*
  ![Registro](./Images/terminosCondiciones.png)
  *(Caso de uso implementado en #S2)*

- **Login**:  
  El usuario inicia sesión en el sistema introduciendo el correo y contraseña con el que previamente se ha debido registrar en el sistema. 
  ![Login](./Images/LoginWeb.png)
  *(Mockup ficticio en #S1)*

- **(Mejora) Exploración de zonas no descubiertas**:  
  El usuario se desplaza físicamente hacia la zona que quiere descubrir. Al llegar a la ubicación, el sistema detecta su presencia y automáticamente desbloquea la localización en su mapa personal pintandola de color verde. La posición actual del usuario se indica con un marcador en el mapa.
  ![MapaPersonal](./Images/MapaPersonalWeb.png)
  *(Caso de uso implementado en #S1)*
  ![ZonaDescubierta](./Images/ZonaDescubiertaWeb.png)
  *(Caso de uso implementado en #S1)*

- **Registro de puntos de interés**:  
  El usuario selecciona una zona del mapa desbloqueada en la que desea añadir un punto de interés. Al tocar la ubicación, se muestra una ventana emergente con un formulario donde debe añadir un nombre y una descripción, una categoría, que es opcional y fotografías, también opcionales. Una vez completado el proceso, el punto de interés queda registrado y aparece en el mapa interactivo con un marcador.
  ![POIFormulario](./Images/POIFormularioWeb.png)
  *(Caso de uso implementado en #S1)*

  ![VerPOI](./Images/verPOIWeb.png)
  *(Caso de uso implementado en #S1)*

- **(Nuevo) Suscripción**:
  El usuario puede acceder a la pantalla de suscripción a Premium desde la opción "Suscripción" en el menú desplegable ubicado en la esquina superior derecha.
   ![suscripcion](./Images/menuWeb.png)
  *(Caso de uso implementado en #S2)* 
   Al entrar, visualizará información sobre los beneficios de ser Premium y un botón "Pagar con Stripe", que le permitirá iniciar el proceso de pago. Al pulsarlo, aparecerá la pasarela de pago de Stripe, donde deberá ingresar sus datos y confirmar la transacción. Una vez completado el pago con éxito, el sistema actualizará su estado a Premium y lollevará a su mapa. 
   ![suscripcion](./Images/suscripcionNormalWeb.png)
  *(Caso de uso implementado en #S2)* 

  
  Si el usuario vuelve a entrar en la sección de "Suscripción" se le indica que ya es miembro Premium y se muestra un botón "Ir a mi mapa", que le permitirá acceder a sus mapas y disfrutar de las ventajas exclusivas de los miembros Premium.
   ![suscripcion](./Images/suscripcionPremiumlWeb.png)
  *(Caso de uso implementado en #S2)* 


### 1.2. Matchmaking

- **(Nuevo) Administrador**:
  Los administradores de MapYourWorld gestionan la publicidad añadiendo puntos de interés en el mapa para las empresas que solicitan promoción. Desde el Panel de Administración, pueden registrar un negocio completando un formulario con su nombre, descripción, categoría y coordenadas. Tras validar la información, hacen clic en "Guardar Comercio", y el negocio queda registrado en el sistema, apareciendo en los mapas accesibles para los usuarios.

 ![Registro](./Images/adminWeb.png)
  *(Caso de uso implementado en #S2)*



- **(Nuevo) Publicidad**:  
  El usuario tiene disponible la opción de "Publicítate con nosotros", para aquellas empresas que quieran aparecer en los mapas como pntos de interés. Para ello solo deben rellenar un formulario con nombre, correo de contacto, descripción del local o empresa a publicitar y las coordenadas donde se ubica el mismo. Este formulario se envía por correo a la cuenta corporativa de MapYourworld para que los adminitradores del sitma puedan añadirlo.
  ![Registro](./Images/publicidadWeb.png)
  *(Caso de uso implementado en #S2)*

- **(Nuevo) Social:**
El usuario puede acceder al apartado de Social desde el menú desplegable en la esquina superior derecha. 
 ![suscripcion](./Images/menuWeb.png)
  *(Caso de uso implementado en #S2)* 

  En la sección Amigos, se muestra un listado con los amigos agregados.
 ![social](./Images/socialAmigosWeb.png)
  *(Caso de uso implementado en #S2)* 

  En Solicitudes, el usuario puede ver tanto las peticiones de amistad recibidas como las invitaciones a mapas enviadas por sus amigos, pudiendo aceptarlas o rechazarlas. 
  ![social](./Images/socialSolicitudesWeb.png)
  *(Caso de uso implementado en #S2)* 

  En Buscar, el usuario puede encontrar a otros miembros de la plataforma escribiendo su nombre de usuario en la barra de búsqueda y pulsando el botón Buscar. Si el usuario existe, se mostrará su correo junto a un botón Agregar, que enviará una solicitud de amistad a dicho usuario.
   ![social](./Images/socialBuscarWeb.png)
  *(Caso de uso implementado en #S2)* 


- **(Mejora) Participación en mapas colaborativos:**
  El usuario registrado puede acceder a la sección de mapas colaborativos desde el menú desplegable de la esquina superior derecha de su pantalla.
  ![suscripcion](./Images/menuWeb.png)
  *(Caso de uso implementado en #S2)*
  
  Tras seleccionar la opción "Mapas Colaborativos", aparece una pantalla donde se listan los mapas colaborativos a los que pertenece el usuario, además de las opciones de eliminar dicho mapa o crear un nuevo mapa.
  ![collab](./Images/listaMapaColab.png)
  *(Caso de uso implementado en #S2)*

  Si el usuario crea un nuevo mapa colaborativo pulsando sobre el boton "+" en la parte superior derecha, se muestra un formulario donde debe indicar el nombre del mapa, una descripción e indicar el número de usuarios máximos  que pueden formar parte de dicho mapa.
  ![collab](./Images/crearMapaColabWeb.png)
  *(Caso de uso implementado en #S2)*

  Si el usuario pulsa sobre alguno de los mapas colaborativos que aparecen listados pasa a visualizar el progreso de dicho mapa, viendo en la parte superior derecha una leyenda que indica el color asociado a las zonas descuniertas por el resto de usuarios que formen parte del mapa colaborativo. También dispone de las funcionalidades de invitar a otros usuarios, que tenga previamnete añadidos como amigos, y recargar datos, las cuales estan disponibles en la parte inferior de la pantalla.
  ![collab](./Images/verMapaColabWeb.png)
  *(Caso de uso implementado en #S2)*

  Si desde dentro de un mapa colaborativo el usuario pulsa el boton de "Invitar Amigos" situado en la parte inferior de la pantalla, se muestra un listado de los amigos del usuario y junto a cada uno de los amigos la opción "Invitar" que le enviará una invitación a ese amigo al mapa actual desde el que se envía. 
  ![collab](./Images/invitarMapaColabWeb.png)
  *(Caso de uso implementado en #S2)*
  Esta solicitud le aparecerá al usuario amigo en la sección de social en el apartado de Solicitudes.
  ![collab](./Images/invitacionMapaColabWeb.png)
  *(Caso de uso implementado en #S2)*


---

## 2. Datos Necesarios para Realizar la Revisión

- **URL de la página de inicio (Landing Page):** [Landing Page de MapYourWorld](https://mapyourworld.netlify.app/)  
  
- **Credenciales de Usuarios:**
  El login y registro ya son completamente funcionales, permitiendo la creación de nuevos usuarios y el acceso con credenciales de usuarios existentes. Además, proporcionamos algunos usuarios preconfigurados en el sistema con sus respectivas credenciales para facilitar pruebas y acceso. Además se proporcionan los datos necesrios para hacer pagos de pruebva en la sección de subscripcion con cualquier usuario.

  - **Usuario 1:**  
    - Usuario: `user1@gamil.com`  
    - Contraseña: `user12345*`
  - **Usuario 2:**  
    - Usuario: `user2@gmail.com`  
    - Contraseña: `user12345*`
  - **Administrador:**  
    - Usuario: `admin@gamil.com`  
    - Contraseña: `admin12345*`

- **Plataforma de pago:**
   - Número de tarjeta: `4242 4242 4242 4242`
   - Fecha: `08/28`
   - CVC: `123`

- **Plataforma de Despliegue:**
  - **URL:** [Despliegue de MapYourWorld](https://52.143.134.165/)
  - **Credenciales:**  
    - Acceder como usuario de prueba.

- **Repositorio en GitHub:**  
  - **URL:** [Repositorio de MapYourWorld](https://github.com/ISPP-Grupo-7/MapYourWorld)

- **Herramienta de Seguimiento de Tiempo:**
  - **URL:** [Reporte de Clockify](https://app.clockify.me/shared/67d1d4ef61753b24b9d8d838)  
  
---

## 3. Requisitos Potenciales para Usar el Sistema

- Activar el acceso a la localización.
- Activar el acceso a la galería de imágenes si desea subir alguna foto asociada a algún punto de interés.

---

## 4. Demo de la Evaluación

- **URL:** [Demo de MapYourWorld](https://youtu.be/t4GDfnUqC7o)

## 5. Acceso al despliegue

- Actualmente, la aplicación web se encuentra desplegada en una instancia de máquina virtual de Microsoft Azure. Para acceder, se requiere conectarse mediante **ssh** a la dirección IP de la máquina virtual. La autenticación se realiza mediante una clave RSA privada que se adjunta. El comando completo es el siguiente:

`ssh -i ispp_key.pem ispp_admin@52.143.134.165`

Concretamente, el proceso de node (llamado mapyourworld) está gestionado por la herramienta **PM2**. Para comprobar el estado del proceso, se puede ejecutar el siguiente comando:

`pm2 list`

- Sin embargo, si lo que deseamos es acceder a la aplicación como un usuario, a través del navegador, entonces debemos conectarnos mediante **http** al socket de la máquina virtual en el cual se está ejecutando el proceso de node, es decir, la IP anteriormente mencionado, en el puerto **4444**. La URL completa sería la siguiente:

`http://52.143.134.165:4444`

---
