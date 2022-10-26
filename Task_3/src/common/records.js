const Schema = require("validate");
const config = require('../config/app.sepc.json');
const { getRecord } = require("../db/mongodb");
const { Utils } = require("../common/utils");
const { createRecord, updateRecord } = require("../db/mongodb")
const utils = new Utils();
const recordSchema = new Schema({
    rectype: { type: String },
    orgid: { type: String },
    refrectype: { type: String, enum: config.patient.rectype },
    refid: { type: String },
    recordmodelid: { type: String },
    type: { type: String, enum: [config.records.type.diagnosis, config.records.type.medication] },
    data: {}
})

function Validation(req) {
    const {
        refid,
        type,
        data: {},
    } = req;
    const responsedata = {
        refid,
        type,
        data: {}
    };
    //checking the validate conditions
    let errors = recordSchema.validate(responsedata);
    if (errors.length) {
        errors = errors.map((eRec) => {
            return { path: eRec.path, message: eRec.message };
        });
        throw errors[0].message;
    } else {
        return true;
    }
}
async function addrecord(req, res) {
    try {
        Validation(req.body)
        const { type, recordmodelid, refid, data } = req.body;
        let params = { type, recordmodelid, refid, data }
        const patientparams = { rectype: config.patient.rectype, id: refid }
        params.orgid = await utils.getRecOrgId(patientparams)

        const recparams = { rectype: config.recordmodels.rectype, id: recordmodelid }
        const details = await getRecord(recparams)

        const { data: modeldata, type: recmodeltype } = details[0];
        if (type != recmodeltype) throw "invalid type"
        const validateparams = { modeldata, data }

        const reckeys = utils.validatedatainrecord(validateparams)
        params.data = reckeys;
        params.rectype = config.records.rectype;
        const info = await createRecord(params)

        res.status(200).json({ status: "Success", results: info });
    } catch (error) {
        console.log(error)
        res.status(400).json({ status: "Error :", error: error });
    }
}
async function updatePatientRec(req, res) {
    try {
        const { query } = req;
        const payload = query;
        payload.rectype = config.records.rectype;
        payload.body = req.body;
        const orginfo = await updateRecord(payload);
        res.status(200).json({ status: "Success", results: orginfo });
    } catch (error) {
        res.status(400).json({ status: "Error :", error: error });
    }
}
async function deletePatientRec(req, res) {
    try {
        const { query } = req;
        const payload = query;
        payload.rectype = config.record.rectype;
        const orginfo = deleteRecord(payload)
        res.status(200).json({ status: "Success", results: orginfo });
    } catch (error) {
        res.status(400).json({ status: "Error :", error: error });
    }
}
module.exports = { addrecord, updatePatientRec, deletePatientRec };