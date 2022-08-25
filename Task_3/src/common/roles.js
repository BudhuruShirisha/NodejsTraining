const Schema = require("validate");
const config = require("../config/app.sepc.json")
const {
    createRecord,
    getRecord,
    updateRecord,
    deleteRecord
} = require("../db/mongodb");
const roles = new Schema({
    roleid: { type: Array, required: true },
    refid: { type: String, required: true }
})


function rolesValidation(rolesBody) {
    const { roleid, refid } = rolesBody;
    const Data = { refid, roleid };
    //checking the validate conditions
    let errors = roles.validate(rolesBody);
    if (errors.length) {
        errors = errors.map((eRec) => {
            return { path: eRec.path, message: eRec.message };
        });
        throw errors[0].message;
    } else {
        return true;
    }
}


async function createRole(rolesBody) {
    try {
        const { refid, roleid, refrectype } = rolesBody;
        rolesValidation(rolesBody);
        const userparams = { rectype: refrectype, id: refid, status: config.common.status.active };
        const userData = await getRecord(userparams);
        if (!userData.length) { throw "invalid user/inactive record" }
        const { orgid } = userData[0];
        rolesBody.orgid = orgid;
        rolesBody.rectype = config.roles.rectype;
        const rolesInfo = await createRecord(rolesBody);
        return rolesInfo;
    } catch (err) {
        throw err;
    }
}

//updateRec is to update the patient record   
async function updateRole(rolesBody) {
    try {

        const { id, roleid } = rolesBody
        const payload = { id, body: { roleid } };
        payload.rectype = config.roles.rectype;
        console.log(payload)
        const rolesInfo = await updateRecord(payload);
        return rolesInfo;
    } catch (error) {
        throw err;
    }
}
//deleteRec is to delete patient record
async function removeRole(rolesBody) {
    try {
        const { id } = rolesBody
        const payload = { id };
        payload.rectype = config.roles.rectype;
        const rolesInfo = await deleteRecord(payload);
        return rolesInfo;
    } catch (error) {
        throw error;
    }
}

function processFun(__action) {
    const functionMapping = {
        "createRole": createRole,
        "updateRole": updateRole,
        "removeRole": removeRole,
    };
    if (__action in functionMapping) {
        return functionMapping[__action];
    } else {
        throw "Invalid __action!";
    }
}
module.exports = {
    processFun,
};