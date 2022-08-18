const Schema = require("validate");
const config = require("../config/app.sepc.json");
const {
    createRecord,
    getRecord,
    updateRecord,
    deleteRecord
} = require("../db/mongodb");
const emailvalidator = require("email-validator")

const { Utils } = require("../common/utils");
const utils = new Utils();
const contactSchema = new Schema({
    id: { type: String },
    rectype: { type: String },
    orgid: { type: String },
    refrectype: {
        type: String,
        enum: [config.patient.rectype, config.organization.rectype],
        required: true
    },
    refid: { type: String, required: true },
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

async function validation(contactBody) {
    const { refid, refrectype, type, subtype } = contactBody
    const contData = { refid, refrectype, type, subtype }
        //check validate conditions
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
async function addAddress(contactBody) {
    try {
        contactBody.rectype = config.contact.rectype;
        const { refid, type, refrectype, subtype, data, } = contactBody

        await validation(contactBody)
        const { type: contacttype, subtype: subType } = config.contact
        if (type != contacttype.address) throw "invalid type";
        if (![subType.home, subType.work].includes(subtype)) throw "invalid subtype";
        const orgparams = { rectype: refrectype, id: refid };
        await getRecord(orgparams)

        const params = {
            data,
            address: config.contact.address
        }
        await utils.validateaddress(params)
        if (refrectype == config.patient.rectype) {
            const orgid = await utils.getRecOrgId(orgparams);
            contactBody.orgid = orgid;
        }
        const contactresult = await createRecord(contactBody);
        return contactresult;
    } catch (error) {
        throw error;
    }
}
async function updateAddress(contactBody) {
    try {
        const { id, type, data } = contactBody

        const { type: contacttype, rectype: recType } = config.contact
        if (type != contacttype.address) throw "invalid type";

        const payload = { id, body: { type, data } };
        payload.rectype = recType;
        const params = {
            data,
            address: config.contact.address
        }
        await utils.validateaddress(params)
        const contactinfo = await updateRecord(payload);
        return contactinfo;
    } catch (error) { throw error }
}
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
async function addEmail(contactBody) {
    try {
        const { refid, type, subtype, data, refrectype } = contactBody;
        await validation(contactBody);
        const { type: contacttype, subtype: subType, rectype: recType } = config.contact
        contactBody.rectype = recType;
        if (type != contacttype.email) throw "invalid type enter email";
        if (![subType.primary, subType.secondary].includes(subtype)) throw "invalid subtype";

        const orgparams = { rectype: refrectype, id: refid };
        await getRecord(orgparams);

        await utils.emailValidation(data);
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
async function updateEmail(contactBody) {
    try {
        const { id, type, data } = contactBody

        const { type: contacttype, rectype: recType } = config.contact
        if (type != contacttype.email) throw "invalid type";
        const payload = { id, body: { type, data } };
        payload.rectype = recType;
        const contactinfo = await updateRecord(payload);
        return contactinfo;
    } catch (error) { throw error }
}
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
async function addPhone(contactBody) {
    try {
        const { refid, type, subtype, data, refrectype } = contactBody;
        await validation(contactBody);
        const { type: contacttype, subtype: subType, rectype: recType } = config.contact
        contactBody.rectype = recType;
        if (type != contacttype.phone) throw "invalid type enter email";
        if (![subType.mobile, subType.personal].includes(subtype)) throw "invalid subtype";
        const orgparams = { rectype: refrectype, id: refid };

        await getRecord(orgparams);
        await utils.validatephone(data);
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
async function updatePhone(contactBody) {
    try {
        const { id, type, data } = contactBody

        const { type: contacttype, rectype: recType } = config.contact
        if (type != contacttype.phone) throw "invalid type";
        const payload = { id, body: { type, data } };
        payload.rectype = recType;
        const contactinfo = await updateRecord(payload);
        return contactinfo;
    } catch (error) { throw error }
}

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

async function addFax(contactBody) {
    try {
        const { refid, type, subtype, data, refrectype } = contactBody;
        await validation(contactBody);
        const { type: contacttype, subtype: subType, rectype: recType } = config.contact
        contactBody.rectype = recType;
        if (type != contacttype.fax) throw "invalid type enter email";
        if (![subType.home, subType.work].includes(subtype)) throw "invalid subtype";
        const orgparams = { rectype: refrectype, id: refid };
        await getRecord(orgparams);
        await utils.validateFax(data);
        console.log(await utils.validateFax(data));
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
async function updateFax(contactBody) {
    try {
        const { id, type, data } = contactBody

        const { type: contacttype, rectype: recType } = config.contact
        if (type != contacttype.fax) throw "invalid type";
        const payload = { id, body: { type, data } };
        payload.rectype = recType;
        const contactinfo = await updateRecord(payload);
        return contactinfo;
    } catch (error) { throw error }
}

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


/* "removeEmail": removeEmail,
        "addPhone": addPhone,
        "updatePhone": updatePhone,
        "removePhone": removePhone,
        "addFax": addFax,
        "updateFax": updateFax,
        "removeFax": removeFax, */