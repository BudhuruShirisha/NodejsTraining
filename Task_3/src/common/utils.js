const fs = require("fs");
//const bcrypt = require("bcryptjs");
const emailvalidator = require("email-validator")
const config = require("../config/app.sepc.json");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const validatePhoneNumber = new RegExp(config.contact.number);
const validatefax = new RegExp(config.contact.faxRegEx);
const validatedob = new RegExp(config.common.dobformat);

class Utils {
    //getCurrentDateTime is to get current datetime
    getCurrentDateTime() {
        return new Date().toISOString();
    }
    getFileContent(path) {
            // Read content from the file
            const fileContent = fs.readFileSync(path);

            return fileContent;
        }
        //get organizationid from rectype
    async getRecOrgId(params) {
            const {
                getRecord
            } = require("../db/mongodb.js"); //getrecord from the mongodb file
            const { id, rectype } = params;
            const orgInfo = await getRecord({ id, rectype });
            if (!orgInfo.length) {
                throw `Invalid ${rectype} Id`;
            }
            return orgInfo[0].orgid;
        }
        //getoriginal name of the file from rectype
    async getoriginalname(params) {
            const {
                getRecord
            } = require("../db/mongodb.js");
            const { id, rectype } = params;
            const orgInfo = await getRecord({ id, rectype });
            if (!orgInfo.length) {
                throw `Invalid ${rectype} Id`;
            }
            return orgInfo[0].originalname;
        }
        //to validate the address
    validateaddress(params) {
            const {
                address,
                checkaddress
            } = params;
            checkaddress.forEach((element) => {
                if (!address.hasOwnProperty(element)) {
                    throw "enter valid data";
                }
            });

            return true;
        }
        //to validate the email
    emailValidation(email) {
            if (emailvalidator.validate(email)) {
                return true;
            } else {
                throw "invalid email";
            }
        }
        //to validate the phone
    validatephone(params) {
            if (!validatePhoneNumber.test(params)) {
                throw "Enter valid Phone Number!";

            } else {
                return true;
            }
        }
        //to validate the fax
    validateFax(params) {
        if (!validatefax.test(params)) {
            throw "Enter valid fax Number!";
        } else
            return true;
    }
    validateDob(dob) {

        if (!validatedob.test(dob)) {
            throw "Enter valid dob in YYYY-MM-DD !";
        } else
            return true;

    }
    MD5(text) {
        return md5(text);
    }
    jwtToken(tokenParams) {
        const gentoken = jwt.sign(tokenParams, config.key.secret_key, { expiresIn: config.key.exphrs })
        return gentoken;
    }
    verifyJwtToken(token) {
            try {
                const decoded = jwt.verify(token, config.key.secret_key);
                return decoded;
            } catch (err) {
                throw err;
            }
        }
        //validate data in modeldata 
    validatedatainrecord(params) {
        const {
            modeldata,
            data,
        } = params;
        let recdata = {};
        Object.keys(modeldata).forEach((element) => {
            if (data.hasOwnProperty(element))
                recdata[element] = data[element];
        })

        return recdata;
    }

    //get flag, limitDiff, otherdata 
    getFlaglLimitDiff(params) {
        const { min, max, value } = params;
        if (Number(value) < Number(min) || Number(value) > Number(max)) {
            const data = {};
            if (Number(value) < Number(min)) {
                data.flag = "Below Minimum";
                data.limitDiff = min - value;
            } else {
                data.flag = "Over Maximum";
                data.limitDiff = value - max;
            }
            data.otherdata = {
                actualvalue: value,
                min,
                max,
            };
            return data;
        }
        return false
    }
}
module.exports = { Utils };