var express = require('express')
const http = require('http')
var ejs = require('ejs');
const bodyParser = require('body-parser')
var url = require('url')
var session = require('express-session')
var cookieParser = require('cookie-parser');
var nodemailer = require('nodemailer');

var app = express()
app.use(session({secret: "Secret",saveUninitialized:true,resave:false}));
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.set('view engine', 'ejs');//déclarer le moteur de rendue des fichiers .ejs
app.use(express.static(__dirname + '/views')) //en sah je sais plus a quoi ça sert

require('./js/API.js')(app, nodemailer)
app.listen(3000)