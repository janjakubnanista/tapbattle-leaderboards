'use strict';

/**
 * Module dependencies.
 */

var path = require('path');
var extend = require('util')._extend;

var env = process.env.NODE_ENV || 'development';
var development = require('./env/development');
var test = require('./env/test');
var production = require('./env/production');

var defaults = {
    root: path.normalize(__dirname + '/..')
};

/**
 * Expose
 */

module.exports = {
    development: extend(development, defaults),
    test: extend(test, defaults),
    production: extend(production, defaults)
}[env];
