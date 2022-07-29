const nodeMailer = require("nodemailer");
const config = require("../emailconfig")
    //sending params from the router
async function sendemail(params) {
    const {
        service,
        port,
        secure,
        requireTLS,
        auth
    } = config
    const {
        to,
        subject,
        text,
    } = params;
    //create  transporter  using the default SMTP transport
    const transporter = nodeMailer.createTransport({
        service,
        port,
        secure,
        requireTLS,
        auth
    });

    let mailOptions = {
        from: config.from,
        to,
        subject,
        text
    };

    //using the sendMail method provided by the transporter object 
    const mail = await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            console.log("hi")
            if (error) {
                reject(error);
            }
            if (!error) {
                // console.log('Message %s sent: %s', info.messageId, info.response);
                resolve(info)
            }

        })

    })
    return mail; //returning the response
}


module.exports = sendemail;