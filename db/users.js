const db = require("./connection");

// Collection Users
const users = db.get("users");
// Create Index email & username
users.createIndex(["email", "username"], { unique: true });

module.exports = users;
