var express = require('express');
var request = require('request');
var nodemailer = require('nodemailer');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

require('dotenv').config();
var myPassword = process.env.myPassword;
var myEmail = process.env.myEmail;
var myContactEmail = process.env.myContactEmail;

var PORT = process.env.PORT || 3000;

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PUT,DELETE');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});


// Used for production build
app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function(req, res, next){
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

app.post('/postContact', function (req, res, next) {

  var name = req.body.name;
  var email = req.body.email;
  var subject = req.body.subject;
  var message = req.body.message;

  var transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
              user: myEmail, // Your email id
              pass: myPassword // Your password
          }
  });

  var mailOptions = {
    from: myContactEmail, // sender address
    to: myEmail, // list of receivers
    subject: subject, // Subject line
    html: '<p>From: '+name+'</p>'+
          '<p>Subject: '+subject+'</p>'+
          '<p>Message: <br/>'+message+'</p>'
  };

  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          console.log(error);
          res.json({yo: 'error'});
      }else{
          console.log('Message sent: ' + info.response);
          res.json({yo: info.response});
      }
  });

  // request({
  //   "url": "http://learningofthefuture.net/contact-form.php",
  //   "method": "POST",
  //   "headers": {
  //     "content-type": "application/x-www-form-urlencoded"
  //     },
  //   body: "name="+name+"&email="+email+"&subject="+subject+"&message="+message
  //
  // }, function(error, response, body){
  //     if(error) {
  //           res.send(error);
  //     } else {
  //           console.log("body: ", body);
  //           res.send(body);
  //     }
  // });
});

app.listen(PORT, function(){
  console.log("Server is running on: ", PORT);
});
