const { addRecord, getRecord, updateRecord, deleteRecord } = require("../db/mongodb.js");

async function Create(req, res) {
    try {
        req.body.rectype = "organization"
        const orginfo = await addRecord(req.body)
        console.log(orginfo)
        res.status(200).json({ status: "Success", results: orginfo });
    } catch (error) {
        console.log("Error :" + error);
        res.status(200).json({ status: "Error :", error: error });
    }
};

async function Get(req, res) {
    try {
        const {
            query
        } = req;
        if (query.id) {
            query.id = parseInt(query.id)
        }
        const payload = query
        payload.rectype = "organization";

        const data = await getRecord(payload);

        res.status(200).json({ status: "Success", results: data });
    } catch (error) {
        console.log("Error :" + error);
        res.status(200).json({ status: "Error :", error: error });
    }
}

async function Update(req, res) {
    try {
        const {
            params
        } = req;
        if (params.id) {
            params.id = parseInt(params.id)
        }
        const payload = params
        payload.rectype = "organization";
        payload.body = req.body
        const data = await updateRecord(payload);
        res.status(200).json({ status: "Success", results: data });
    } catch (error) {
        console.log("Error :" + error);
        res.status(200).json({ status: "Error :", error: error });
    }
};
async function Delete(req, res) {
    try {
        const {
            params
        } = req;
        if (params.id) {
            params.id = parseInt(params.id)
        }
        const payload = params
        payload.rectype = "organization";


        const data = await deleteRecord(payload);
        res.status(200).json({ status: "Success", results: data });
    } catch (error) {
        console.log("Error :" + error);
        res.status(200).json({ status: "Error :", error: error });
    }
};

module.exports = { Create, Get, Delete, Update }