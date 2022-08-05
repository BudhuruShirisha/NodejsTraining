const express = require('express');
const router = express.Router();
const { Validationcheck } = require("../src/organization/organization.js");
const { Create, Get, Delete, Update } = require('../src/organization/controller.js');

router.post("/create", Validationcheck, Create)

router.get("/", Get)

router.put("/:id", Update)
router.delete("/:id", Delete)
module.exports = router;