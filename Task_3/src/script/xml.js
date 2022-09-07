const reader = require("xlsx");
const fetch = require("node-fetch");
const axios = require("axios");
const config = require("../config/app.sepc.json");
const api = "http://localhost:5000/";
const { getJsDateFromExcel } = require("excel-date-to-js");

function getxmlData() {
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
        dob,
        age,
        gender,
        email,
        phone,
        address
    } = obj;
    // console.log(obj)
    const dobformat = getJsDateFromExcel(dob).toISOString().split('T')[0]
    const params = address.split(",");
    const data = {
            line1: params[0],
            line2: params[1],
            city: params[2],
            state: params[3],
            zip: params[4]
        }
        //const dob = datechange.format((new Date(date)), 'YYYY-MM-DD');

    const responseData = {
        patient: { gender, firstname, lastname, title, dob: dobformat, age, },
        contact: { data, email, phone }
    };
    return responseData;
}

//get token from user data
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

//getOrganizationRecord used to get Organization Record
async function getOrganizationRandomId() {
    try {
        const orgRecordInfo = await axios.get(api + "organization/get");
        const orgRecordData = orgRecordInfo.data.results;
        const orgData = await orgRecordData[
            Math.floor(Math.random() * orgRecordData.length)
        ];
        return orgData.id;
    } catch (error) {
        console.log(error);
    }
}

//createPatient used to create patient record with patient create api
async function createPatient(patientParams, token) {
    try {
        patientParams.orgid = await getOrganizationRandomId();
        patientParams.status = config.common.status.active;
        const patientRecord = await axios.post(
            api + "patient/create",
            patientParams, {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        // console.log("patientRecord", patientRecord.data.results)
        return patientRecord.data.results;
    } catch (error) {
        console.log(error);
    }
}

//createContact used to create contact record with patient contact api

async function createcontact(refid, contactparams, token) {
    try {

        const contactRec = [];
        if (contactparams.data) {
            const addressparams = { body: { refid, type: "address", subtype: "work", data: contactparams.data }, __action: "addAddress" };
            const contactData = await axios.post(api + "patient/contact", addressparams, {
                headers: { Authorization: `Bearer ${token}` },
            });
            contactRec.push(contactData.data.results);
        }
        if (contactparams.email) {
            const emailparams = { body: { refid, type: "email", subtype: "primary", data: contactparams.email }, __action: "addEmail" };
            const contactData = await axios.post(api + "patient/contact", emailparams, {
                headers: { Authorization: `Bearer ${token}` },
            });
            contactRec.push(contactData.data.results)
        }
        if (contactparams.phone) {
            const phoneparams = { body: { refid, type: "phone", subtype: "personal", data: contactparams.phone }, __action: "addPhone" };
            const contactData = await axios.post(api + "patient/contact", phoneparams, {
                headers: { Authorization: `Bearer ${token}` },
            });
            contactRec.push(contactData.data.results);
        }
        //console.log(contactRec)
        return contactRec;
    } catch (err) {
        console.log(err);
    }
}

function processRecords(userRecord, token) {
    return new Promise(async(resolve, reject) => {
        try {
            const patientRecord = await createPatient(userRecord.patient, token);
            // console.log(patientRecord.id)
            const contactRecord = await createcontact(
                patientRecord.id, userRecord.contact, token
            );
            resolve(contactRecord);
        } catch (error) {
            reject(error);
        }
    });
}
//create patient record and contact record
async function start() {
    try {
        const userList = getxmlData();
        const size = 2;
        const token = await getToken();
        const patientPromises = userList.map((userRecord) => {
            return processRecords(userRecord, token);
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