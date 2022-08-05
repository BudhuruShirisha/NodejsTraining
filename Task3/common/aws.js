const AWS = require("aws-sdk");
const fs = require("fs");

const ID = 'AKIAQATBCZB5MJYQVYVO';
const SECRET = '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';

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

function uploadFile(filePath, fileName) {
    // Read content from the file
    const fileContent = fs.readFileSync(filePath);

    // Setting up S3 upload parameters
    const params = {
        Bucket: "mys3files",
        Key: fileName, // File name you want to save as in S3
        Body: fileContent,
    };

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
}

uploadFile(
    "C:/Nodejstraining/Repo/Task3/files/organization.json", 'organization.json');
uploadFile('C:/Nodejstraining/Repo/Task3/files/patient.json', 'patient.json');