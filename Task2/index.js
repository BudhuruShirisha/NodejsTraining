const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const email = require('./router/email.js')

var app = express();
//set the engine to ejs
app.set('view engine', 'ejs');
// joining the path of the views folder
app.set('views', path.join(__dirname, '/views/'));
//using the bodyparser to parse the incoming requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = 3003;
app.get('/', function(req, res) {
    res.render('index');
});
// using the email router 
app.use('/', email);
//listening at the port 3003
app.listen(port, function() {
    console.log('Server is running at port: ', port);
});