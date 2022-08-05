const { officeSchema } = require("../organization/organization.js")
const { MongoClient } = require("mongodb");
//connecting  mongodb


async function dbConnection() {

    const url = "mongodb+srv://organizationuser:IHSqnjXLop1QPBR2@task3.fnz9r.mongodb.net/?retryWrites=true&w=majority";
    let client = new MongoClient(url);

    try {
        let clientdata = await client.connect();
        const db = clientdata.db("Task_3")
        console.log("db Connected!");
        return db;

    } catch (error) {

        console.error(error);
    }
}
dbConnection();
async function addRecord(item) {
    return new Promise(async(resolve, reject) => {
        try {

            const db = await dbConnection();
            item.id = await getNextSequenceValue("name");
            console.log(item.id);
            item.created = new Date()
            const collname = item.rectype;
            const newRec = await db.collection(collname).insertOne(item);
            resolve(item);
        } catch (e) {
            reject(e);
        }
    })
}
async function getNextSequenceValue(sequenceOfName) {
    const db = await dbConnection();
    const collname = "sequence";
    var sequenceDoc = await db.collection(collname).findOneAndUpdate({ id: "0" }, { $inc: { count: 1 } })
    console.log("seq :" + sequenceDoc);
    return sequenceDoc.value.count;
}

async function updateRecord(item) {
    return new Promise(async(resolve, reject) => {
        try {
            const { rectype, id, body } = item
            const db = await dbConnection();
            console.log(id)
            const collname = rectype;
            const newRec = await db.collection(collname).updateOne({ id: id }, { $set: body });
            if (newRec == "") {
                throw "record not found"
            }
            resolve(body);
        } catch (e) {
            reject(e);
        }
    })
}
async function deleteRecord(item) {
    return new Promise(async(resolve, reject) => {
        try {
            const { rectype, id } = item
            const db = await dbConnection();
            if (!id) {
                resolve("id is not there")
            }
            console.log(id)
            const collname = rectype;
            const newRec = await db.collection(collname).deleteOne({ id: id });
            if (newRec.deletedCount == 0) {
                throw "data not found"
            }
            resolve(newRec);

        } catch (e) {
            reject(e);
        }
    })
}
async function getRecord(item) {
    return new Promise(async(resolve, reject) => {
        try {

            const { rectype, ...restParams } = item
            console.log(restParams);

            const db = await dbConnection();
            const collname = rectype;
            const getRec = await db.collection(collname).find(restParams).toArray();
            if (getRec == "") {
                throw "reocrd not found"
            }
            resolve(getRec);
        } catch (e) {
            reject(e);
        }
    })
}
module.exports = { addRecord, updateRecord, deleteRecord, getRecord };