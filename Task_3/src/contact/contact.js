const Schema = require("validate");
const config = require("../config/app.sepc.json");
const {
    createRecord,
    getRecord,
    updateRecord,
    deleteRecord
} = require("../db/mongodb");
const { Utils } = require("../common/utils");
const utils = new Utils();
//contactSchema
const contactSchema = new Schema({
        id: { type: String },
        rectype: { type: String },
        orgid: { type: String },
        refrectype: {
            type: String,
            enum: [config.patient.rectype, config.organization.rectype],
            required: true
        },
        refid: { type: String },
        type: {
            type: String,
            enum: Object.values(config.contact.type),
            required: true,
        },
        subtype: {
            type: String,
            enum: Object.values(config.contact.subtype),
            required: true,
        },
        data: {}
    })
    //checking validate conditions
function validation(contactBody) {
    const { refid, refrectype, type, subtype } = contactBody
    const contData = { refid, refrectype, type, subtype }
    let errors = contactSchema.validate(contData);
    if (errors.length) {
        errors = errors.map((eRec) => {
            return { path: eRec.path, message: eRec.message };
        });
        throw errors[0].message;
    } else {
        return true;
    }
}
//addAddress to patient or organization
async function addAddress(contactBody) {
    try {
        contactBody.rectype = config.contact.rectype;
        const { refid, type, refrectype, subtype, data, } = contactBody
        validation(contactBody)
        const { type: contactType, subtype: subType } = config.contact
        if (type != contactType.address) throw "invalid type";
        if (![subType.home, subType.work].includes(subtype)) throw "invalid subtype";
        const orgparams = { rectype: refrectype, id: refid };
        await getRecord(orgparams) //getRecord is to check record is available or not
        const params = {
            data,
            address: config.contact.address
        }

        //validating the address
        utils.validateaddress(params)
            /* if (refrectype == config.patient.rectype) {
                const orgid = await utils.getRecOrgId(orgparams); //if rectype is patient then get organizationid
                contactBody.orgid = orgid;

            } */

        const contactresult = await createRecord(contactBody);
        return contactresult;
    } catch (error) {
        throw error;
    }
}
//updating the address for patient or organization
async function updateAddress(contactBody) {
    try {
        const { id, type, data } = contactBody

        const { type: contactType, rectype: recType } = config.contact
        if (type != contactType.address) throw "invalid type";

        const payload = { id, body: { type, data } };
        payload.rectype = recType;
        const params = {
            data,
            address: config.contact.address
        }
        utils.validateaddress(params)
        const contactinfo = await updateRecord(payload);
        return contactinfo;
    } catch (error) { throw error }
}
//removing the address from patient or organization
async function removeAddress(contactBody) {
    try {
        const { id } = contactBody
        const payload = { id };
        payload.rectype = config.contact.rectype;
        const info = await deleteRecord(payload);
        return info;
    } catch (error) {
        throw error;
    }
}
//adding the email to patient or organization
async function addEmail(contactBody) {
    try {
        const { refid, type, subtype, data, refrectype } = contactBody;
        validation(contactBody);
        const { type: contactType, subtype: subType, rectype: recType } = config.contact
        contactBody.rectype = recType;
        if (type != contactType.email) throw "invalid type enter email";
        if (![subType.primary, subType.secondary].includes(subtype)) throw "invalid subtype";

        const orgparams = { rectype: refrectype, id: refid };
        await getRecord(orgparams);

        utils.emailValidation(data);
        if (refrectype == config.patient.rectype) {
            const orgid = await utils.getRecOrgId(orgparams);
            contactBody.orgid = orgid;
        }
        const contactinfo = await createRecord(contactBody);
        return contactinfo;
    } catch (error) {
        throw error
    }
}
//update  email for patient or organization
async function updateEmail(contactBody) {
    try {
        const { id, type, data } = contactBody

        const { type: contactType, rectype: recType } = config.contact
        if (type != contactType.email) throw "invalid type";
        const payload = { id, body: { type, data } };
        payload.rectype = recType;
        const contactinfo = await updateRecord(payload);
        return contactinfo;
    } catch (error) { throw error }
}

//removing the email from patient or organization
async function removeEmail(contactBody) {
    try {
        const { id } = contactBody
        const payload = { id };
        payload.rectype = config.contact.rectype;
        const info = await deleteRecord(payload);
        return info;
    } catch (error) {
        throw error;
    }
}
//adding the phonenum to patient or organization
async function addPhone(contactBody) {
    try {
        const { refid, type, subtype, data, refrectype } = contactBody;
        validation(contactBody);
        const { type: contactType, subtype: subType, rectype: recType } = config.contact
        contactBody.rectype = recType;
        if (type != contactType.phone) throw "invalid type enter email";
        if (![subType.mobile, subType.personal].includes(subtype)) throw "invalid subtype";
        const orgparams = { rectype: refrectype, id: refid };

        await getRecord(orgparams);
        //   utils.validatephone(data);
        if (refrectype == config.patient.rectype) {
            const orgid = await utils.getRecOrgId(orgparams);
            contactBody.orgid = orgid;
        }
        const contactinfo = await createRecord(contactBody);
        return contactinfo;
    } catch (error) {
        throw error
    }
}
//updating the phonenum for patient or organization
async function updatePhone(contactBody) {
    try {
        const { id, type, data } = contactBody

        const { type: contactType, rectype: recType } = config.contact
        if (type != contactType.phone) throw "invalid type";
        const payload = { id, body: { type, data } };
        payload.rectype = recType;
        const contactinfo = await updateRecord(payload);
        return contactinfo;
    } catch (error) { throw error }
}
//removing the phonenum from patient or organization
async function removePhone(contactBody) {
    try {
        const { id } = contactBody
        const payload = { id };
        payload.rectype = config.contact.rectype;
        const info = await deleteRecord(payload);
        return info;
    } catch (error) {
        throw error;
    }
}
//adding the fax to patient or organization
async function addFax(contactBody) {
    try {
        const { refid, type, subtype, data, refrectype } = contactBody;
        await validation(contactBody);
        const { type: contactType, subtype: subType, rectype: recType } = config.contact
        contactBody.rectype = recType;
        if (type != contactType.fax) throw "invalid type enter email";
        if (![subType.home, subType.work].includes(subtype)) throw "invalid subtype";
        const orgparams = { rectype: refrectype, id: refid };
        await getRecord(orgparams);
        utils.validateFax(data);
        if (refrectype == config.patient.rectype) {
            const orgid = await utils.getRecOrgId(orgparams);
            contactBody.orgid = orgid;
        }
        const contactinfo = await createRecord(contactBody);
        return contactinfo;
    } catch (error) {
        throw error
    }
}
//updating the fax for patient or organization
async function updateFax(contactBody) {
    try {
        const { id, type, data } = contactBody

        const { type: contactType, rectype: recType } = config.contact
        if (type != contactType.fax) throw "invalid type";
        const payload = { id, body: { type, data } };
        payload.rectype = recType;
        const contactinfo = await updateRecord(payload);
        return contactinfo;
    } catch (error) { throw error }
}
//removing the fax from patient or organization
async function removeFax(contactBody) {
    try {
        const { id } = contactBody
        const payload = { id };
        payload.rectype = config.contact.rectype;
        const info = await deleteRecord(payload);
        return info;
    } catch (error) {
        throw error;
    }
}
// processfun to perform action based on appropriate method
function processFun(__action) {

    const functionMapping = {
        "addAddress": addAddress,
        "updateAddress": updateAddress,
        "removeAddress": removeAddress,
        "addEmail": addEmail,
        "updateEmail": updateEmail,
        "removeEmail": removeEmail,
        "addPhone": addPhone,
        "updatePhone": updatePhone,
        "removePhone": removePhone,
        "addFax": addFax,
        "updateFax": updateFax,
        "removeFax": removeFax

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