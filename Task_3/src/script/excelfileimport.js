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
        office,
        dob,
        age,
        gender,
        email,
        phone,
        address
    } = obj;
    const dobformat = getJsDateFromExcel(dob).toISOString().split('T')[0]
    const params = address.split(",");
    const data = {
        line1: params[0],
        line2: params[1],
        city: params[2],
        state: params[3],
        zip: params[4]
    }
    const responseData = {
        patient: { gender, firstname, lastname, title, dob: dobformat, age, },
        contact: { data, email, phone },
        name: office,
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

// get Organization id
async function getOrganizationId(name) {
    try {
        const orgRecordInfo = await axios.get(api + "organization/get", { params: { name } });
        const orgRecordData = orgRecordInfo.data.results;

        if (orgRecordData.length) {
            return orgRecordData[0].id;
        } else {
            const params = { code: "0045", type: "backoffice", name, status: "active" };
            const orgRecordInfo = await axios.post(api + "organization/create", params);
            const orgRecordData = orgRecordInfo.data.results;
            return orgRecordData.id;
        }
    } catch (error) {
        console.log(error.response.data);
    }
}

//create patient record 
async function createPatient(patientParams, name, token) {
    try {
        patientParams.orgid = await getOrganizationId(name);
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
        return contactRec;
    } catch (err) {
        console.log(err);
    }
}
//create patient and contact record
function processRecords(userRecord, token) {
    return new Promise(async(resolve, reject) => {
        try {
            const patientRecord = await createPatient(userRecord.patient, userRecord.name, token);

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