"use strict";
var express_1 = require("express");
var health_1 = require("../controllers/health");
var router = express_1["default"].Router();
router.get('/', health_1["default"].healthCheck);
module.exports = router;
