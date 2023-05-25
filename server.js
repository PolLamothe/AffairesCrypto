var express = require('express')
const http = require('http')
var ejs = require('ejs');
const bodyParser = require('body-parser')

var app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.set('view engine', 'ejs');//déclarer le moteur de rendue des fichiers .ejs
app.use(express.static(__dirname + '/views')) //en sah je sais plus a quoi ça sert

require('./js/API.js')(app)
app.listen(3000)