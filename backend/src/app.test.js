const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");
const { once } = require("node:events");

if (!process.env.DB_NAME) {
  process.env.DB_NAME = "cafeteria_test";
}

const app = require("./app");
const cafeteriaModel = require("./models/cafeteria");
const database = require("./config/database");

let server;
let baseUrl;

before(async () => {
  server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test("health endpoint responds successfully", async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok" });
});

test("CORS allows the Angular development origin", async () => {
  const response = await fetch(`${baseUrl}/api/health`, {
    headers: { Origin: "http://localhost:4200" },
  });
  assert.equal(response.status, 200);
  assert.equal(
    response.headers.get("access-control-allow-origin"),
    "http://localhost:4200",
  );
});

test("CORS handles preflight requests", async () => {
  const response = await fetch(`${baseUrl}/api/cafeteria/contacto`, {
    method: "OPTIONS",
    headers: {
      Origin: "http://localhost:4200",
      "Access-Control-Request-Method": "POST",
      "Access-Control-Request-Headers": "content-type",
    },
  });
  assert.equal(response.status, 204);
  assert.match(response.headers.get("access-control-allow-methods"), /POST/);
});

test("unknown routes return 404", async () => {
  const response = await fetch(`${baseUrl}/no-such-route`);
  assert.equal(response.status, 404);
});

test("cafeteria endpoint returns current content without HTTP caching", async () => {
  const originalFindSiteContent = cafeteriaModel.findSiteContent;
  const content = {
    cafeteria: { id: 1, nombre: "CoffeeHouse" },
    servicios: [],
    productos: [],
    galeria: [],
  };
  cafeteriaModel.findSiteContent = async () => content;

  try {
    const response = await fetch(`${baseUrl}/api/cafeteria`);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.deepEqual(await response.json(), content);
  } finally {
    cafeteriaModel.findSiteContent = originalFindSiteContent;
  }
});

test("cafeteria model converts MySQL product fields for the API", async () => {
  const originalExecute = database.execute;
  database.execute = async (query) => {
    if (query.includes("FROM cafeteria")) {
      return [[{ id: 1, nombre: "CoffeeHouse" }], []];
    }
    if (query.includes("FROM servicios")) {
      return [[{ id: 2, nombre: "Para llevar" }], []];
    }
    if (query.includes("FROM productos_cafeteria")) {
      return [
        [
          {
            id: 3,
            titulo: "Espresso",
            precio: "18.50",
            destacada: 1,
          },
        ],
        [],
      ];
    }
    if (query.includes("FROM galeria")) {
      return [[{ id: 4, imagen: "https://example.com/cafe.jpg" }], []];
    }
    throw new Error("Consulta inesperada");
  };

  try {
    const content = await cafeteriaModel.findSiteContent();
    assert.equal(content.cafeteria.nombre, "CoffeeHouse");
    assert.equal(content.servicios[0].nombre, "Para llevar");
    assert.equal(content.productos[0].precio, 18.5);
    assert.equal(content.productos[0].destacada, true);
    assert.equal(content.galeria[0].id, 4);
  } finally {
    database.execute = originalExecute;
  }
});

test("contact form rejects invalid data", async () => {
  const response = await fetch(`${baseUrl}/api/cafeteria/contacto`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      nombre: "Ana",
      email: "correo-invalido",
      mensaje: "Hola",
    }),
  });
  assert.equal(response.status, 400);
});

test("contact form stores valid user input", async () => {
  const originalCreateContact = cafeteriaModel.createContact;
  let savedContact;
  cafeteriaModel.createContact = async (contact) => {
    savedContact = contact;
    return { id: 7 };
  };

  try {
    const response = await fetch(`${baseUrl}/api/cafeteria/contacto`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        nombre: " Ana Pérez ",
        email: " ana@example.com ",
        telefono: " ",
        mensaje: " Me gustaría conocer el menú. ",
      }),
    });
    assert.equal(response.status, 201);
    assert.deepEqual(await response.json(), {
      id: 7,
      message: "Mensaje recibido",
    });
    assert.deepEqual(savedContact, {
      nombre: "Ana Pérez",
      email: "ana@example.com",
      telefono: null,
      mensaje: "Me gustaría conocer el menú.",
    });
  } finally {
    cafeteriaModel.createContact = originalCreateContact;
  }
});

test("chatbot validates prompts and sends current cafeteria context to Ollama", async () => {
  const invalidResponse = await fetch(`${baseUrl}/api/chatbot`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ prompt: " " }),
  });
  assert.equal(invalidResponse.status, 400);

  const originalFetch = global.fetch;
  const originalGetChatContext = cafeteriaModel.findChatContext;
  let ollamaRequest;
  cafeteriaModel.findChatContext = async () =>
    "Nombre: CoffeeHouse\nProductos: Espresso de la casa";
  global.fetch = async (url, options) => {
    if (url !== "http://127.0.0.1:11434/api/generate") {
      return originalFetch(url, options);
    }
    ollamaRequest = { url, ...options, body: JSON.parse(options.body) };
    return {
      ok: true,
      json: async () => ({ response: "Tenemos espresso de la casa." }),
    };
  };

  try {
    const response = await fetch(`${baseUrl}/api/chatbot`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ prompt: "¿Qué café recomiendan?" }),
    });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      response: "Tenemos espresso de la casa.",
    });
    assert.equal(ollamaRequest.body.model, "gemma3");
    assert.equal(ollamaRequest.body.stream, false);
    assert.match(ollamaRequest.body.system, /CoffeeHouse/);
    assert.match(ollamaRequest.body.system, /Espresso de la casa/);
  } finally {
    global.fetch = originalFetch;
    cafeteriaModel.findChatContext = originalGetChatContext;
  }
});
