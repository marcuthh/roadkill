'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DestinationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    isRequiredStop: Boolean,
    isRestStop: Boolean,
    arrivalTime: {
        type: Date,
        required: true
    },
    hasBeenReached: Boolean
})

module.exports = mongoose.model('Destination', DestinationSchema);