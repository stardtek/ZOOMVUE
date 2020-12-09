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
  return messages.find({to: {$in: [usernames.too, usernames.from] } ,from: {$in: [usernames.too, usernames.from] }});

  
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
