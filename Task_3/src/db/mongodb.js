const { MongoClient } = require("mongodb");
const config = require("../config/app.sepc.json");

const { Utils } = require('../common/utils');

const utils = new Utils();

//dbconnection function is used to connect with mongodb
async function dbConnection() {

    const url = config.db.mongodburl;
    //connecting to mongoclient with url
    const client = new MongoClient(url);
    try {
        // Connect to the MongoDB
        let clientdata = await client.connect();
        const db = clientdata.db(config.db.dbname);
        console.log("db Connected!");
        return db;
    } catch (error) {
        console.error(error);
    }
}
//getNextSequenceValue is used to get sequence id
async function getNextSequenceValue() {
    const db = await dbConnection();

    const collname = config.sequence.rectype; //getting collection name from config file
    const sequenceDoc = await db.collection(collname).findOneAndUpdate({ id: "0" }, { $inc: { data: 1 } }); //find and update sequence values
    console.log("seq value", sequenceDoc.value.data.toString());
    return sequenceDoc.value.data.toString();
}

//createRecord function is used to insert record into collection with req body
async function createRecord(item) {
    return new Promise(async(resolve, reject) => {
        try {
            console.log(item);
            item.created = utils.getCurrentDateTime(); //getCurrentDateTime() is used to get current data and time from Utils file

            const collname = item.rectype; //collection name
            item.id = await getNextSequenceValue(); //find new value for id
            console.log("generated id:  ", item.id);
            const db = await dbConnection();
            const newRec = await db.collection(collname).insertOne(item); //insert record into database
            console.log("recorded data: ", newRec);
            resolve(item);
        } catch (error) {
            reject(error);
        }
    });
}

//getRecord function is used to get data from collection
async function getRecord(item) {
    return new Promise(async(resolve, reject) => {
        try {
            const { rectype, ...restParams } = item; //pass rectype and restparams to get data from collections
            const db = await dbConnection();
            const collname = rectype;
            const getRec = await db.collection(collname).find(restParams).toArray(); //get data from requested parameters
            if (!getRec.length) {
                throw `Record is Not Found!`;
            }
            resolve(getRec); //get data from database
        } catch (error) {
            reject(error);
        }
    });
}

//updateRecord function is used to update the record from collection
async function updateRecord(item) {
    return new Promise(async(resolve, reject) => {
        try {

            const { rectype, id, body } = item; //take item object and pass required values
            const db = await dbConnection();
            const collname = rectype;
            const newRec = await db
                .collection(collname)
                .updateOne({ id: id }, { $set: body }); //find the id and update the record
            if (!newRec.modifiedCount) {
                throw `Record is Not Found!`;
            }
            resolve(item); //if data updated get the update record
        } catch (error) {
            reject(error);
        }
    });
}

//deleteRecord function is used to delete the record from collection
async function deleteRecord(item) {
    return new Promise(async(resolve, reject) => {
        try {
            const { rectype, ...restParams } = item; //pass rectype and restparams to get data from collections
            const db = await dbConnection();
            const collname = rectype; //collection name
            const result = await db.collection(collname).deleteOne(restParams); //find and update the selected id
            if (!result.deletedCount) {
                throw `Record is Not Found!`;
            }
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

dbConnection();
module.exports = { createRecord, updateRecord, deleteRecord, getRecord }; //export all functions