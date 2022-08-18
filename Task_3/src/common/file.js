const Schema = require("validate");
const path = require("path");
const { createRecord, deleteRecord } = require("../db/mongodb");
const config = require("../config/app.sepc.json");
const { uploadFile, deleteFile } = require("../aws/s3.js");
const { Utils } = require("../common/utils");

const utils = new Utils();
//fileSchema 
const file = new Schema({
    id: { type: Number },
    rectype: { type: String }, //file,
    refid: { type: String, required: true, },
    refrectype: {
        type: String,
        enum: [config.patient.rectype, config.organization.rectype],
        required: true,
    },
    orgid: { type: String },
    status: { type: String, enum: config.file.status },
    url: { type: String }, //s3 URL
    name: { type: String },
    originalname: { type: String },
    type: { type: String },
    size: { type: Number },
    created: { type: String },
    data: {},
});

//Validation function is used to validate the schema with required types and fields
function Validation(req, res, next) {
    //assign req values to object
    const {
        body: {
            id,
            rectype,
            refid,
            refrectype,
            orgid,
            status,
            url,
            name,
            organization,
            type,
            size,
            created,
        },
    } = req;
    //pass required fields to fileInfo
    const fileInfo = {
        id,
        rectype,
        refid,
        refrectype,
        orgid,
        status,
        url,
        name,
        organization,
        type,
        size,
        created,
    };
    //checking  the  validate conditions and send next() middleware
    let errors = file.validate(fileInfo);
    if (errors.length) {
        errors = errors.map((eRec) => {
            return { path: eRec.path, message: eRec.message };
        });
        res.send(errors);
    } else {
        next();
    }
}

//addFile  into mongodb 
async function addFile(req, res) {
    try {
        const rectype = config.file.rectype;
        const {
            file: { originalname, mimetype: type, filename, size, path: filepath },
            body: { refid, refrectype },
        } = req;
        const fileContent = utils.getFileContent(filepath).toString("utf-8");
        const fileInfo = { filename: originalname, fileContent };
        const uploadInfo = await uploadFile(fileInfo);
        const url = uploadInfo.Location;
        const name = path.parse(filename).name;
        const orgparams = { rectype: refrectype, id: refid };
        const status = config.file.status.completed;
        const addpayload = {
            rectype,
            refid,
            refrectype,
            url,
            type,
            originalname,
            name,
            size,
            status
        };
        if (refrectype == config.patient.rectype) {
            const orgid = await utils.getRecOrgId(orgparams);
            addpayload.orgid = orgid;
        }
        const fileinfo = await createRecord(addpayload); // createRecord into mongodb 

        res.status(200).json({ status: "Success", results: fileinfo }); // success!  if record is  inserted successfully
    } catch (error) {
        res.status(400).json({ status: "Error :", error: error.message }); // error!  if error occurs
    }
}

//  Filedelete to delete the file
async function Filedelete(req, res) {
    try {
        const { query } = req;
        const payload = query;
        console.log(payload);
        payload.rectype = config.file.rectype;
        const originalname = await utils.getoriginalname(payload);
        const datainfo = deleteFile(originalname);
        console.log(datainfo);
        const data = await deleteRecord(payload); // deleterecord  from mongodb 
        res.status(200).json({ status: "Success", results: data }); // send success  if record is successfully deleted
    } catch (error) {
        console.log("Error :" + error);
        res.status(400).json({ status: "Error :", error: error.message }); // send error if error  occurs
    }
}

module.exports = { Validation, addFile, Filedelete };