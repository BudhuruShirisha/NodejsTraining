const reader = require("xlsx");
const fetch = require("node-fetch");
const axios = require("axios");
const config = require("../config/app.sepc.json");
const api = "http://localhost:5000/";
const { getJsDateFromExcel } = require("excel-date-to-js");

function getxlsxData() {
    const file = reader.readFile("./data.xlsx");
    const userList = [];
    const sheets = file.SheetNames
    for (i = 0; i < sheets.length; i++) {
        const data = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]])
        data.forEach((userObj) => {
            userList.push(parsingData(userObj));
        });
    }

    return userList;
}
//parseUserRecord used to parse random user data
function parsingData(obj) {
    const {
        title,
        firstname,
        lastname,
        office,
        dob,
        age,
        gender,
        email,
        phone,
        address
    } = obj;
    const dobformat = getJsDateFromExcel(dob).toISOString().split('T')[0]
    const [line1, line2, city, state, zip] = address.split(",");

    const data = {
        line1,
        line2,
        city,
        state,
        zip
    }
    const responseData = {
        patient: { gender, firstname, lastname, title, dob: dobformat, age, },
        contact: { address: data, email, phone },
        officename: office,
    };

    return responseData;
}

//get token
async function getToken() {
    try {
        const user = {
            username: "Shirisha",
            password: "Siri@1234",
        };
        const tokenInfo = await axios.post(api + "user/login", user);
        return tokenInfo.data.results;
    } catch (error) {
        console.log("error");
    }
}

// get Organization name and id 
async function getOrganizationnameandid(users) {
    try {
        const orgRec = await getOrganizationrecord();
        const existingOffices = {};
        orgRec.map((userObj) => {
            const { name, id } = userObj;
            existingOffices[name] = id;
        });
        const officestocreate = [];
        users.map((userObj) => {
            const { officename } = userObj;
            if (!existingOffices[officename] && !officestocreate.includes(officename)) officestocreate.push(officename);

        });
        const officePromises = officestocreate.map((name) => {
            return createOrganizationRecord(name);
        })
        await Promise.all(officePromises);
        const orgRecData = await getOrganizationrecord();
        return orgRecData;

    } catch (error) {
        console.log(error);
    }
}
//create
function createOrganizationRecord(name) {
    try {
        const orgparams = {
            code: name.replace(" ", "_"),
            name,
            type: config.organization.type[
                Math.floor(Math.random() * config.organization.type.length)
            ],
            status: config.common.status.active
        }
        const orgRecordInfo = axios.post(api + "organization/create", orgparams);
        return orgRecordInfo;

    } catch (error) {
        console.log(error);
    }
}
//get organization record
async function getOrganizationrecord() {
    try {
        const orgRecordInfo = await axios.get(api + "organization/get");
        const orgRecordData = orgRecordInfo.data.results;
        return orgRecordData;
    } catch (error) {
        console.log(error);
    }
}
//create patient record 
async function createPatient(patientParams, id, token) {
    try {
        patientParams.orgid = id;
        patientParams.status = config.common.status.active;
        const patientRecord = await axios.post(
            api + "patient/create",
            patientParams, {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return patientRecord.data.results;
    } catch (error) {
        console.log("error");
    }
}
// create contact record 
async function createcontact(refid, contactparams, token) {
    try {
        const contactRec = [];
        if (contactparams.address) {
            const addressparams = { body: { refid, type: "address", subtype: "work", address: contactparams.address }, __action: "addAddress" };
            const contactData = await axios.post(api + "patient/contact", addressparams, {
                headers: { Authorization: `Bearer ${token}` },
            });
            contactRec.push(contactData.data.results);
        }
        if (contactparams.email) {
            const emailparams = { body: { refid, type: "email", subtype: "primary", email: contactparams.email }, __action: "addEmail" };
            const contactData = await axios.post(api + "patient/contact", emailparams, {
                headers: { Authorization: `Bearer ${token}` },
            });
            contactRec.push(contactData.data.results)
        }
        if (contactparams.phone) {
            const phoneparams = { body: { refid, type: "phone", subtype: "personal", phone: contactparams.phone }, __action: "addPhone" };
            const contactData = await axios.post(api + "patient/contact", phoneparams, {
                headers: { Authorization: `Bearer ${token}` },
            });
            contactRec.push(contactData.data.results);
        }
        return contactRec;
    } catch (err) {
        console.log(err);
    }
}
//create patient and contact record
function processRecords(userRecord, token, officeData) {
    return new Promise(async(resolve, reject) => {
        try {
            const orgid = officeData[userRecord.officename];
            const patientRecord = await createPatient(userRecord.patient, orgid, token);
            const contactRecord = await createcontact(patientRecord.id, userRecord.contact, token);
            resolve(contactRecord);
        } catch (error) {
            reject(error);
        }
    });
}
//main method

async function start() {
    try {
        const userList = getxlsxData();
        const orgData = await getOrganizationnameandid(userList)
        const size = 2;
        const token = await getToken();
        const officeNameMapping = {};
        orgData.forEach((office) => {
            const { id, name } = office;
            officeNameMapping[name] = id;
        });
        const patientPromises = userList.map((userRecord) => {

            return processRecords(userRecord, token, officeNameMapping);
        });
        for (i = 0; i < patientPromises.length; i = i + size) {
            const recordData = patientPromises.slice(i, i + size);
            Promise.all(recordData).then((result) => {
                console.log("res", result);
            });
        }
    } catch (error) {
        console.log(error);
    }
}
start();