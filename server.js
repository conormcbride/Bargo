var express = require('express')
var app = express()
var port = process.env.PORT || 3000
var morgan = require('morgan')// <------Middleware------->
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var router = express.Router()
var appRoutes = require('./app/routes/api')(router)  //user router object with this route file
var path = require('path')
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
require('./app/passport/passport.js')(passport, FacebookStrategy, TwitterStrategy, GoogleStrategy, app)

// <!-- All Routes -->

var staff = require('./app/routes/staffroutes')
var bar = require('./app/routes/barroutes')
var mail = require('./app/routes/mailroutes')



app.use(morgan('dev')); // logs requests eg. "GET /404" or "GET/home 200 in console
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(express.static(__dirname+ '/public'))//give frontend access to the public folder
app.use('/api', appRoutes);// defining backend routes to differentiate from frontend routes to avoid nameing conflictions


app.delete('/staff/:id', staff.deleteStaff);
app.get('/staff/:id', staff.findOne);

app.get('/staff', staff.findAll);
app.post('/staff', staff.newStaff);
app.put('/staff/:id/update', staff.updateRateOfPay);
app.put('/staff/:id', staff.incrementDaysAbscent);

app.delete('/bar/:id', bar.deleteBar);
app.get('/bar/:id', bar.findOne);
app.get('/bar', bar.findAll);
app.post('/bar', bar.addBar);
app.put('/bar/:id/update', bar.updateBarEarnings);

app.get('/mail', mail.findAll);
app.post('/mail', mail.addMail);
app.delete('/mail', mail.deleteMail);



mongoose.connect('mongodb://localhost:27017/managementdb', function(err){
    if (err){
        console.log('Not connected to the db' + err)
    } else {
        console.log('Successfully Connected to the db')

    }
});


app.get('*',function (req,res) {
    res.sendFile(path.join(__dirname+ '/public/app/views/index.html'))
});

// app.get('*',function (req,res) {
//     res.sendFile(path.join(__dirname))
// });


//process.env.PORT use 3000 or deployment enviornments server
app.listen(port, function () {
    console.log('Running Server on port '+ port)
});
