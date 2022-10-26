const config = require("../config/app.sepc.json");
const {
    createRecord,
    updateRecord,
    deleteRecord,
    getRecord,
} = require("../db/mongodb");
const { Utils } = require("../common/utils");
const utils = new Utils();
//creating the user record 
async function createRec(req, res) {
    try {
        req.body.rectype = config.user.rectype;
        utils.validateDob(req.body.dob);
        const userInfo = await createRecord(req.body);
        res.status(200).json({ status: "Success", results: userInfo });
    } catch (error) {
        res.status(400).json({ status: "Error", error: error })
    }
}
//getRec is to get the user record
async function getRec(req, res) {
    try {
        const { query } = req;
        const payload = query;
        payload.rectype = config.user.rectype;
        const userInfo = await getRecord(payload);
        res.status(200).json({ status: "Success", results: userInfo });
    } catch (error) {
        res.status(400).json({ status: "Error :", error: error });
    }
}
//update  is to update the user record
async function updateRec(req, res) {
    try {
        const { query } = req;
        const payload = query;
        payload.rectype = config.user.rectype;
        payload.body = req.body;
        utils.validateDob(payload.body.dob);
        const userInfo = await updateRecord(payload);
        res.status(200).json({ status: "Success", results: userInfo });
    } catch (error) {
        res.status(400).json({ status: "Error :", error: error });
    }
}
//deleteRec is to delete user record
async function deleteRec(req, res) {
    try {
        const { query } = req;
        const payload = query;
        payload.rectype = config.user.rectype;
        const userInfo = await deleteRecord(payload);
        res.status(200).json({ status: "Success", results: userInfo });
    } catch (error) {
        res.status(400).json({ status: "Error :", error: error });
    }
}

module.exports = { createRec, getRec, updateRec, deleteRec }