const cafeteria = require("../models/cafeteria");

const INSTRUCCIONES = `
Eres el asistente virtual de una cafetería. Responde en español, con amabilidad,
claridad y brevedad. Usa exclusivamente la información vigente proporcionada
desde la base de datos para responder preguntas sobre el negocio, su historia,
ubicación, horarios, servicios, productos y precios. No inventes datos ni
promociones. Si falta un dato, dilo y recomienda contactar directamente a la
cafetería. Para preguntas ajenas al negocio, explica amablemente que tu función
es ayudar con información de la cafetería.
`;

const OLLAMA_URL = (
  process.env.OLLAMA_URL || "http://127.0.0.1:11434"
).replace(/\/+$/, "");
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "gemma3";
const OLLAMA_TIMEOUT_MS = 60000;
const MAX_PROMPT_LENGTH = 4000;

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function prompt(req, res) {
  const { prompt: question } = req.body;
  if (
    typeof question !== "string" ||
    !question.trim() ||
    question.length > MAX_PROMPT_LENGTH
  ) {
    throw httpError(
      400,
      `prompt debe ser un texto no vacío de hasta ${MAX_PROMPT_LENGTH} caracteres`,
    );
  }

  const businessContext = await cafeteria.findChatContext();
  const controller = new AbortController();
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, OLLAMA_TIMEOUT_MS);

  let data;
  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        system: `${INSTRUCCIONES}\n\n${businessContext}`,
        prompt: question.trim(),
        stream: false,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw httpError(502, "El servicio de IA no pudo procesar la solicitud");
    }
    data = await response.json();
  } catch (error) {
    if (error.status) {
      throw error;
    }
    if (timedOut) {
      throw httpError(504, "El servicio de IA excedió el tiempo de espera");
    }
    throw httpError(502, "No se pudo conectar con el servicio de IA");
  } finally {
    clearTimeout(timeout);
  }

  if (!data || typeof data.response !== "string") {
    throw httpError(502, "El servicio de IA devolvió una respuesta no válida");
  }

  res.json({ response: data.response.trim() });
}

module.exports = { prompt };
