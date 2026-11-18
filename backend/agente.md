# Instrucciones del backend CoffeeHouse

- Mantener una API REST Node.js/Express para la cafetería.
- Usar MySQL configurado mediante `.env`; nunca guardar credenciales en el
  código ni en Git.
- Mantener el código en `src/controllers`, `src/models`, `src/routes` y
  `src/middlewares`.
- Servir el contenido público desde `GET /api/cafeteria`; guardar los mensajes
  del formulario en `contactos`.
- Enviar las preguntas del chatbot a Ollama desde el backend. Antes de generar
  la respuesta, obtener de MySQL la información actual de cafetería, servicios
  y productos. El modelo predeterminado es `gemma3`.
- Validar las entradas y comunicar errores con códigos HTTP adecuados.
- Mantener pruebas y documentación alineadas con los endpoints de cafetería.
