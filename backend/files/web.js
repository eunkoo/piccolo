const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const fileUpload = require('express-fileupload');


const app = express()
/*
app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });
*/
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cors())
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  },{
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

require('./server/router')(app);

app.get('*', (req, res) => res.status(200).send({
  message: 'API Schedules Work ... !!!',
}));
// app.get('/', function (req, res) {
//     //res.send('Hello World!');
//     res.sendFile(__dirname + '/frontend/index.html');
//  });
app.listen(process.env.PORT || 8001)
