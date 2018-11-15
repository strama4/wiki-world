const express = require('express');
const app = express();

module.exports = app;

const mainConfig = require('./src/config/main-config');
const routeConfig = require('./src/config/route-config');

mainConfig.init(app, express);
routeConfig.init(app);
