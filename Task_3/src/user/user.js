const Schema = require("validate");
const config = require("../config/app.sepc.json")

const User = new Schema({
    rectype: { type: String },
    orgid: { type: String },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    gender: { type: String, enum: config.common.gender, required: true },
    dob: { type: String, required: true },
    status: { type: String, enum: [config.common.status.active, config.common.status.inactive] },
    inactivereason: { type: String },
    created: { type: Date },
    data: {}
});

async function Validation(req, res, next) {
    const {
        body: {
            rectype,
            orgid,
            firstname,
            lastname,
            gender,
            dob,
            status,
            inactivereason,
            created,
            data
        }
    } = req
    const userData = {
        rectype,
        orgid,
        firstname,
        lastname,
        gender,
        dob,
        status,
        inactivereason,
        created,
        data
    }

    //checking the validate conditions
    let errors = User.validate(userData);
    if (errors.length) {
        errors = errors.map((errdata) => { return { path: errdata.path, message: errdata.message }; })
        res.send(errors);
    } else next();
}
module.exports = { Validation };