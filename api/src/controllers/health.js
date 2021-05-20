"use strict";
exports.__esModule = true;
var logger_1 = require("../logger/logger");
var NAMESPACE = 'Sample Controller';
var healthCheck = function (req, res, next) {
    logger_1["default"].info(NAMESPACE, 'Health check route');
    return res.status(200).json({ message: 'API is up and running' });
};
exports["default"] = { healthCheck: healthCheck };
