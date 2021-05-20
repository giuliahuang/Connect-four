"use strict";
exports.__esModule = true;
var dotenv = require("dotenv");
dotenv.config();
var SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
var SERVER_PORT = process.env.SERVER_PORT || 5000;
var SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT
};
var config = { server: SERVER };
exports["default"] = config;
