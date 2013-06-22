'use strict';

/**
 * Module dependencies.
 */

var home = require('home');
var scores = require('scores');

/**
 * Expose
 */

module.exports = function(app) {
    app.get('/', home.index);

    app.param('id', scores.load);
    app.get('/scores', scores.index);
    app.post('/scores', scores.create);
    app.get('/scores/:id', scores.show);

    /**
     * Error handling
     */

    app.use(function (err, req, res, next) {
        // treat as 404
        if (err.message
            && (~err.message.indexOf('not found')
            || (~err.message.indexOf('Cast to ObjectId failed')))) {
            return next();
        }

        console.error(err.stack);

        // error page
        res.status(500).render('500', { error: err.stack });
    });

    // assume 404 since no middleware responded
    app.use(function (req, res) {
        res.status(404).render('404', {
            url: req.originalUrl,
            error: 'Not found'
        });
    });
};
