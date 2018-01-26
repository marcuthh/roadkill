'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var VehicleSchema = new Schema({
    vehicleReg: {
        type: string,
        required: true,
        unique: true
    },
    make: string,
    model: string,
    colour: string,
    numSeats: {
        type: int,
        required: true,
        default: 5 //assume typical 5-seat car
    },
})

module.exports = mongoose.model('Vehicle', VehicleSchema);