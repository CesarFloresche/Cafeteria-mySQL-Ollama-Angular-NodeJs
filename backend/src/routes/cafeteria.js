const express = require("express");
const controller = require("../controllers/cafeteria");

const router = express.Router();

router.get("/", controller.getSiteContent);
router.post("/contacto", controller.createContact);

module.exports = router;
