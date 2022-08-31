const fetch = require("node-fetch")
const axios = require('axios')
const datechange = require("date-and-time");
const config = require("../config/app.sepc.json")
const api = "http://localhost:5000";

async function Start(count) {
    try {
        const users = await getUserData(count);
        const userData = users.results;
        const userList = [];
        userData.forEach(userObj => {
            userList.push(parsingData(userObj));
        });
        const token = await setauthorization();
        const recordInfo = userList.map(async(userObj) => {
            const patientInfo = await createPatient(userObj.patient, token);
            const contactInfo = await createcontact(patientInfo.id, userObj.contact);
            return contactInfo;
        });
        Promise.all(recordInfo).then((result) => {
            console.log(result);
            return result;
        });
    } catch (err) {
        console.log(err)
    }
}
//getUserData is  to get randomuser data
async function getUserData(count) {
    try {
        const url = "https://randomuser.me/api/?results="
        const res = await fetch(url + count);
        const users = await res.json();
        return users;

    } catch (error) {
        console.log(error)
    }
}
//parsing randomuser data
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
    const data = {
        line1: number,
        line2: name,
        city,
        state,
        zip: postcode
    }
    const dob = datechange.format((new Date(date)), 'YYYY-MM-DD');
    const responseData = {
        patient: { gender, firstname, lastname, title, dob, age, },
        contact: { data, email, phone }
    };
    return responseData;
}
//get token 
async function setauthorization() {
    try {
        const user = {
            username: "budhuruShirisha",
            password: "Siri@6789"
        }
        const tokenInfo = await axios.post(api + "/user/login", user)
        return tokenInfo.data.results;
    } catch (error) {
        console.log("error");
    }
}

// get random organizationId
async function getRandomOrgId() {
    try {
        const orgRec = await axios.get(api + "/organization/get")
        const orgdata = orgRec.data.results;
        const random = orgdata[Math.floor(Math.random() * orgdata.length)];
        return random.id;
    } catch (err) { console.log("err2") }
}
//create patient Record
async function createPatient(patientParams, token) {
    try {
        patientParams.orgid = await getRandomOrgId();
        patientParams.status = "active";
        const patientRec = await axios.post(api + "/patient/create", patientParams, {
            headers: { Authorization: `Bearer ${token}` },
        })
        return patientRec.data.results;
    } catch (error) {
        console.log("error.response");
    }
}

//create Contact Record
async function createcontact(refid, contactparams) {
    try {
        const contactList = [];
        if (contactparams.data) {
            const addressparams = { body: { refid, type: "address", subtype: "work", data: contactparams.data }, __action: "addAddress" };
            const contactRec = await axios.post(api + "/patient/contact", addressparams)
            contactList.push(contactRec.data.results);
        }
        if (contactparams.email) {
            const emailparams = { body: { refid, type: "email", subtype: "primary", data: contactparams.email }, __action: "addEmail" };
            const contactRec = await axios.post(api + "/patient/contact", emailparams)
            contactList.push(contactRec.data.results);

        }
        if (contactparams.phone) {
            const phoneparams = { body: { refid, type: "phone", subtype: "personal", data: contactparams.phone }, __action: "addPhone" };
            const contactRec = await axios.post(api + "/patient/contact", phoneparams)
            contactList.push(contactRec.data.results);
        }
        return contactList;
    } catch (err) {
        console.log(err)
    }
}
Start(2)