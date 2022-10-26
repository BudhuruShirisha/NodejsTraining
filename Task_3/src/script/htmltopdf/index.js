const puppeteer = require("puppeteer");
const express = require("express");
const app = express();
const fs = require("fs-extra");
const hbs = require("handlebars");
const path = require("path");
const axios = require("axios");
const imgurl = "https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/v1448869563/ywpvxeixpkb9d4k7vnze.jpg";
app.use(express.static(imgurl))

const { getPatientDetails } = require("../../common/template");

async function getpatient(id) {
    try {
        const patientRecord = await axios.get("http://localhost:5000/patient/details/", {
            params: {
                id: id
            }
        });
        const patientInfo = patientRecord.data.results;
        return patientInfo;
    } catch (err) {
        console.log(err)
    }
}

async function htmltopdf(patientRecord, imgurl) {
    try {
        let { firstname, lastname } = patientRecord;
        patientRecord.firstname = firstname.charAt(0).toUpperCase() + firstname.slice(1);
        patientRecord.lastname = lastname.charAt(0).toUpperCase() + lastname.slice(1);
        patientRecord.date = new Date().toLocaleString();
        patientRecord.imgurl = imgurl;
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const gethtmlcontent = getPatientDetails();
        const getcontent = hbs.compile(gethtmlcontent)(patientRecord);

        await page.setContent(getcontent);
        await page.pdf({
            path: `${firstname}_${lastname}_Patient_Info.pdf`,
            format: 'A4',
        })
        await browser.close();
    } catch (e) {
        console.log(e);
    }
}

async function start(id, imgurl) {
    try {
        const patientrecord = await getpatient(id)
        htmltopdf(patientrecord, imgurl)
    } catch (err) {
        console.log(err)
    }

}

start(20220801003834, imgurl)