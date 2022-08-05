const Schema = require('validate')
const express = require("express");
const { Validationcheck } = require("../../src/organization/organization");
const router = express.Router();
const fileSchema = new Schema({
    id: { type: String },
    rectype: { type: String },
    refid: { type: String },
    refrectype: { type: String, enum: [patient, organization] },
    orgid: { type: String },
    status: { type: String, enum: [completed, pending, error] },
    url: { type: String },
    name: { type: String },
    originalname: { type: String },
    type: { type: String },
    size: { type: Number },
    created: { type: String },
    data: {}
});

function Validationcheck(req, res, next) {
    const {
        body: {
            id,
            rectype,
            refrectype,
            orgid,
            status,
            url,
            name,
            originalname,
            type,
            size,
            created,
            data
        }
    } = req;
    const responsedata = {
        id,
        rectype,
        refrectype,
        orgid,
        status,
        url,
        name,
        originalname,
        type,
        size,
        created,
        data
    }
    const error = fileSchema.validate(responsedata);
    console.log(error);
    if (error == null || error.length === 0) {
        //   console.log(responsedata);
        next();
    } else {
        console.log("error");
        res.send("error");
    }
}
router.post("/common/file", Validationcheck, )