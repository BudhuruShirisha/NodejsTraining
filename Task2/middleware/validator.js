const emailvalidator = require("email-validator")
    // validation to validate the email
function emailValidation(req, res, next) {
    const {
        body: { to },
    } = req;
    if (emailvalidator.validate(to)) {
        console.log("if block")
            // navigate to next middleware function
        next();
    } else {
        console.log("else block")
        res.render("failed");
    }
}
module.exports = { emailValidation };