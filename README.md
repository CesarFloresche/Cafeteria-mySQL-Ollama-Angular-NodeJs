# CoffeeHouse

Sitio de cafetería con frontend Angular, API REST en Node.js/Express y MySQL
local de XAMPP. La página toma su contenido de la base de datos y vuelve a
consultar la API cada cinco segundos para reflejar cambios hechos desde
phpMyAdmin o desde la base de datos. El chatbot utiliza Ollama con Gemma 3 y
consulta los datos actuales del negocio antes de responder.

## Requisitos

- Node.js y npm.
- XAMPP con MySQL/MariaDB activo.
- Ollama instalado y el modelo descargado (`ollama pull gemma3`) para habilitar
  el chatbot.

## Preparar MySQL

1. Inicia MySQL desde el panel de XAMPP.
2. En phpMyAdmin, crea una base llamada `cafeteria`.
3. Selecciona esa base e importa `backend/database/schema.sql`.
4. Importa una sola vez `backend/database/seed-cafeteria.sql` para cargar
   contenido de demostración.
5. Edita los registros de `cafeteria`, `servicios`, `productos_cafeteria` y
   `galeria` en phpMyAdmin. La página consulta los cambios en un máximo de unos
   cinco segundos. `contactos` guarda los formularios recibidos.

Los textos de dirección, historia y horarios del seed son ejemplos para
reemplazar. El video de portada está alojado en Pexels; la URL y el poster se
pueden cambiar en la tabla `cafeteria`.

## Iniciar el backend

En `backend`, copia `.env.example` a `.env` y ajusta usuario, contraseña y base
según la configuración de MySQL de tu XAMPP. `.env` es local y no se debe
subir a GitHub.

```powershell
cd backend
npm install
npm start
```

La API queda en `http://127.0.0.1:3000`. Comprueba la conexión en
`http://127.0.0.1:3000/api/health`.

## Iniciar Angular

En otra terminal:

```powershell
cd veterinaria
npm install
npm start
```

Abre `http://localhost:4200`. El proxy de desarrollo reenvía `/api` al backend.
Para producción, configura el host para que enrute `/api` al backend Node.js.

## APIs de la cafetería

- `GET /api/cafeteria`: negocio, servicios, productos y galería.
- `POST /api/cafeteria/contacto`: guarda un mensaje en `contactos`.
- `POST /api/chatbot`: pregunta al asistente conectado a Ollama/Gemma 3.

La consulta periódica detecta ediciones hechas directamente en MySQL; el
contenido no se guarda en el navegador como fuente de verdad. Si el backend o
la base no están disponibles, la página informa del problema y vuelve a
intentarlo.

## Publicación en GitHub

El `.gitignore` raíz excluye `.env`, dependencias y artefactos generados.
GitHub Pages solo sirve contenido estático: no ejecuta Node.js, MySQL/XAMPP ni
Ollama. Para una versión pública, aloja la API y una base MySQL accesible en un
servidor; mantén las credenciales como variables de entorno del proveedor y
ajusta CORS y el enrutamiento del frontend.
