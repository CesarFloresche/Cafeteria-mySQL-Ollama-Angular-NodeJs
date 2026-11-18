# Especificación del proyecto: sitio web de cafetería

## Objetivo

Desarrollar un sitio web para una cafetería con un frontend en Angular y un
backend API REST en Node.js. El frontend debe obtener todo el contenido
dinámico desde el backend mediante APIs; no debe mantener copias locales de
los datos del negocio como fuente principal.

La referencia visual compartida propone una portada oscura y elegante, con
fotografía o video de café a pantalla amplia, tipografía destacada, acentos dorados y navegación clara. Adaptar el estilo a la identidad de la cafetería
y asegurar que funcione en dispositivos móviles.

## Frontend: Angular

Crear una página de cafetería con estas secciones:

- **Inicio:** portada con un video de una cafetería reproduciéndose en bucle,
  texto de presentación y una acción para explorar el menú.
- **Servicios:** listado de todos los servicios que ofrece la cafetería.
- **Especialidades:** selección de cafés, bebidas, comidas u otros productos
  destacados.
- **Nosotros:** historia e información del negocio, dirección, teléfono y
  fotografías de la tienda.
- **Precios:** productos y sus precios, obtenidos desde la API.
- **Contactos:** datos de contacto y formulario para enviar consultas.
- **Chatbot:** asistente para responder preguntas sobre la cafetería, sus
  servicios, productos, precios y ubicación.

Los servicios Angular deben centralizar las solicitudes HTTP a la API. Los
componentes deben presentar estados de carga y errores de forma clara. El
formulario de contacto debe enviar sus datos al backend y confirmar el
resultado al usuario.

Todo contenido variable —incluidos textos, datos de contacto, servicios,
productos, precios, fotos y URL del video— debe cargarse desde endpoints del
backend. Los recursos multimedia pueden servirse desde URL almacenadas en la
base de datos.

El frontend debe volver a consultar el contenido periódicamente para detectar
cambios realizados directamente en MySQL y actualizar la página sin recargarla.

## Video e imágenes

- Buscar videos de cafeterías en [Pexels](https://www.pexels.com/).
- Usar un video apto para la portada, con reproducción automática silenciada,
  en bucle y con controles de accesibilidad/fallback adecuados.
- Configurar la URL del recurso a través de la API; evitar codificarla en
  componentes Angular.
- Verificar las condiciones de uso y atribución del recurso elegido.
- La galería de fotos de la tienda también debe cargarse desde la API.

## Backend: Node.js

Implementar un backend REST en Node.js (siguiendo las dependencias y patrones
existentes del proyecto) que conecte Angular con MySQL. Mantener el código
organizado en:

- `models/`: consultas y acceso a los datos.
- `controllers/`: validación y lógica de las solicitudes.
- `routes/`: endpoints de la API.
- `middlewares/`: CORS, validación y manejo centralizado de errores.
- `app.js` (o el punto de entrada equivalente ya existente): configuración
  y montaje de la aplicación.
- `chatbot/` o el controlador/ruta correspondiente: integración del asistente.
- `.env`: configuración local de la conexión, puertos y Ollama; no versionar
  secretos ni valores locales.

Crear APIs para consultar la información pública del sitio, listar servicios,
consultar especialidades/productos y precios, obtener la galería, enviar
mensajes de contacto y conversar con el chatbot. Validar entradas y responder
con códigos HTTP apropiados. No exponer credenciales ni datos internos.

## Chatbot: Ollama y Gemma 3

- Usar Ollama como servicio de inferencia local y `gemma3` como modelo
  predeterminado.
- Adaptar el chatbot existente del proyecto, conservando su integración
  técnica útil y reemplazando el contexto temático anterior por información
  verificada de la cafetería.
- El chatbot debe responder en el idioma del usuario y limitarse a información
  del negocio; cuando no tenga datos suficientes, debe indicarlo y ofrecer
  canales de contacto.
- No llamar Ollama directamente desde Angular: las solicitudes deben pasar
  por el backend.
- Obtener URL y modelo mediante variables de entorno, por ejemplo
  `OLLAMA_URL` y `OLLAMA_MODEL`; no asumir que Ollama está disponible y
  reportar errores del servicio explícitamente.

## Base de datos: MySQL en XAMPP

Usar MySQL administrado localmente con XAMPP. La conexión debe configurarse
mediante variables de entorno (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`
y `DB_NAME`). No asumir una contraseña distinta de la que configure el usuario
en su instalación. Incluir un esquema SQL y datos iniciales de ejemplo cuando
sean necesarios para ejecutar y probar el sitio.

Tablas sugeridas, ajustables al modelo existente:

- `cafeteria`: nombre, descripción, historia, dirección, teléfono, correo y
  otros datos generales del negocio.
- `servicios`: nombre, descripción, imagen y estado de publicación.
- `productos_cafeteria`: nombre, descripción, categoría, precio, imagen y
  estado de publicación. La categoría permite identificar especialidades y
  presentar el menú/precios sin duplicar registros.
- `galeria`: URL de imagen, texto alternativo, descripción y orden de
  presentación.
- `contactos`: nombre, correo, teléfono opcional, mensaje y fecha de envío.

La información del chatbot puede consultarse desde estas tablas por medio del
backend. No guardar conversaciones salvo que exista un requisito explícito
para ello.

## Criterios de implementación

- Revisar primero la estructura y convenciones actuales del repositorio;
  reutilizar lo que corresponda sin eliminar funcionalidad ajena al sitio.
- Mantener frontend y backend desacoplados mediante contratos JSON claros.
- Configurar CORS para el origen local de Angular y los entornos autorizados.
- No incluir credenciales reales, secretos ni contraseñas en el código o en
  este documento.
- Probar la conexión con MySQL de XAMPP, los endpoints principales y los
  estados de error antes de dar el trabajo por terminado.
