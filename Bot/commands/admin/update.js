const fs = require("fs")
module.exports.setup = function(user) {
    const type = JSON.parse(fs.readFileSync(__dirname + "/../../type.json"))
    const users = JSON.parse(fs.readFileSync(__dirname + "/../../users.json"))
    users[user.id] = type
}