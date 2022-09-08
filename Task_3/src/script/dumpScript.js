const reader = require("xlsx");
const axios = require("axios");
const api = "http://localhost:5000/";
//get the required patientdata
async function getPatientData() {
    return new Promise(async(resolve, reject) => {
        try {
            const patientInfo = await getpatient();
            const Data = patientInfo.map(async(userObj) => {
                const { orgid, id, title, firstname, lastname, age, dob, gender } = userObj;
                const officename = await getOrganizationname(orgid);
                const contactInfo = await getcontact(id);
                const { email, phone, address } = contactInfo
                const addressparams = address["line1"] + "," + address["line2"] + "," + address["city"] + "," + address["state"] + "," + address["zip"]
                const dataParams = { title, firstname, lastname, age, dob, gender, officename, email, phone, address: addressparams }
                return dataParams;
            });
            Promise.all(Data).then((results) => {
                resolve(results);
            })
        } catch (err) {
            console.log(err);
            reject(err)
        }
    })
}
//get organization name from givenid
async function getOrganizationname(id) {
    try {
        const orgRecordInfo = await axios.get(api + "organization/get", { params: { id } });
        const orgRecordData = orgRecordInfo.data.results;
        return orgRecordData[0].name;
    } catch (err) {
        console.log(err)
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
//get contactInfo 
async function getcontact(refid) {
    try {
        const contactRec = await axios.get(
            api + "patient/contact/get", { params: { refid } });
        const contactInfo = contactRec.data.results;
        const contactparams = {};
        if (contactInfo.length) {
            contactInfo.map((userObj) => {
                if (userObj.address) contactparams["address"] = userObj.address;
                if (userObj.phone) contactparams["phone"] = userObj.phone;
                if (userObj.email) contactparams["email"] = userObj.email;
            });
        }
        return contactparams;
    } catch (err) {
        console.log(err)
    }
}

async function start() {
    try {
        const dataParams = await getPatientData();
        const sheet = reader.utils.json_to_sheet(dataParams); //json data to excel sheet format
        const newbook = reader.utils.book_new(); // create a new excel sheet
        reader.utils.book_append_sheet(newbook, sheet, "patient") //apppend data to sheet
        reader.writeFile(newbook, 'newsheet.xlsx');
    } catch (err) {
        console.log(err);
    }
}
start();