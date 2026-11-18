const database = require("../config/database");

async function findSiteContent() {
  const [[cafeteriaRows], [servicios], [productos], [galeria]] =
    await Promise.all([
      database.execute(
        `SELECT id, nombre, slogan, descripcion, historia, direccion, telefono,
                correo, horarios, whatsapp, instagram, facebook, video_url,
                video_poster, video_credit, video_credit_url
         FROM cafeteria
         ORDER BY id
         LIMIT 1`,
      ),
      database.execute(
        `SELECT id, nombre, descripcion, icono, imagen, orden
         FROM servicios
         WHERE activo = 1
         ORDER BY orden, id`,
      ),
      database.execute(
        `SELECT id, titulo, descripcion, imagen, precio, categoria, destacada,
                orden
         FROM productos_cafeteria
         WHERE activo = 1
         ORDER BY orden, id`,
      ),
      database.execute(
        `SELECT id, imagen, texto_alternativo, descripcion, orden
         FROM galeria
         WHERE activo = 1
         ORDER BY orden, id`,
      ),
    ]);

  return {
    cafeteria: cafeteriaRows[0] || null,
    servicios,
    productos: productos.map((producto) => ({
      ...producto,
      precio: Number(producto.precio),
      destacada: Boolean(producto.destacada),
    })),
    galeria,
  };
}

async function createContact({ nombre, email, telefono, mensaje }) {
  const [result] = await database.execute(
    `INSERT INTO contactos (nombre, email, telefono, mensaje)
     VALUES (?, ?, ?, ?)`,
    [nombre, email, telefono, mensaje],
  );
  return { id: result.insertId };
}

async function findChatContext() {
  const content = await findSiteContent();
  const business = content.cafeteria;
  const lines = [
    "Información vigente de la cafetería, obtenida de MySQL:",
    business
      ? [
          `Nombre: ${business.nombre}`,
          `Descripción: ${business.descripcion || "No especificada"}`,
          `Historia: ${business.historia || "No especificada"}`,
          `Dirección: ${business.direccion || "No especificada"}`,
          `Teléfono: ${business.telefono || "No especificado"}`,
          `Correo: ${business.correo || "No especificado"}`,
          `Horarios: ${business.horarios || "No especificados"}`,
        ].join("\n")
      : "La información general de la cafetería todavía no está configurada.",
    "Servicios:",
    ...content.servicios.map(
      (service) => `- ${service.nombre}: ${service.descripcion || ""}`,
    ),
    "Productos y precios:",
    ...content.productos.map(
      (product) =>
        `- ${product.titulo} (${product.categoria}): ${product.descripcion || ""}; precio ${product.precio}.`,
    ),
  ];

  return lines.join("\n").slice(0, 12000);
}

module.exports = { createContact, findChatContext, findSiteContent };
