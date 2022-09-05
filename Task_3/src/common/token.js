const Schema = require("validate");
const config = require("../config/app.sepc.json")
const { getRecord, createRecord, deleteRecord } = require("../db/mongodb")
const tokenSchema = new Schema({
    id: { type: String },
    rectype: { type: String, }, //token
    refrectype: { type: String, enum: config.user.rectype },
    refid: { type: String, required: true }, //user id
    token: { type: String, required: true }
});

function tokenvalidation(params) {
    const {
        refid,
        refrectype,
        token,
    } = params;
    //checking the validate conditions
    let errors = tokenSchema.validate(params);
    if (errors.length) {
        errors = errors.map((errdata) => { return { path: errdata.path, message: errdata.message }; })
        throw errors;
    } else {
        return true;
    };
}
//adding the token record
/* async function addToken(payload) {
    try {
        tokenvalidation(payload);
        const { refid } = payload;
        payload.rectype = config.token.rectype;
        const params = { rectype: payload.rectype, refid }

        const tokenInfo = await getRecord(params);
        if (tokenInfo.length) {

            const { id } = tokenInfo[0];
            const tokenParams = { id, rectype: payload.rectype }
            await deleteRecord(tokenParams);
        }
        const Record = await createRecord(payload);
        return { message: "token record Created successfully" };
    } catch (err) {
        console.log(err)
    }
} */


async function addToken(payload) {
    try {
        const { refid, refrectype, token } = payload;
        tokenvalidation(payload);
        payload.rectype = config.token.rectype;
        const tokenParams = { rectype: payload.rectype, refid };
        const tokenData = await getRecord(tokenParams);
        if (tokenData.length) {
            const { id } = tokenData[0];
            const tokenParams = { rectype: payload.rectype, id };
            await deleteRecord(tokenParams);
        }
        await createRecord(payload);
        return { message: "Token Record Created Successfull" };
    } catch (error) {
        throw error;
    }
}



//deleting the token record
async function deleteToken(payload) {
    const { refid } = payload;
    payload.rectype = config.token.rectype;
    const params = { rectype: payload.rectype, refid }
    const tokenInfo = await getRecord(params);
    if (tokenInfo.length) {
        const { id } = tokenInfo[0];
        const tokenParams = { id, rectype: payload.rectype }
        await deleteRecord(tokenParams);
    }
}
module.exports = { addToken, deleteToken }