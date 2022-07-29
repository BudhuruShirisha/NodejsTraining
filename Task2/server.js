/* const express = require('express');
const path = require('path');
const nodeMailer = require('nodemailer');
const bodyParser = require('body-parser');

var app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.set('views', path.join(__dirname, '/views/'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = 3000;
app.get('/', function(req, res) {
    res.render('index');
});
app.post('/sendmail', function(req, res) {
    var transporter = nodeMailer.createTransport({
        service: 'smtp@gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: 'budhurushirisha97@gmail.com',
            pass: 'zjvsxfagjzsjounv'
        }
    });
    let mailOptions = req.body.params;
    let {
        from: 'budhurushirisha97@gmail.com>', // sender address
        to: req.body.to,
        subject: req.body.subject,
        text: req.body.text,
    } = req.body.params;

};


transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
    res.redirect('success.ejs', {
        title: "success page"

    });
});
});
app.listen(port, function() {
    console.log('Server is running at port: ', port);
});






//https://accounts.google.com/IssuedAuthSubTokens?hide_authsub= */