const express = require("express")
const app = express()
const Router = require("express");
const router = Router();
const config = require("../src/config/app.sepc.json")
const { processFun, getcontactRec } = require("../src/contact/contact.js")
const { Validation } = require("../src/patient/patient");
const {
    createRec,
    getRec,
    updateRec,
    deleteRec,
    getpatientdetails,
    updatedeviceRec
} = require("../src/patient/controller");
const { create, remove, getReadingsRecord } = require("../src/common/readings")
const { getAlertsRecord } = require("../src/common/alert")
const { activity } = require("../src/user/activities")
const { authenticateJWT } = require("../src/middleware/middleware");
const { addrecord } = require("../src/common/records");
router.post("/create/", authenticateJWT, Validation, activity, createRec);

router.get("/get/", getRec);

router.put("/update/", updateRec);
router.put("/updatedevicedetails", updatedeviceRec)
router.delete("/delete/", deleteRec);
router.post("/contact", authenticateJWT, activity, async(req, res) => {
    try {
        const __action = req.body.__action;
        const processFunction = processFun(__action);
        const contactBody = req.body.body || {};
        contactBody.refrectype = config.patient.rectype;
        const result = await processFunction(contactBody);
        res.status(200).json({ status: "Success", results: result });
    } catch (error) {
        res.status(400).json({ status: "Error :", error: error });
    }
})
router.get("/contact/get", getcontactRec);
router.get("/details/", getpatientdetails);
router.post("/records/", addrecord)

router.post("/createreadings", create)
router.delete("/remove/", remove)
router.get("/readings", getReadingsRecord)
router.get("/alerts", getAlertsRecord)


module.exports = router;