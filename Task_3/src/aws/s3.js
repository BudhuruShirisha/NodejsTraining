const AWS = require("aws-sdk");
const config = require("../config/app.sepc.json");
// s3 bucket in aws with accessKeyId and secretAccessKey
const s3 = new AWS.S3({
    accessKeyId: config.aws.ACCESS_KEY_ID,
    secretAccessKey: config.aws.SECRET_ACCESS_KEY,
});

//upload file into aws s3 bucket
async function uploadFile(file) {
    try {
        const { filename, fileContent } = file;
        const params = {
            Bucket: config.aws.Bucket_Name,
            Key: filename, // File name you want to save as in S3
            Body: fileContent,
        };
        // Upload files to the s3 bucket
        const uploadinfo = await s3.upload(params).promise();
        return uploadinfo;
    } catch (err) {
        throw err;
    }
}

//delete file from s3 bucket
async function deleteFile(originalname) {
    try {
        const params = {
            Bucket: config.aws.Bucket_Name,
            Key: originalname,
        };
        const fileinfo = await s3.deleteObject(params).promise();

        return fileinfo;
    } catch (error) {
        throw error;
    }
}

module.exports = { uploadFile, deleteFile };