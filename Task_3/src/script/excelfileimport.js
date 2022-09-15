const reader = require("xlsx");
const fetch = require("node-fetch");
const axios = require("axios");
const config = require("../config/app.sepc.json");
const api = "http://localhost:5000/";
const { getJsDateFromExcel } = require("excel-date-to-js");
const { isLeapYear } = require("date-and-time");

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

// get Organization name and id 
async function getOrganizationnameandid(dataParams) {

    try {
        const office = [];
        dataParams.map((userObj) => {
            if (!office.includes(userObj.name)) {
                office.push(userObj.name);
            }
        })
        const orgRec = await getOrganizationrecord();
        const list = [];
        orgRec.map((userObj) => {
            const { name, id } = userObj;
            list.push({ name, id });
        })
        office.map(async(name) => {
            const Data = list.find(x => x.name === name)
            if (!Data) {
                const params = {
                    code: name.replace(' ', '_'),
                    type: config.organization.type[
                        Math.floor(Math.random() * config.organization.type.length)
                    ],
                    status: "active",
                    name
                };
                const orgRecordInfo = await axios.post(api + "organization/create", params);
                const orgRecordData = orgRecordInfo.data.results;
                const {
                    id
                } = orgRecordData;
                list.push({ name, id })
            }
        })
        return list;
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
function processRecords(userRecord, token, orgData) {
    return new Promise(async(resolve, reject) => {
        try {
            const Data = orgData.find(x => x.name === userRecord.name)
            if (Data) {
                id = Data.id
            }
            const patientRecord = await createPatient(userRecord.patient, id, token);
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

        const patientPromises = userList.map((userRecord) => {
            return processRecords(userRecord, token, orgData);
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