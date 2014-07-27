'use strict';

var fs = require('fs');
var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/config');

var app = express();
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var host = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

// Connect to mongodb
var connect = function() {
    var options = { server: { socketOptions: { keepAlive: 1 } } };
    mongoose.connect(config.db, options);
};
connect();

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

// Bootstrap models
var modelsPath = __dirname + '/app/models';
fs.readdirSync(modelsPath).forEach(function (file) {
    if (~file.indexOf('.js')) require(modelsPath + '/' + file);
});

// Bootstrap application settings
require('./config/express')(app);

require('./config/i18n')(app);

// Bootstrap routes
require('./config/routes')(app);

app.listen(port, host);
console.log('Express app started on port ' + port);
