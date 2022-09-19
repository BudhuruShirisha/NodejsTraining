const express = require('express');
const sendemail = require('../controller/mail.js');
const { emailValidation } = require("../middleware/validator.js")
const router = express.Router();
//post request
router.post('/sendmail', emailValidation, async(req, res) => {
    try {
        //calling the sendemail function
        const emailcontent = await sendemail(req.body)

        res.render('success'); //render success page
    } catch {
        res.render("failure")
    }
});
module.exports = router;