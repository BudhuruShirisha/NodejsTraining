const fs = require("fs");

class Utils {

    getCurrentDateTime() {
        return new Date().toISOString();
    }
    getFileContent(path) {
        // Read content from the file
        const fileContent = fs.readFileSync(path);
        return fileContent;
    }
    async getRecOrgId(params) {
        const {
            getRecord
        } = require("../db/mongodb.js"); //getrecord from the mongodb file
        const { id, rectype } = params;
        console.log(id);
        const orgInfo = await getRecord({ id, rectype });
        console.log(orgInfo);
        if (!orgInfo.length) {
            throw `Invalid ${rectype} Id`;
        }
        return orgInfo[0].id;
    }
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
}


module.exports = { Utils };