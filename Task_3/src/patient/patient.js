const Schema = require("validate");
const config = require('../config/app.sepc.json');
//patient schema
const patient = new Schema({
    rectype: { type: String },
    orgid: { type: String },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    nickname: { type: String },
    gender: { type: String, enum: config.common.gender, required: true },
    dob: { type: String, required: true },
    mrn: { type: String },
    ssn: { type: String },
    language: {
        type: String,
        enum: config.patient.language,
    },
    status: { type: String, enum: [config.common.status.active, config.common.status.inactive] },
    inactivereason: { type: String },
    dateinactivate: { type: String },
    created: { type: Date },
    createdby: { type: String },
    data: {}
});

function Validation(req, res, next) {
    const {
        body: {
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
            createdby
        }
    } = req;

    const patientData = {
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
        createdby
    };
    //checking the validate conditions 
    let errors = patient.validate(patientData);
    if (errors.length) {
        errors = errors.map((eRec) => {

            return { path: eRec.path, message: eRec.message };
        });
        res.send(errors);
    } else {
        next();
    }
}

module.exports = { Validation };