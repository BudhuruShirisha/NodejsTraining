const config = require("../config/app.sepc.json");
const {
    createRecord,
    updateRecord,
    deleteRecord,
    getRecord,
} = require("../db/mongodb");
const { Utils } = require("../common/utils");
const utils = new Utils();
//creating the patient record 
async function createRec(req, res) {
    try {
        req.body.rectype = config.patient.rectype;
        const patientInfo = await createRecord(req.body);
        res.status(200).json({ status: "Success", results: patientInfo });
    } catch (error) {
        res.status(400).json({ status: "Error :", error: error });
    }
}

//getRec is to get the patient record
async function getRec(req, res) {
    try {
        const { query } = req;
        const payload = query;
        payload.rectype = config.patient.rectype;
        const patientInfo = await getRecord(payload);
        res.status(200).json({ status: "Success", results: patientInfo });
    } catch (error) {
        res.status(400).json({ status: "Error :", error: error });
    }
}

//updateRec is to update the patient record   
async function updateRec(req, res) {
    try {
        const { query } = req;
        const payload = query;
        payload.rectype = config.patient.rectype;
        payload.body = req.body;
        if (req.body.status == config.common.status.inactive) {
            req.body.dateinactivate = utils.getCurrentDateTime();
        }
        const patientInfo = await updateRecord(payload);
        res.status(200).json({ status: "Success", results: patientInfo });
    } catch (error) {
        res.status(400).json({ status: "Error :", error: error });
    }
}
//deleteRec is to delete patient record
async function deleteRec(req, res) {
    try {
        const { query } = req;
        const payload = query;
        payload.rectype = config.patient.rectype;
        const patientInfo = await deleteRecord(payload);
        res.status(200).json({ status: "Success", results: patientInfo });
    } catch (error) {
        res.status(400).json({ status: "Error :", error: error });
    }
}
//exporting functions
module.exports = {
    createRec,
    getRec,
    updateRec,
    deleteRec,
};