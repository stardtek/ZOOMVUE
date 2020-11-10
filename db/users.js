const Joi = require("joi");
const db = require("./connection");

const schema = Joi.object().keys({
  username: Joi.string().alphanum().required(),
  email: Joi.string().required(),
  password: Joi.string().max(500).required().min(8)
});




const users = db.get("users");



async function getUser() {
  return users.find({},["username", "email"]);
}

async function getAll() {
  return users.find({},["username", "email"]);
}

 async function insert (user) {
    const result = schema.validate(user);
    console.log(user);
    var exists = true;
    var everbody = await getAll() ;
    everbody.forEach(element => {
        if (element.email == user.email || element.username == user.username) {
            exists = false;   
        }
    });
    

    if (result.error != null) {
        return Promise.reject({"error" :result.error.message});
        
          
    }
     else if (exists) {
        user.created = new Date();
        users.insert(user)
        return {"ok": "Succes"};
    }
    else{
        return( Promise.reject({"error": "Email or username alreadi in use!"} ) );
    }
      
  }

  async function findUser(loginData) {
      var ret = await users.find({"username": loginData.username, "password" : loginData.password});
      //console.log(ret);
      /* >= vecus test base has same users in */
      if (ret.length >= 1) {
        return true;
        
      }
      else{
        return false;
      }

    
  }


  module.exports = {
    insert,
    getAll,
    findUser,
  };