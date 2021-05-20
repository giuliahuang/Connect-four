"use strict";
exports.__esModule = true;
var result = require('dotenv').config(); // The dotenv module will load a file named ".env"
// file and load all the key-value pairs into
// process.env (environment variable)
if (result.error) {
    console.log("Unable to load \".env\" file. Please provide one to store the JWT secret key");
    process.exit(-1);
}
if (!process.env.JWT_SECRET) {
    console.log("\".env\" file loaded but JWT_SECRET=<secret> key-value pair was not found");
    process.exit(-1);
}
var express = require("express");
/*import logger from './logger/logger';
import health from './routes/health';
import config from './config/config';*/
var http = require("http");
var jwt = require("express-jwt"); // JWT parsing middleware for express
var jsonwebtoken = require("jsonwebtoken"); // JWT generation
var cors = require("cors"); // Enable CORS middleware
var passport = require("passport");
var mongoose = require("mongoose");
var io = require("socket.io"); // Socket.io websocket library
var NAMESPACE = 'Server';
var ios = undefined;
var app = express();
var auth = jwt({ secret: process.env.JWT_SECRET });
//app.use([express.urlencoded({ extended: false }), express.json()])
app.use(cors());
/*
// Request logger
app.use((req, res, next) => {
  logger.info(
    NAMESPACE,
    `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`
  )
  res.on('finish', () => {
    logger.info(
      NAMESPACE,
      `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`
    )
  })
  next()
})

app.use('/health', health)

// Catch undefined endpoints
app.use((req, res, next) => {
  const error = new Error('Error 404: Resource not found')
  return res.status(404).json({ message: error.message })
})
*/
// User routes
app.get("/login", passport.authenticate('basic', { session: false }), function (req, res, next) {
    // If we reach this point, the user is successfully authenticated and
    // has been injected into req.user
    var _a, _b, _c, _d;
    // We now generate a JWT with the useful user data
    // and return it as response
    var tokendata = {
        username: (_a = req.user) === null || _a === void 0 ? void 0 : _a.username,
        roles: (_b = req.user) === null || _b === void 0 ? void 0 : _b.roles,
        mail: (_c = req.user) === null || _c === void 0 ? void 0 : _c.mail,
        id: (_d = req.user) === null || _d === void 0 ? void 0 : _d.id
    };
    console.log("Login granted. Generating token");
    var token_signed;
    if (process.env.JWT_SECRET) {
        token_signed = jsonwebtoken.sign(tokendata, process.env.JWT_SECRET, { expiresIn: '1h' });
    }
    else {
        //TODO: cambiare questo chiedendo al prof. Senza l'if else da errore perche ts non mi garantisce l'esistenza di process.env.JWT_SECRET quindi da errore
        var secret = "secret";
        jsonwebtoken.sign(tokendata, secret, { expiresIn: '1h' });
    }
    // Note: You can manually check the JWT content at https://jwt.io
    return res.status(200).json({ error: false, errormessage: "", token: token_signed });
});
// Connect to mongodb and launch the HTTP server trough Express
//
mongoose.connect('mongodb://mymongo:27017/postmessages')
    .then(function () {
    console.log("Connected to MongoDB");
}).then(function () {
    var server = http.createServer(app);
    ios = io(server);
    ios.on('connection', function (client) {
        console.log("Socket.io client connected".green);
    });
    server.listen(8080, function () { return console.log("HTTP Server started on port 8080".green); });
    // To start an HTTPS server we create an https.Server instance 
    // passing the express application middleware. Then, we start listening
    // on port 8443
    //
    /*
    https.createServer({
      key: fs.readFileSync('keys/key.pem'),
      cert: fs.readFileSync('keys/cert.pem')
    }, app).listen(8443);
    */
})["catch"](function (err) {
    console.log("Error Occurred during initialization".red);
    console.log(err);
});
/*
const httpServer = http.createServer(app)
httpServer.listen(config.server.port, () =>
  logger.info(
    NAMESPACE,
    `Server is running on ${config.server.hostname}:${config.server.port}`
  )
)*/
