"use strict";
exports.__esModule = true;
var dotenv = require("dotenv");
var mongoose = require("mongoose");
var user = require("./users/User");
dotenv.config();
var SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
var SERVER_PORT = process.env.SERVER_PORT || 5000;
var SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT
};
var config = { server: SERVER };
// Connect to mongodb and launch the HTTP server trough Express
mongoose.connect('mongodb://localhost:27017/connectfourdb')
    .then(function () {
    console.log("Connected to MongoDB");
    return user.getModel().findOne({ mail: "admin@postmessages.it" });
}).then(function (doc) {
    if (!doc) {
        console.log("Creating admin user");
        var u = user.newUser({
            username: "admin",
            mail: "admin@connectfour.it"
        });
        u.setAdmin();
        u.setModerator();
        u.setPassword("admin");
        return u.save();
    }
    else {
        console.log("Admin user already exists");
    }
}).then(function () {
    var server = http.createServer(app);
    server.listen(8080, function () { return console.log("HTTP Server started on port 8080"); });
})["catch"](function (err) {
    console.log("Error Occurred during initialization");
    console.log(err);
});
exports["default"] = config;
