const Schema = require("validate");
const datechange = require("date-and-time")
const patient = new Schema({
    rectype: {
        type: String,
        required: true
    }, // patient
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    gender: { type: String, enum: ["male", "female", "others"], required: true },
    dob: { type: String, required: true },
    language: {
        type: String,
        enum: ["english", "urdu", "hindi", "telugu", "japan"],
        required: true
    },
    status: { type: String, enum: ["active", "inactive"], required: true },
    orgid: {
        type: Number
    }
});


function Validation(req, res, next) {
    const {
        body: {
            orgid,
            rectype,
            firstname,
            lastname,
            nickname,
            gender,
            dob,
            mrn,
            ssn,
            language,
            status,
            inactivereason,
            dateinactivate,
            data,
        },
    } = req;
    const created = new Date();

    const responseData = {
        orgid,
        rectype,
        firstname,
        lastname,
        nickname,
        gender,
        dob,
        mrn,
        ssn,
        language,
        status,
        inactivereason,
        dateinactivate,
        created,
        data,
    };

    req.data = responseData.created;
    //check validate conditions and send next() otherwise send error
    const error = patient.validate(responseData);
    console.log(error);
    if (error == null || error.length === 0) {
        next();
    } else {
        console.log("error");
        res.send("error");
    }
}

module.exports = { Validation };