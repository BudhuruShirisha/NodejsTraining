const Router = require("express");
const router = Router();
const { Validation } = require("../src/user/user.js");
const config = require("../src/config/app.sepc.json")
const {
    createRec,
    getRec,
    updateRec,
    deleteRec,
} = require("../src/user/controller");
const { authValidation, setAuth } = require("../src/authentication/authenticate");

router.post("/create/", Validation, createRec);

router.get("/get/", getRec);

router.put("/update/", updateRec);

router.delete("/delete/", deleteRec);

router.post("/createauth", authValidation, async(req, res) => {
    try {

        req.body.refrectype = config.user.rectype;
        const result = await setAuth(req.body);
        res.status(200).json({ status: "Success", results: result });
    } catch (error) {
        res.status(400).json({ status: "Error :", error: error });
    }
});

module.exports = router;