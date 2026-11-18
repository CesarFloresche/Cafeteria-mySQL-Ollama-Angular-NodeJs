const cafeteria = require("../models/cafeteria");

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function getSiteContent(req, res) {
  res.set("Cache-Control", "no-store");
  const content = await cafeteria.findSiteContent();
  if (!content.cafeteria) {
    throw httpError(503, "La información de la cafetería aún no está configurada");
  }
  res.json(content);
}

async function createContact(req, res) {
  const { nombre, email, telefono, mensaje } = req.body;
  const normalizedName = typeof nombre === "string" ? nombre.trim() : "";
  const normalizedEmail = typeof email === "string" ? email.trim() : "";
  const normalizedPhone =
    typeof telefono === "string" && telefono.trim()
      ? telefono.trim()
      : null;
  const normalizedMessage = typeof mensaje === "string" ? mensaje.trim() : "";

  if (
    !normalizedName ||
    normalizedName.length > 100 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) ||
    normalizedEmail.length > 254 ||
    (normalizedPhone !== null && normalizedPhone.length > 40) ||
    !normalizedMessage ||
    normalizedMessage.length > 4000
  ) {
    throw httpError(
      400,
      "Revisa nombre, correo, teléfono y mensaje antes de enviar el formulario",
    );
  }

  const contact = await cafeteria.createContact({
    nombre: normalizedName,
    email: normalizedEmail,
    telefono: normalizedPhone,
    mensaje: normalizedMessage,
  });
  res.status(201).json({ ...contact, message: "Mensaje recibido" });
}

module.exports = { createContact, getSiteContent };
