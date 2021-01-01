const Joi = require("joi");
const db = require("./connection");

const schema = Joi.object().keys({
  from: Joi.string().required(),
  message: Joi.string().max(2000).required(),
  to: Joi.string().required(),
});

const messages = db.get("messages");

function getAll() {
  return messages.find();
}
async function getMessages(usernames) {
  if(usernames.too !== usernames.from){
    // return messages.find({to: {$in: [usernames.too, usernames.from] } ,from: {$in: [usernames.too, usernames.from] }});
    return messages.find({$or : 
      [{to: {$in: [usernames.too] } ,from: {$in: [usernames.from] }},
      {to: {$in: [usernames.from] } ,from: {$in: [usernames.too] }}, ]
    });
    
  }
  else{
    return messages.find({to: {$in: [usernames.too] } ,from: {$in: [usernames.from] }});
  }
  

  
}

async function save(message) {

  const result = schema.validate(message);
  console.log("pride sm ", message, result);
  if (result.error == null) {
    message.created = new Date();
    return messages.insert(message);
  } else {
    return Promise.reject(result.error);
  }
}

module.exports = {
  save,
  getAll,
  getMessages,
};
