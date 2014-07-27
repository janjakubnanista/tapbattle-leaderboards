'use strict';

var mongoose = require('mongoose');
var Score = mongoose.model('Score');
var md5 = require('MD5');

var SECRET = 'vfdlL---j158bfg_vfbdkHJFYP1564_---dfbg57ovdfik_BDRGD';

var serialize = function(model) {
    return {
        _links: {
            self: { href: '/scores/' + model.id }
        },
        taps: model.taps,
        name: model.name
    };
};

exports.index = function(req, res) {
    var page = parseInt(req.param('page'), 10) - 1 || 0;
    var pageSize = parseInt(req.param('pageSize'), 10) || 100;

    if (page < 0 || pageSize < 1) {
        return res.render('400'); // TODO
    }

    var options = {
        skip: page * pageSize,
        limit: pageSize,
        sort:{
            taps: -1
        }
    };

    Score.find(null, null, options, function(err, scores) {
        if (err) {
            return res.render('500'); // TODO
        }

        Score.count().exec(function (err, count) {
            var hasPrev = page > 0;
            var hasNext = options.skip + pageSize < count;
            var prevLink = hasPrev ? { href: '/scores?page=' + page } : null;
            var nextLink = hasNext ? { href: '/scores?page=' + (page + 2) } : null;

            res.format({
                json: function() {
                    res.json({
                        _links: {
                            self: { href: '/scores?page=' + (page + 1) },
                            next: nextLink,
                            prev: prevLink
                        },
                        _embedded: {
                            scores: scores.map(serialize)
                        }
                    });
                },
                html: function() {
                    res.render('scores/index', {
                        title: req.i18n.__('Leaderboards'),
                        scores: scores,
                        page: page + 1,
                        next: nextLink,
                        prev: prevLink
                    });
                }
            });
        });
    });
};

exports.show = function(req, res) {
    res.format({
        json: function() {
            res.json(serialize(req.score));
        },
        html: function() {
            res.render('scores/show', {
                title: 'TapBattle scores',
                score: req.score
            });
        }
    });
};

exports.create = function(req, res) {
    var score = new Score(req.body);

    var token = req.headers.token;
    var compareToken = new Buffer(md5(SECRET + req.body.taps + req.body.name)).toString('base64');

    if (token !== compareToken) {
        return res.render('401');
    }

    score.save(function(err) {
        if (err) {
            return res.render('500'); // TODO
        }

        res.format({
            json: function() {
                res.status(201).send(serialize(score));
            },
            html: function() {
                res.redirect('/scores/' + score.id);
            }
        });
    });
};

exports.load = function(req, res, next, id) {
    Score.findById(id, function (err, score) {
        err = err || score ? null : new Error('not found');
        if (err) {
            return next(err);
        }

        req.score = score;

        next();
    });
};
