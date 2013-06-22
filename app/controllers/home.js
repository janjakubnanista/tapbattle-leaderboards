'use strict';

exports.index = function (req, res) {
    res.format({
        html: function() {
            res.redirect(303, '/scores');
        },
        json: function() {
            res.json({
                scores: '/scores'
            });
        }
    });
};
