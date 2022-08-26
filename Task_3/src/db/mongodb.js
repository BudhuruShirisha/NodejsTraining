const { MongoClient } = require("mongodb");
const config = require("../config/app.sepc.json");
const { Utils } = require('../common/utils');

const utils = new Utils();

//dbconnection to connect with mongodb
async function dbConnection() {

    const url = config.db.mongodburl;
    //connecting to mongoclient with url
    const client = new MongoClient(url);
    try {

        let clientdata = await client.connect();
        const db = clientdata.db(config.db.dbname);
        console.log("db Connected!");
        return db;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
//getNextSequenceValue to get sequence id
async function getNextSequenceValue() {
    const db = await dbConnection();
    const collname = config.sequence.rectype; //get collection name from config file
    const sequenceDoc = await db.collection(collname).findOneAndUpdate({ id: "0" }, { $inc: { data: 1 } });
    return sequenceDoc.value.data.toString();
}

//createRecord  to insert record into collection 
async function createRecord(item) {

    return new Promise(async(resolve, reject) => {
        try {
            item.created = utils.getCurrentDateTime(); //getCurrentDateTime() to get current data and time from Utils 
            const collname = item.rectype;
            item.id = await getNextSequenceValue();
            const db = await dbConnection();
            const newRec = await db.collection(collname).insertOne(item);
            resolve(item);
        } catch (error) {
            reject(error);
        }
    });
}

//getRecord  to get data from collection
async function getRecord(item) {
    return new Promise(async(resolve, reject) => {
        try {
            const { rectype, ...restParams } = item; // rectype and restparams to get data from collections
            const db = await dbConnection();
            const collname = rectype;
            const recList = await db.collection(collname).find(restParams).toArray();
            resolve(recList);
        } catch (error) {
            reject(error);
        }
    });
}

//updateRecord  to update the record from collection
async function updateRecord(item) {
    return new Promise(async(resolve, reject) => {
        try {
            console.log("erwe", item)
            const { rectype, id, body } = item;
            const db = await dbConnection();
            const collname = rectype;
            const newRec = await db.collection(collname).updateOne({ id: id }, { $set: body });
            if (!newRec.modifiedCount) {
                throw `Record is Not Found!`;
            }
            resolve(item);
        } catch (error) {
            reject(error);
        }
    });
}

//deleteRecord to delete the record from collection
async function deleteRecord(item) {
    return new Promise(async(resolve, reject) => {
        try {
            const { rectype, id } = item;
            const db = await dbConnection();
            const collname = rectype;
            const result = await db.collection(collname).deleteOne({ id });
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
module.exports = { createRecord, updateRecord, deleteRecord, getRecord };