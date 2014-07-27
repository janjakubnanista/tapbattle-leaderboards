'use strict';

/**
 * Module dependencies.
 */

var compression = require('compression');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var swig = require('swig');
var serveStatic = require('serve-static');

var winston = require('winston');
var helpers = require('view-helpers');
var config = require('./config');
var pkg = require('../package.json');

var env = process.env.NODE_ENV || 'development';
var dev = env === 'development';
var test = env === 'test';

/**
 * Expose
 */

module.exports = function(app) {
    // Compression middleware (should be placed before express.static)
    app.use(compression({
        threshold: 512
    }));

    // Static files middleware
    app.use(serveStatic(config.root + '/public'));

    // Don't log during tests
    // Logging middleware
    if (!test) {
        var logFormat = dev ? 'dev' : 'combined';
        var log = dev ? undefined : {
            stream: {
                write: function (message) {
                    winston.info(message);
                }
            }
        };

        app.use(morgan(logFormat, log));
    }

    // Swig templating engine settings
    if (dev || test) {
        swig.setDefaults({
            cache: false
        });
    }

    // set views path, template engine and default layout
    app.engine('html', swig.renderFile);
    app.set('views', config.root + '/app/views');
    app.set('view engine', 'html');

    // expose package.json to views
    app.use(function (req, res, next) {
        res.locals.pkg = pkg;
        res.locals.env = env;
        next();
    });

    // bodyParser should be above methodOverride
    app.use(bodyParser.json());

    // should be declared after session and flash
    app.use(helpers(pkg.name));
};
