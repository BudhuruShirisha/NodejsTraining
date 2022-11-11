const Schema = require("validate");
const config = require("../config/app.sepc.json")
const { createRecord, getRecord, deleteRecord } = require("../db/mongodb")
const { generateAlert } = require("../common/alert")
const { Utils } = require("../common/utils");

const utils = new Utils();
const readingsSchema = new Schema({
    id: { type: String },
    rectype: { type: String },
    orgid: { type: String },
    refid: { type: String, required: true, },
    refrectype: { type: String },
    type: {
        type: String,
        enum: config.readings.type, //[bp, glucose, pulse, oxygen, weight] 
        required: true,
    },

    data: {}

})

function validation(params) {
    const { refid, type, value1, refrectype, value2 } = params
    const Data = { refid, type, value1, refrectype, value2 }
    let errors = readingsSchema.validate(Data);
    if (errors.length) {
        errors = errors.map((eRec) => {
            return { path: eRec.path, message: eRec.message };
        });
        throw errors[0].message;
    } else {
        return true;
    }
}

async function create(req, res) {
    try {
        const { refid, type, value1, refrectype, value2, effectiveDateTime } = req.body;
        validation(req.body)

        const patientparams = { id: refid, rectype: config.patient.rectype }
        const patientRecord = await getRecord(patientparams)
        if (!patientRecord.length) throw `${ config.patient.rectype} is not found`
        const {
            data
        } = patientRecord[0];
        if (!data || !data.devices[type]) throw `${ config.patient.rectype} data or devicetype  is not found`
        const orgparams = { rectype: config.patient.rectype, id: refid };
        const orgid = await utils.getRecOrgId(orgparams);
        const payload = { refid, type, orgid, data: { component: [], valueQuantity: {} }, rectype: config.readings.rectype, refrectype: config.patient.rectype, effectiveDateTime }
            //checkingthe type is bp or not, if bp assign component data otherwise component data is empty
        if (config.readings.type[0] == (type)) {
            payload.data.component = [{
                    valueQuantity: {
                        value: value1,
                        unit: config.readings.units[type]
                    }
                },
                {
                    valueQuantity: {
                        value: value2,
                        unit: config.readings.units[type]
                    }
                }
            ]

        } else {
            payload.data.valueQuantity = {
                value: value1,
                unit: config.readings.units[type]
            }
        }
        const readingsinfo = await createRecord(payload);
        if (!readingsinfo) throw `${rectype} is not found`
        generateAlert(readingsinfo)
        console.log(readingsinfo.data)
        res.status(200).json({ status: "Success", results: readingsinfo });
    } catch (error) {
        console.log(error)
        res.status(400).json({ status: "Error :", error: error });
    }
}

async function getReadingsRecord(req, res) {
    try {
        const { query: { refid, startdate, enddate } } = req;
        const payload = { refid, rectype: config.readings.rectype }
        const readingsrec = await getRecord(payload)
        let arr = [];
        readingsrec.map((element) => {
            const { effectiveDateTime } = element;
            console.log(effectiveDateTime, startdate, enddate)
            if (startdate < effectiveDateTime && effectiveDateTime < enddate) {
                arr.push(element)
            }
        })
        res.status(200).json({ status: "success:", results: arr })
    } catch (error) {
        res.status(400).json({ status: "Error:", error: error })
    }
}










async function remove(req, res) {
    try {
        const { query } = req;
        const payload = query;
        payload.rectype = config.readings.rectype;
        const recordsInfo = await deleteRecord(payload);
        res.status(200).json({ status: "Success", results: recordsInfo });
    } catch (error) {
        res.status(400).json({ status: "Error :", error: error });
    }
}

module.exports = { create, remove, getReadingsRecord }