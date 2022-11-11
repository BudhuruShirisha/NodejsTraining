const Schema = require("validate");
const config = require("../config/app.sepc.json")
const { createRecord, getRecord, deleteRecord } = require("../db/mongodb")
const { Utils } = require("../common/utils");
const utils = new Utils();
let datavalues = {};
const readingsSchema = new Schema({

    rectype: { type: String },
    orgid: { type: String },
    refid: { type: String },
    refrectype: { type: String },
    created: { type: String },
    data: {}
})

function validation(params) {

    const { refid, rectype, refrectype, data } = params
    const Data = { refid, refrectype, rectype, data }
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
// generate alerts from reading data
async function generateAlert(readingsobject) {
    try {
        const { id, refid, type, effectiveDateTime, data: { component, valueQuantity }, } = readingsobject;
        validation(readingsobject)
        const patientparams = { id: refid, rectype: config.patient.rectype }
        const patientRecord = await getRecord(patientparams)
        if (!patientRecord.length) throw `${rectype} is not found`
        const {
            orgid,
            data: { devices }
        } = patientRecord[0];

        const devicetype = [];
        if (config.readings.type[0] == type) {
            devicetype.push({ type: config.alert.systolic, min: sys.min, max: sys.max, value: value1 })
            devicetype.push({ type: config.alert.diastolic, min: dia.min, max: dia.max, value: value2 })
            const { bp: { sys, dia } } = devices;
            const [{ valueQuantity: { value: value1 } }, { valueQuantity: { value: value2 } }] = component;
        } else {
            const { value } = valueQuantity
            const { min, max } = devices[type];
            devicetype.push({ type, min, max, value })
        }
        for (let i = 0; i < devicetype.length; i++) {
            const { type, min, max, value } = devicetype[i]
            const params = { value, min, max }
            datavalues = utils.getFlaglLimitDiff(params);
            if (datavalues.flag) {
                const { flag, limitDiff, otherdata } = datavalues;
                const alertparams = {
                    refid,
                    orgid,
                    refrectype: config.patient.rectype,
                    data: {
                        isaddressed: "false",
                        timestamp: effectiveDateTime,
                        flag,
                        limitDiff,
                        otherdata,
                        readingrefid: id,
                        type
                    }
                }
                await create(alertparams)
            }
        }

    } catch (err) {
        console.log(err)
    }
}
// create alert record
async function create(alertParams) {
    try {
        alertParams.rectype = config.alert.rectype;
        const alertInfo = await createRecord(alertParams);
        console.log(alertInfo);
    } catch (error) {
        throw error;
    }
}
//remove alert record
async function remove(readingsobject) {
    const { id } = readingsobject
    const params = { rectype: config.alert.rectype, refid: id }
    const alertsInfo = await getRecord(params);
    console.log(alertsInfo)
    if (alertsInfo.length) {
        const { id } = alertsInfo[0];
        const alertParams = { id, rectype: config.alert.rectype }
        await deleteRecord(alertParams);
    }
}
async function getAlertsRecord(req, res) {
    try {

        const { query: { refid, startdate, enddate } } = req;
        const payload = { refid, rectype: config.alert.rectype }
        const readingsrec = await getRecord(payload)
        let arr = [];
        readingsrec.map((element) => {
            const { data: { timestamp } } = element;
            console.log(timestamp, startdate, enddate)
            if (startdate < timestamp && timestamp < enddate) {
                arr.push(element)
            }
        })
        console.log(arr)
        res.status(200).json({ status: "success:", results: arr })
    } catch (error) {
        res.status(400).json({ status: "Error:", error: error })
    }
}

module.exports = { generateAlert, remove, getAlertsRecord }