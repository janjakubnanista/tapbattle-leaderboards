
/*!
 * Module dependencies
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Score schema
 */

var ScoreSchema = new Schema({
    name: { type: String },
    taps: { type: Number }
});

mongoose.model('Score', ScoreSchema, 'scores');
