const Schema = require("validate");
const { Utils } = require("./utils");
const config = require("../config/app.sepc.json");
const { addToken } = require("../common/token.js")
const {
    createRecord,
    getRecord,
    deleteRecord,
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
        username: {
            type: String,
            length: { min: 3, max: 24 },
            required: true
        },
        password: {
            type: String,
            required: true
        },
    }
});
//validate 
function authValidation(req, res, next) {
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
        data.password = utils.MD5(data.password);
        const userParams = { rectype: refrectype, id: refid, status: config.common.status.active }
        const userInfo = await getRecord(userParams);
        if (!userInfo.length) { throw "invalid/inactive user"; }
        const { orgid } = userInfo[0];
        payload.orgid = orgid;
        payload.rectype = config.authenticate.rectype;
        const params = { rectype: payload.rectype, refid }
        const authInfo = await getRecord(params);
        if (authInfo.length) {
            const { id } = authInfo[0];
            const authParams = { id, rectype: payload.rectype }
            await deleteRecord(authParams);
        }
        const AuthData = await createRecord(payload);
        return { message: "authentication successfull" }
    } catch (error) {
        throw error;
    }
}
async function validateAuth(payload) {
    try {
        const { username, password } = payload;
        rectype = config.authenticate.rectype;
        const params = { rectype, "data.username": username, "data.password": utils.MD5(password) }
        const authInfo = await getRecord(params);
        if (!authInfo.length) { throw "invalid username/password"; }
        const { refrectype, refid } = authInfo[0];
        const userParams = { rectype: refrectype, id: refid, status: config.common.status.active }
        const userInfo = await getRecord(userParams);
        const { orgid, id, firstname, lastname } = userInfo[0];
        const tokenParams = { userid: id, orgid, firstname, lastname, username }
        const token = utils.jwtToken(tokenParams);
        utils.verifyJwtToken(token);
        const tokenparams = { token, refid, refrectype }
        await addToken(tokenparams);
        return token;
    } catch (err) {
        throw err;
    }
}
module.exports = { authValidation, setAuth, validateAuth }