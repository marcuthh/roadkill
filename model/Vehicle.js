'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SeatSchema = new Schema({
    position: Number,
    name: String
});

module.exports = mongoose.model('Seat', SeatSchema);

var VehicleSchema = new Schema({
    _id: String,
    make: String,
    model: String,
    colour: String,
    seats: {
        type: [SeatSchema],
        required: true
    },
    isInactive: {
        type: Boolean,
        required: true,
        default: false
    }
})

module.exports = mongoose.model('Vehicle', VehicleSchema);