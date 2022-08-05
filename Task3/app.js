const express = require('express');

const organization = require('./routes/organization.js');
const patient = require("./routes/patient")
const app = express();
app.use(express.json());

app.listen(4040, () => console.log('Node server is running on http://localhost:4040'));

app.use('/organization', organization);
app.use("/patient", patient)