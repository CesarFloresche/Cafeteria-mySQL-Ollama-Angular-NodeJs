const express = require("express");
const chatbotRoutes = require("./routes/chatbot");
const cafeteriaRoutes = require("./routes/cafeteria");
const errorHandler = require("./middlewares/error-handler");
const requireJsonObject = require("./middlewares/require-json-object");
const cors = require("./middlewares/cors");

const app = express();

app.disable("x-powered-by");
app.use(cors);
app.use(express.json({ limit: "1mb" }));
app.use(requireJsonObject);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
app.use("/api/cafeteria", cafeteriaRoutes);
app.use("/api/chatbot", chatbotRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});
app.use(errorHandler);

module.exports = app;
