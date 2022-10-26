const Schema = require("validate");
const path = require("path");
const { createRecord, deleteRecord } = require("../db/mongodb");
const config = require("../config/app.sepc.json");
const { uploadFile, deleteFile } = require("../aws/s3.js");
const { Utils } = require("../common/utils");

const utils = new Utils();
//FileSchema 
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
    status: { type: String, enum: [config.file.status.pending, config.file.status.completed], },
    url: { type: String }, //s3 URL
    name: { type: String },
    originalname: { type: String },
    type: { type: String },
    size: { type: Number },
    created: { type: String },
    data: {},
});

function Validation(req, res, next) {

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
    //pass required fields to filedata
    const fileData = {
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
    let errors = file.validate(fileData);
    if (errors.length) {
        errors = errors.map((eRec) => {
            return { path: eRec.path, message: eRec.message };
        });
        res.send(errors);
    } else {
        next();
    }
}

//addFile function is used and files into mongodb files collection
async function addFile(req, res) {
    try {
        const rectype = config.file.rectype;
        const {
            file: { originalname, mimetype: type, filename, size, path: filepath },
            body: { refid, refrectype },
        } = req;
        const name = path.parse(filename).name;
        const status = config.file.status.completed;
        const addpayload = {
            rectype,
            refid,
            refrectype,
            type,
            originalname,
            name,
            size,
            status,
        };

        //check if refrectype is patient or not, if patient then find orgid
        if (refrectype == config.patient.rectype) {
            const orgparams = { rectype: refrectype, id: refid };
            const orgid = await utils.getRecOrgId(orgparams);
            addpayload.orgid = orgid;
        }
        const fileContent = utils.getFileContent(filepath);
        const filedata = { filename: originalname, fileContent };
        // upload file into s3bucket
        const uploadInfo = await uploadFile(filedata);
        // url from s3bucket 
        addpayload.url = uploadInfo.Location;
        const fileinfo = await createRecord(addpayload); //createRecord into  mongodb 

        res.status(200).json({ status: "Success", results: fileinfo }); //success if record is successfully inserted
    } catch (error) {
        res.status(400).json({ status: "Error ert:", error: error }); //error status if error  occurs
    }
}

//deleteFile  to delete the file
async function Filedelete(req, res) {
    try {
        const { query } = req;
        const payload = query;
        payload.rectype = config.file.rectype;
        const originalname = await utils.getoriginalname(payload);
        const datainfo = deleteFile(originalname);
        const data = await deleteRecord(payload); // deleterecord from mongodb 
        res.status(200).json({ status: "Success", results: data }); //success  if record is successfully deleted
    } catch (error) {
        res.status(400).json({ status: "Error :", error: error.message }); // error status if error occurs
    }
}

module.exports = { Validation, addFile, Filedelete };