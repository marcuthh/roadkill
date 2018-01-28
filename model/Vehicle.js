'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VehicleSchema = new Schema({
    vehicleReg: {
        type: String,
        required: true,
        unique: true
    },
    make: String,
    model: String,
    colour: String,
    numSeats: {
        type: Number,
        required: true,
        default: 5 //assume typical 5-seat car
    },
})

module.exports = mongoose.model('Vehicle', VehicleSchema);