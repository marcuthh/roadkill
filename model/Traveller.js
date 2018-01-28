'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TravellerSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    seatRanking: Number,
    isTripLeader: Boolean,
    isCarLeader: Boolean
})

module.exports = mongoose.model('Traveller', TravellerSchema);