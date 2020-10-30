const monk = require("monk");
const connectionString = "localhost/zoomVue";
const db = monk(connectionString);

module.exports = db;
