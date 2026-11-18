# CoffeeHouse API

API REST en Express para el sitio de la cafetería. Obtiene su contenido desde
MySQL (XAMPP) y consulta Ollama/Gemma 3 para el chatbot.

## Preparación

1. Inicia MySQL desde XAMPP y crea una base llamada `cafeteria`.
2. Importa [`database/schema.sql`](./database/schema.sql) en esa base.
3. Importa [`database/seed-cafeteria.sql`](./database/seed-cafeteria.sql) una
   sola vez para cargar contenido de ejemplo.
4. Copia `.env.example` como `.env` en esta carpeta y configura la conexión.
   No subas `.env` a GitHub.
5. Para usar el chatbot, ejecuta Ollama y descarga Gemma 3 con `ollama pull
   gemma3`.

Instala e inicia el backend:

```powershell
npm install
npm start
```

La API escucha en `http://127.0.0.1:3000`. Endpoints principales:

- `GET /api/health`
- `GET /api/cafeteria` — negocio, servicios, productos y galería.
- `POST /api/cafeteria/contacto` — guarda consultas del formulario.
- `POST /api/chatbot` — responde con información actual de MySQL.

Consulta [`API.md`](./API.md) para contratos y ejemplos. El frontend consulta
el contenido cada cinco segundos para reflejar cambios hechos directamente
en MySQL.
