const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const messages = require("./db/messages");
const users = require("./db/users");

const app = express();
var session = require('express-session');

app.use(morgan("tiny"));
app.use(cors());
app.use(bodyParser.json());


app.use(session({
  secret : 'yourSecret',
  resave : false,
  saveUninitialized : false,
  }));

app.get("/", (req, res) => {
  res.json({
    message: "Behold The MEVN Stack!",
  });
});

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
app.get("/register", (req, res) => {
  users.getAll().then((users) => {
    res.json(users);
  });
});

app.post("/login",  async (req,res) =>{
  var TF = await users.findUser(req.body);
  console.log(TF);
  if (TF) {
    req.session.username = req.body.username;
    
  }
  res.json({"exists": TF, "user":req.body.username});

});

app.get('/session', function(req,res,next){
  res.send(req.session.username );
  console.log(req.session.username ) ;
});


const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
