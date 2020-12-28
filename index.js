const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const path = require('path');

const messages = require("./db/messages");
const users = require("./db/users");

const fs = require('fs');
const https = require('https');
require('dotenv').config();

const expressWs = require('express-ws');
let app = express();

if (process.env.HTTPS === 1) {
  // TODO this could be wrong or just needs proper SSL certificate and domain to work
  // WebSocket via SSL
  expressWs(app, https.createServer({
    key: fs.readFileSync(process.env.SSL_KEY),
    cert: fs.readFileSync(process.env.SSL_CERT),
  }));
} else {
  expressWs(app);
}


var session = require('express-session');

app.use(morgan("tiny"));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client/public')));



app.use(session({
  secret : 'yourSecret',
  resave : false,
  saveUninitialized : false,
  }));

app.set('trust proxy', 1) // trust first proxy
session.username=[];

const conference = require('./routes/conference');
app.use('/conference', conference);

const chat = require('./routes/chat');
app.use('/chat', chat);

const privateChat = require('./routes/privateChat');
app.use('/privateChat', privateChat);

// TODO move these endpoints into appropriate routes
// https://www.tutorialspoint.com/expressjs/expressjs_routing.htm

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

app.get("/messages", (req, res) => {
  messages.getAll().then((messages) => {
    res.json(messages);
  });
});

app.post("/messages", (req, res) => {
  console.log(req.body);
  messages
    .create(req.body)
    .then((message) => {
      res.json(message);
    })
    .catch((error) => {
      res.status(500);
      res.json(error);
    });
});

app.post("/register", (req, res) => {
  console.log(req.body);
  users
    .insert(req.body)
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      console.log(error);
      res.status(500);
      res.json(error);

    });
});
/* za dzabe d sm testiru c dobim use */

app.get("/allUsers", (req, res) => {
  users.getAll().then((users) => {
    res.json(users);
  });
});

app.post("/login",  async (req,res) =>{
  var TF = await users.findUser(req.body) ;
  console.log(TF);
  if (TF) {
    console.log("session");
    console.log(req.body.username);
    session.username.push( req.body.username );

  }
  res.json({"exists": TF, "user":req.body.username});

});

app.get('/session', function(req,res){
  res.send(session.username );
  console.log(session.username ) ;
});

app.get('/usernames', function(req,res){
  users.getUsernames().then((usernames) => {
    res.json(usernames);
  });
});
app.post('/getUsermessages', function(req,res){
  console.log(req.body);
  messages.getMessages(req.body).then((mess) => {
    res.json(mess);
  });
});


const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Listening on ${process.env.HTTPS == 1 ? 'https' : 'http'}://localhost:${port}`);
});
