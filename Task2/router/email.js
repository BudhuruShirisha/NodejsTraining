const express = require('express');
const sendemail = require('../controller/mail.js');
const validator = require('email-validator');
const router = express.Router();
//post request
router.post('/sendmail', async(req, res) => {
    try {
        //validating the email sent from req.body
        if (validator.validate(req.body.to)) {
            {
                //calling the sendemail function
                const emailcontent = await sendemail(req.body)
                console.log("sending mail")
                res.render('success'); //render success page
            }
        } else {
            res.status(400).send('Invalid Email'); //error 
        }
    } catch {
        res.render("failure")
    }
});

module.exports = router;