const express = require("express");
const multer = require("multer");
const app = express();
const patient = require("./routers/patient");
const organization = require("./routers/organization");
const common = require("./routers/common");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, __dirname + "/temp/");
    },

    filename: function(req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname);
    },
});

const upload = multer({ storage: storage });

app.use(upload.single("file"));

//Configure router so all routes are prefixed with /Users
app.use("/patient", patient);
app.use("/organization", organization);
app.use("/common", common);

//SET the server to listen at 3000
app.listen(5000, () =>
    console.log("Node server is running on http://localhost:5000")
);