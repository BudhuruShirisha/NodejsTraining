const Router = require("express");
const router = Router();

const { Validation } = require("../src/patient/patient");
const { Create, Get, Update, Delete } = require("../src/patient/controller");

router.post("/", Validation, Create);

router.get("/", Get);

router.put("/:id", Update);

router.delete("/:id", Delete);

module.exports = router;