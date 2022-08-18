const fs = require("fs");
const emailvalidator = require("email-validator")
const config = require("../config/app.sepc.json");
const validatePhoneNumber = new RegExp(config.contact.number);
const validatefax = new RegExp(config.contact.faxRegEx);


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
            console.log(orgInfo);
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
            console.log(id);
            const orgInfo = await getRecord({ id, rectype });
            console.log(orgInfo);
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
                console.log("1");
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
}


module.exports = { Utils };