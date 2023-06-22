var express = require('express')
const http = require('http')
var ejs = require('ejs');
const bodyParser = require('body-parser')
var url = require('url')
var session = require('express-session')
var cookieParser = require('cookie-parser');
var nodemailer = require('nodemailer');
const multer = require('multer');
const querystring = require('querystring');

var app = express()
app.use(session({secret: "Secret",saveUninitialized:true,resave:false}));
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Définir l'emplacement de stockage pour les fichiers téléchargés
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/') // Le dossier où les fichiers uploadés seront sauvegardés
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname) // Utilisez le nom d'origine du fichier
    }
});

// Instancier le middleware Multer
const upload = multer({ storage: storage });

app.set('view engine', 'ejs');//déclarer le moteur de rendue des fichiers .ejs
app.use(express.static(__dirname + '/views')) //en sah je sais plus a quoi ça sert

require('./js/API-post.js')(app, nodemailer, upload)
require('./js/API-get.js')(app, nodemailer)
require('./js/edit-my-account-API.js')(app, upload)
app.listen(3000)