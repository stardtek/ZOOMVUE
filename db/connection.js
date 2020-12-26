const monk = require("monk");
const connectionString = "mongodb+srv://root:root@cluster0.6isbp.mongodb.net/TPO?retryWrites=true&w=majority";
const db = monk(connectionString);

module.exports = db;
