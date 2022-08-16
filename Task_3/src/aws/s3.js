const AWS = require("aws-sdk");
const config = require("../config/app.sepc.json");

// s3 bucket in aws with accessKeyId and secretAccessKey
const s3 = new AWS.S3({
    accessKeyId: config.aws.ACCESS_KEY_ID,
    secretAccessKey: config.aws.SECRET_ACCESS_KEY,
});

//uploadFile function is to upload file into aws s3 bucket
async function uploadFile(file) {
    console.log(file);
    const { filename, fileContent } = file;
    const params = {
        Bucket: config.aws.Bucket_Name,
        Key: filename, // File name you want to save as in S3
        Body: fileContent,
    };

    // Uploading files to the s3 bucket
    const uploadinfo = await s3.upload(params).promise();
    console.log("upload info: ", uploadinfo);
    return uploadinfo;

}

//delete file from s3 bucket by deleteFile function
async function deleteFile(originalname) {
    try {
        const params = {
            Bucket: config.aws.Bucket_Name,
            Key: originalname,
        };
        const fileinfo = await s3.deleteObject(params).promise();

        return fileinfo;
    } catch (error) {
        console.log("Error :" + error);
        throw error;
    }
}

module.exports = { uploadFile, deleteFile };