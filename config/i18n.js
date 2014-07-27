'use strict';

var I18n = require('i18n-2');

module.exports = function(app) {
    I18n.expressBind(app, {
        // setup some locales - other locales default to en silently
        locales: ['en', 'de', 'cs', 'sk'],
        defaultLocale: 'de',

        // change the cookie name from 'lang' to 'locale'
        cookieName: 'locale',

        directory: __dirname + '/strings',
        extension: '.json'
    });

    // This is how you'd set a locale from req.cookies.
    // Don't forget to set the cookie either on the client or in your Express app.
    app.use(function(req, res, next) {
        req.i18n.setLocale(req.i18n.preferredLocale(req));

        res.locals.locale = req.i18n.getLocale();

        next();
    });
};
