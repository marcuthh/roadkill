'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TravellerSchema = new Schema({
    user: {
        type: String,
        ref: 'User'
    },
    seatRanking: Number,
    isTripLeader: Boolean,
    isCarLeader: Boolean,
    travelCar: {
        type: String,
        ref: 'Vehicle'
    },
    carSeatPos: {
        type: Number
    }
})

module.exports = mongoose.model('Traveller', TravellerSchema);