const fs = require("fs");
const bcrypt = require("bcryptjs");
const emailvalidator = require("email-validator")
const config = require("../config/app.sepc.json");
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
    async validateaddress(params) {
            const {
                data,
                address
            } = params;
            address.forEach((element) => {
                if (!data.hasOwnProperty(element)) {
                    throw "enter valid data";
                }
            });
            return true;
        }
        //to validate the email
    async emailValidation(data) {
            if (emailvalidator.validate(data)) {
                return true;
            } else {
                throw "invalid email";
            }
        }
        //to validate the phone
    async validatephone(params) {
            if (!validatePhoneNumber.test(params)) {
                throw "Enter valid Phone Number!";

            } else {
                return true;
            }
        }
        //to validate the fax
    async validateFax(params) {
        if (!validatefax.test(params)) {
            throw "Enter valid fax Number!";
        } else
            return true;
    }
    async validateDob(dob) {
        if (!validatedob.test(dob)) {
            throw "Enter valid dob in YYYY-MM-DD !";
        } else
            return true;
    }
    async getencrypted(password) {
        return new Promise(async(resolve, reject) => {
            try {
                bcrypt.hash(password, 8, (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                })
            } catch (err) {
                throw err;
            }

        })
    }
}

module.exports = { Utils };