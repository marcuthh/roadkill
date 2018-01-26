'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var TravellerSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    seatRanking: int,
    isTripLeader: boolean,
    isCarLeader: boolean
})

module.exports = mongoose.model('Traveller', TravellerSchema);