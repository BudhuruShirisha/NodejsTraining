const reader = require("xlsx");
const axios = require("axios");
const { off } = require("../../routers/user");
const api = "http://localhost:5000/";


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
//get organization name and id
async function getOrganizationnameandid() {

    try {

        const orgRec = await getOrganizationrecord();
        const orgInfo = {};
        orgRec.map((userObj) => {
            const { name, id } = userObj;
            orgInfo[id] = name;
        })
        return orgInfo;
    } catch (error) {
        console.log(error);
    }
}
//get patientInfo  
async function getpatient() {
    try {
        const patientRecord = await axios.get(
            api + "patient/get");
        const patientInfo = patientRecord.data.results;
        return patientInfo;
    } catch (err) {
        console.log(err)
    }
}
//get contact data
async function getcontactData() {
    try {
        const contactRec = await axios.get(
            api + "patient/contact/get");
        const contactInfo = contactRec.data.results;
        return contactInfo;
    } catch (err) {
        console.log(err)
    }
}

function parsecontactData(contactInfo) {
    try {
        var contactparams = {};
        contactInfo.map((userObj) => {
            const { refid, address, phone, email } = userObj
            if (!contactparams[refid]) contactparams[refid] = {};
            if (address) contactparams[refid]["address"] = address;
            if (phone) contactparams[refid]["phone"] = phone;
            if (email) contactparams[refid]["email"] = email;
        });
        return contactparams;
    } catch (err) {
        console.log(err)
    }
}
//get dumpparams
function getDumpParams() {
    return new Promise(async(resolve, reject) => {
        try {
            const [patientInfo, contactData, orgData] = await Promise.all([getpatient(), getcontactData(), getOrganizationnameandid()])
            const contactdata = parsecontactData(contactData)
            const dumpParams = patientInfo.map(async(userObj) => {
                const { orgid, id, title, firstname, lastname, age, dob, gender } = userObj;
                const officename = orgData[orgid];
                if (!contactdata[id]) throw "contact not found "
                const { address: { line1, line2, city, state, zip }, email, phone } = contactdata[id];
                addressparams = line1 + "," + line2 + "," + city + "," + state + "," + zip;
                const dataParams = { title, firstname, lastname, age, dob, gender, officename, email, phone, address: addressparams }
                return dataParams;
            })
            Promise.all(dumpParams).then((results) => {
                resolve(results);
            })
        } catch (err) {
            console.log(err);
            reject(err)
        }
    })
}

function createxlsheet(dataParams) {
    const sheet = reader.utils.json_to_sheet(dataParams); //json data to excel sheet format
    const newbook = reader.utils.book_new(); // create a new excel sheet
    reader.utils.book_append_sheet(newbook, sheet, "patient") //apppend data to sheet
    reader.writeFile(newbook, 'newsheet.xlsx');
}
async function start() {
    try {
        const dataParams = await getDumpParams();
        createxlsheet(dataParams);
    } catch (err) {
        console.log(err);
    }
}
start();