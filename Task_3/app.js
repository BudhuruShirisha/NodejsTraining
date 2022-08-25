const express = require("express");
const multer = require("multer");
const app = express();
const patient = require("./routers/patient");
const organization = require("./routers/organization");
const common = require("./routers/common");
const user = require("./routers/user");

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
//Configure router  
app.use("/patient", patient);
app.use("/organization", organization);
app.use("/common", common);
app.use("/user", user);

//SET the server to listen at 5000
app.listen(5000, () =>
    console.log("Node server is running on http://localhost:5000")
);