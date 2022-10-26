const Router = require("express");
const express = require("express")
const app = express();
const router = Router();
const config = require("../src/config/app.sepc.json");
const { Validation } = require("../src/organization/organization.js");
const { authenticateJWT } = require("../src/middleware/middleware");
const { activity } = require("../src/user/activities")
const {
    createRec,
    getRec,
    updateRec,
    deleteRec,
} = require('../src/organization/controller.js');
const { createOrgRecord, updateOrgRecord, deleteOrgRecord } = require("../src/organization/recordmodel")
const { processFun } = require("../src/contact/contact");
const { deleteRecord } = require("../src/db/mongodb");

router.post("/create/", Validation, createRec, activity);

router.get("/get/", getRec);

router.put("/update/", updateRec);

router.delete("/delete/", deleteRec);

router.post("/contact", authenticateJWT, activity, async(req, res) => {
    try {
        const __action = req.body.__action;
        const processFunction = processFun(__action);
        const contactBody = req.body.body || {};
        contactBody.refrectype = config.organization.rectype;
        const result = await processFunction(contactBody);

        res.status(200).json({ status: "Success", results: result });

    } catch (error) {
        res.status(400).json({ status: "Error :", error: error.message });
    }
})
router.post("/createrecord/", authenticateJWT, createOrgRecord);
router.put("/updaterecord/", updateOrgRecord);
router.delete("/deleterecord", deleteOrgRecord)


module.exports = router;