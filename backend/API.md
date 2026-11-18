# API CoffeeHouse

Base local predeterminada: `http://127.0.0.1:3000`. Todas las rutas devuelven
JSON, excepto las respuestas `204`. Los errores usan `{ "error": "..." }`.

## Estado

### `GET /api/health`

Comprueba que el servidor esté activo; responde `200` con `{ "status": "ok" }`.

## Contenido público

### `GET /api/cafeteria`

Devuelve la información actual almacenada en MySQL:

```json
{
  "cafeteria": {},
  "servicios": [],
  "productos": [],
  "galeria": []
}
```

La respuesta incluye `Cache-Control: no-store`; Angular vuelve a solicitarla
cada cinco segundos para reflejar los cambios hechos directamente en la base.
Los productos provienen de `productos_cafeteria` y los registros con
`activo = 0` no se publican. Si falta la fila principal de `cafeteria`, responde
`503`.

## Contacto

### `POST /api/cafeteria/contacto`

Valida y guarda un mensaje en `contactos`. `nombre`, `email` y `mensaje` son
obligatorios; `telefono` es opcional.

```json
{
  "nombre": "Ana Pérez",
  "email": "ana@example.com",
  "telefono": null,
  "mensaje": "Quisiera consultar el menú."
}
```

Responde `201` con el id creado. Los datos inválidos reciben `400`.

## Chatbot

### `POST /api/chatbot`

Envía el prompt a Ollama con el contexto actual del negocio, servicios y
productos. El prompt debe ser texto no vacío de hasta 4.000 caracteres.

```json
{ "prompt": "¿Qué bebidas tienen y cuáles son sus precios?" }
```

Respuesta `200`:

```json
{ "response": "Respuesta del asistente." }
```

Configura `OLLAMA_URL` y `OLLAMA_MODEL` en `.env`; por defecto se usan
`http://127.0.0.1:11434` y `gemma3`. Los errores de conexión reciben `502` y
los tiempos de espera `504`.

## Base de datos

Importa [`database/schema.sql`](./database/schema.sql) en MySQL de XAMPP. Las
tablas del proyecto son `cafeteria`, `servicios`, `productos_cafeteria`,
`galeria` y `contactos`. El seed de demostración está en
[`database/seed-cafeteria.sql`](./database/seed-cafeteria.sql); ejecútalo una
sola vez.
