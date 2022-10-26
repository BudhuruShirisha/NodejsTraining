const Schema = require("validate")
const config = require('../config/app.sepc.json');
const {
    createRecord,
    updateRecord,
    deleteRecord
} = require("../db/mongodb");
const recordmodelsSchema = new Schema({

    rectype: { type: String },
    orgid: { type: String },
    refrectype: { type: String, enum: config.organization.rectype },
    type: {
        type: String,
        required: true,
        enum: [config.records.type.diagnosis, config.records.type.medication]
    },
    data: {}
})

function recValidation(req) {
    const {
        orgid,
        type,
        data: {}
    } = req;

    const responsedata = {
        orgid,
        type,
        data: {}
    };
    //checking the validate conditions
    let errors = recordmodelsSchema.validate(responsedata);
    if (errors.length) {
        errors = errors.map((eRec) => {
            return { path: eRec.path, message: eRec.message };
        });
        throw errors[0].message;
    } else {
        return true;
    }
}
async function createOrgRecord(req, res) {
    try {
        recValidation(req.body)
        req.body.rectype = config.recordmodels.rectype;
        req.body.createdby = req.session.id;
        const orginfo = await createRecord(req.body);
        res.status(200).json({ status: "Success", results: orginfo });
    } catch (error) {
        res.status(400).json({ status: "Error :", error: error });
    }
}
async function updateOrgRecord(req, res) {
    try {
        const { query } = req;
        const payload = query;
        payload.rectype = config.recordmodels.rectype;
        payload.body = req.body;
        const orginfo = await updateRecord(payload);
        res.status(200).json({ status: "Success", results: orginfo });
    } catch (error) {
        res.status(400).json({ status: "Error :", error: error });
    }
}
async function deleteOrgRecord(req, res) {
    try {
        const { query } = req;
        const payload = query;
        payload.rectype = config.recordmodels.rectype;
        const orginfo = deleteRecord(payload)
        res.status(200).json({ status: "Success", results: orginfo });
    } catch (error) {
        res.status(400).json({ status: "Error :", error: error });
    }
}

module.exports = { createOrgRecord, updateOrgRecord, deleteOrgRecord };