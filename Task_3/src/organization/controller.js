const config = require("../config/app.sepc.json");
const {
    createRecord,
    getRecord,
    updateRecord,
    deleteRecord,
} = require("../db/mongodb.js");
const { Utils } = require("../common/utils");
const utils = new Utils();
//createRec the organization record
async function createRec(req, res) {
    try {
        req.body.rectype = config.organization.rectype;
        const orginfo = await createRecord(req.body);
        res.status(200).json({ status: "Success", results: orginfo });
    } catch (error) {
        res.status(400).json({ status: "Error :", error: error });
    }
}

//getRec is to get the organization record
async function getRec(req, res) {
    try {
        const { query } = req;
        const payload = query;
        payload.rectype = config.organization.rectype;

        const data = await getRecord(payload);
        res.status(200).json({ status: "Success", results: data });
    } catch (error) {
        res.status(400).json({ status: "Error :", error: error });
    }
}

//updateRec is to update the organization record
async function updateRec(req, res) {
    try {

        const { query } = req;
        const payload = query;
        payload.rectype = config.organization.rectype;
        payload.body = req.body;
        if (req.body.status == config.common.status.inactive) {
            req.body.dateinactivate = utils.getCurrentDateTime();
        }
        const data = await updateRecord(payload);
        res.status(200).json({ status: "Success", results: data });
    } catch (error) {
        res.status(400).json({ status: "Error :", error: error });
    }
}
//deleteRec is to delete the organization record
async function deleteRec(req, res) {
    try {
        const { query } = req;
        const payload = query;
        payload.rectype = config.organization.rectype;

        const data = await deleteRecord(payload);
        res.status(200).json({ status: "Success", results: data });
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