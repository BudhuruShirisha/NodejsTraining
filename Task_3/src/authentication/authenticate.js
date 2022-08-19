const Schema = require("validate");
const { Utils } = require("../common/utils");
const config = require("../config/app.sepc.json");
const {
    createRecord,
    getRecord,
} = require("../db/mongodb");
const utils = new Utils();
const authenticate = new Schema({
    rectype: { type: String },
    orgid: { type: String },
    refrectype: {
        type: String,
        enum: config.user.rectype,
    },
    refid: { type: String, required: true },
    data: {
        username: { type: String },
        password: { type: String },
        required: true
    }

});
//validate 
async function authValidation(req, res, next) {
    const {
        body: {
            rectype,
            refid,
            refrectype,
            orgid,
            data: {
                username,
                password
            }
        }
    } = req

    //checking the validate conditions
    let errors = authenticate.validate(req.body);
    if (errors.length) {
        errors = errors.map((errdata) => { return { path: errdata.path, message: errdata.message }; })
        res.send(errors[0].message);
    } else next();
}
async function setAuth(payload) {
    try {
        const { refid, refrectype, data } = payload;
        data.password = await utils.getencrypted(data.password);
        const orgparams = { rectype: refrectype, id: refid };
        await getRecord(orgparams)
        if (refrectype == config.user.rectype) {
            const orgid = await utils.getRecOrgId(orgparams); //if rectype is patient then get organizationid
            payload.orgid = orgid;
        }
        payload.rectype = config.authenticate.rectype;
        const info = await createRecord(payload);
        return info;
    } catch (error) {
        throw error
    }
}




module.exports = { authValidation, setAuth }