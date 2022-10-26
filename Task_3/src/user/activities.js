const Schema = require("validate");
const config = require("../config/app.sepc.json")
const { createRecord } = require("../db/mongodb")
const actschema = new Schema({
    userid: { type: String, required: true },
    orgid: { type: String, required: true },
    path: { type: String, required: true },
    method: { type: String, required: true },
    token: { type: String, required: true }
})

function validation(validateparams) {
    const {
        userid,
        orgid,
        path,
        method,
        token
    } = validateparams
    const responsedata = {
        userid,
        orgid,
        path,
        method,
        token

    };
    //checking the validate conditions
    let errors = actschema.validate(responsedata);
    if (errors.length) {
        errors = errors.map((eRec) => {
            return { path: eRec.path, message: eRec.message };
        });
        throw errors[0].message;
    } else {
        return true;
    }
}
async function activity(req, res, next) {
    try {
        console.log(req.body)
        const {
            originalUrl,
            headers: { authorization },
            body: { __action },
            method,
            session: { orgid, userid },
            body,

        } = req
        const bodyparams = {
            rectype: config.activitylog.rectype,
            userid,
            orgid,
            path: originalUrl,
            method,
            token: authorization,
            payload: body

        }
        if (body.__action) {
            bodyparams.__action = __action;
            bodyparams.payload = body.body;
        }
        // console.log(bodyparams)
        validation(bodyparams);
        const rec = await createRecord(bodyparams)
        next();
    } catch (err) {
        //res.status(400).json({ status: "Error :", error: err });
        console.log(err)
        throw err;
    }
}
module.exports = { activity }