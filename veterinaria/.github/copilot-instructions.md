# Instrucciones de Copilot: CoffeeHouse

## Proyecto

- Sitio web de cafetería con frontend Angular, API REST en Node.js/Express y
  MySQL administrado localmente con XAMPP.
- El contenido del sitio se obtiene desde `/api/cafeteria`. No introducir
  JSON locales ni duplicar los datos del negocio en componentes.
- La interfaz consulta la API cada cinco segundos para detectar cambios
  directos en MySQL.
- Ollama y Gemma 3 se llaman exclusivamente desde el backend. El contexto del
  chatbot se construye con los datos actuales de MySQL.

## Reglas

- Mantener diseño responsive, accesible y con los estilos de café oscuro,
  crema y dorado del sitio.
- Guardar consultas de contacto por medio de `POST /api/cafeteria/contacto`.
- No incluir credenciales; usar variables de entorno y mantener `.env` fuera
  de Git.
- Usar Pexels para recursos multimedia y conservar su atribución.
- Probar Angular y Node.js después de cambios relevantes.
