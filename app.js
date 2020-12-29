require('dotenv').config()
const express = require('express');
const app = express();
var bodyParser = require('body-parser')

var port = process.env.PORT || 3000; 

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static(__dirname + '/public'))

loadRoutes()

function loadRoutes() {
    //Routes  
    const authorizationRouter = require('./routes/authorizationRoutes');
    
    app.use(`/auth`, authorizationRouter)
}
app.listen(port);