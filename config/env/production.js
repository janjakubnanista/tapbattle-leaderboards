'use strict';

/**
 * Expose
 */

var host = process.env.OPENSHIFT_MONGODB_DB_HOST || '127.0.0.1';
var port = process.env.OPENSHIFT_MONGODB_DB_PORT || 27017;
var user = process.env.OPENSHIFT_MONGODB_DB_USERNAME;
var password = process.env.OPENSHIFT_MONGODB_DB_PASSWORD;

module.exports = {
    db: 'mongodb://' + user + ':' + password + '@' + host + ':' + port + '/tapbattle'
};
