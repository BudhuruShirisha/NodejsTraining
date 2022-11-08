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
        const { refid, type, value1, refrectype, value2, data: { effectiveDateTime } } = req.body;
        validation(req.body)
        const orgparams = { rectype: config.patient.rectype, id: refid };
        orgid = await utils.getRecOrgId(orgparams);
        const payload = { refid, type, orgid, data: { component: [], valueQuantity: {} }, rectype: config.readings.rectype, refrectype: config.patient.rectype, data: { effectiveDateTime } }
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
            /* const patientparams = { id: refid, rectype: config.patient.rectype }
        const patientRecord = await getRecord(patientparams)
        const {
            orgid,
            data: { devices }
        } = patientRecord[0];
        const alertparams = { refid, orgid, refrectype: config.patient.rectype }

        if (config.readings.type[0] == type) {
            const { bp: { sys, dia }, glucose, weight } = devices;
            alertparams.bp = devices[type]
            if (sys.min > value1 < sys.max) {
                alertparams.type = config.alert.systolic;
                generatealert(alertparams)
            }
            if (dia.min > value2 < dia.max) {
                alertparams.type = config.alert.diastolic
                console.log("alert1")
            }
        }
 */
        res.status(200).json({ status: "Success", results: readingsinfo });
    } catch (error) {
        console.log(error)
        res.status(400).json({ status: "Error :", error: error });
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

module.exports = { create, remove }