const fetch = require("node-fetch");
const axios = require("axios");
const datechange = require("date-and-time");
const config = require("../config/app.sepc.json");
const api = "http://localhost:5000/";

// get random user data
async function getUserData(count) {
    try {
        const url = "https://randomuser.me/api/?results=";
        const res = await fetch(url + count);
        const users = await res.json();
        return users.results;
    } catch (error) {
        console.log(error);
    }
}
// parsing random user data
function parsingData(params) {
    const {
        gender,
        name: { title, first: firstname, last: lastname },
        dob: { date, age },
        location: {
            street: { number, name },
            city,
            state,
            postcode
        },
        email,
        phone
    } = params
    const address = {
        line1: number,
        line2: name,
        city,
        state,
        zip: postcode
    }
    const dob = datechange.format((new Date(date)), 'YYYY-MM-DD');
    const responseData = {
        patient: { gender, firstname, lastname, title, dob, age, },
        contact: { address, email, phone }
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
        console.log(error);
    }
}

// get Organization randomid
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
// create patient record 
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
        console.log(patientRecord.data.results)
            //  console.log(patientRecord.data.results)
        return patientRecord.data.results;
    } catch (error) {
        console.log(error);
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
//processrecords to create patient and create contact
function processRecords(userRecord, token) {
    return new Promise(async(resolve, reject) => {
        try {
            const patientRecord = await createPatient(userRecord.patient, token);
            const contactRecord = await createcontact(patientRecord.id, userRecord.contact, token);
            resolve(contactRecord);
        } catch (error) {
            reject(error);
        }
    });
}
//main method 
async function start(count) {
    try {
        const userData = await getUserData(count);
        const userList = [];
        userData.forEach((userObj) => {
            userList.push(parsingData(userObj));
        });
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
start(10);