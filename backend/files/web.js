const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const fileUpload = require('express-fileupload');
const path = require('path')


const app = express(),
            DIST_DIR = __dirname,
            HTML_FILE = path.join(DIST_DIR, 'frontend/files/dist/index.html')

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin,Accept,X-Requested-With,Content-Type,Access-Control-Request-Method,Access-Control-Request-Headers,Authorization");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.header("Access-Control-Max-Age", "3600");
  next();
});



app.use(express.static(path.join(DIST_DIR,'frontend/files/dist')))
app.get('*', (req, res) => {
    res.sendFile(HTML_FILE)
})


app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cors())
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  },{
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));


app.use('/frontend/files/uploads', express.static('/frontend/files/uploads'));

require('./server/router')(app);



app.get('*', (req, res) => res.status(200).send({
  message: 'API Schedules Work ... !!!',
}));
// app.get('/', function (req, res) {
//     //res.send('Hello World!');
//     res.sendFile(__dirname + '/frontend/index.html');
//  });
app.listen(process.env.PORT || 8001)
