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
        const { orgid, dob } = req.body;
        const orgparams = { id: orgid, rectype: config.organization.rectype, status: config.common.status.active }
        const orgdata = await getRecord(orgparams);

        if (!orgdata.length) { throw "invalid organization/inactive" }
        utils.validateDob(dob);
        req.body.createdby = req.session.userid;
        const officeparams = { orgid, userid: req.session.userid }
        await checkOffices(officeparams)
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

        const { query, } = req;
        const payload = query;
        payload.rectype = config.patient.rectype;

        const patientInfo = await getRecord(payload);
        /* const officedata = await offices(userid)
        const patientlist = [];
        patientInfo.map((element) => {
            const { orgid } = element;
            if (officedata.includes(orgid))
                patientlist.push(element)
        }) */
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
/* async function getpatientdetails(req, res) {
    const { query } = req;
    const payload = query;
    payload.rectype = config.patient.rectype;
    const patientInfo = await getRecord(payload);
    const { id, gender, firstname, lastname, age } = patientInfo[0];
    const contactparams = { refid: id, rectype: config.contact.rectype }
    const contactInfo = await getRecord(contactparams);
    const contactdata = {};
    contactInfo.map((userObj) => {
        const { refid, address, phone, email } = userObj;
        if (!contactdata[refid]) contactdata[refid] = {};
        if (address) contactdata[refid]["address"] = address;
        if (phone) contactdata[refid]["phone"] = phone;
        if (email) contactdata[refid]["email"] = email;
    });
    console.log(contactdata)
    const { address, email, phone } = contactdata[id];
    const details = { gender, firstname, lastname, age, address, email, phone }
    console.log("details", details)
} */

async function getpatientdetails(req, res) {
    try {
        const { query } = req;
        const payload = query;
        const patparams = { rectype: config.patient.rectype };
        const contparams = { rectype: config.contact.rectype };
        const orgparams = { rectype: config.organization.rectype }
        const [patientInfo, contactInfo, officeInfo] = await Promise.all([getRecord(patparams), getRecord(contparams), getRecord(orgparams)]);
        let patientData = await contactparseddata(patientInfo, contactInfo, officeInfo);
        if (payload.status) {
            patientData = patientData.filter(data =>
                data.active === payload.active
            )
        }
        if (payload.id) {
            patientData = patientData.find(data => data.id == payload.id)
        }
        res.status(200).json({ status: "Success", results: patientData });
    } catch (error) {
        res.status(400).json({ status: "Error :", error: error });
    }
}
async function contactparseddata(patientInfo, contactInfo, officeInfo) {
    return new Promise(async(resolve, reject) => {
        try {
            const data = patientInfo.map(async(userObj) => {
                const { id, orgid, gender, firstname, lastname, age, status, dob } = userObj;
                var contactparams = {};
                contactInfo.map((userObj) => {
                    const { refid, address, phone, email } = userObj;
                    if (refid == id) {
                        if (address) contactparams["address"] = address;
                        if (phone) contactparams["phone"] = phone;
                        if (email) contactparams["email"] = email;
                    }
                });
                let officeName;
                officeInfo.map((office) => {
                    const { id, name } = office;
                    if (orgid == id) {
                        officeName = name;
                    }
                });
                const { address, email, phone } = contactparams;
                const details = { id, gender, firstname, lastname, age, address, email, phone, status, dob, officeName }
                return details;
            })
            Promise.all(data).then((results) => {
                resolve(results)
            })
        } catch (err) {
            console.log(err)
        }
    })
}

async function offices(id) {
    const userparams = { id, rectype: config.user.rectype }
    const userinfo = await getRecord(userparams)
    const { offices } = userinfo[0];
    return offices;
}
async function checkOffices(params) {
    try {
        const { orgid, userid } = params;
        const getoffices = await offices(userid)
        if (!getoffices.includes(orgid))
            throw "office doesnt have access to create patient"
        else {
            return true;
        }
    } catch (err) {
        throw err;
    }
}

async function updatedeviceRec(req, res) {
    try {
        const { body: { id, data: { devices } } } = req;
        const payload = { id, rectype: config.patient.rectype, body: { data: { devices } } }

        const patientparams = { id, rectype: config.patient.rectype, }
        const recdata = await getRecord(patientparams);

        if (!recdata.length) throw `${rectype} record not found!`;
        if (recdata[0].data) {
            let { devices: recdevices } = recdata[0].data;
            if (recdevices) {
                Object.keys(recdevices).forEach((element) => {
                    if (devices[element])
                        console.log("ERfrfr", devices[element])
                    recdevices[element] = devices[element];
                    console.log("device", recdevices[element])
                })

                Object.keys(devices).forEach((element) => {
                    if (devices[element])
                        recdevices[element] = devices[element];
                });
                payload.body.data.devices = devices;
            }
        }

        // const patientInfo = await updateRecord(payload);
        //res.status(200).json({ status: "Success", results: patientInfo });
    } catch (error) {
        console.log(error)
        res.status(400).json({ status: "Error :", error: error });
    }
}

//exporting functions
module.exports = {
    createRec,
    getRec,
    updateRec,
    deleteRec,
    getpatientdetails,
    updatedeviceRec
};