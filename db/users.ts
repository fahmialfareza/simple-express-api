import db from "./connection";

// Collection Users
const users = db.get("users");
// Create Index email & username
// @ts-ignore
users.createIndex(["email", "username"], { unique: true });

export default users;
