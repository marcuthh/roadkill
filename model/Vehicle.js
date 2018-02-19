'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SeatSchema = new Schema({
    position: Number,
    name: String
});

module.exports = mongoose.model('Seat', SeatSchema);

var VehicleSchema = new Schema({
    vehicleReg: {
        type: String,
        required: true,
        unique: true
    },
    make: String,
    model: String,
    colour: String,
    seats: {
        type: [SeatSchema],
        required: true
    }
})

module.exports = mongoose.model('Vehicle', VehicleSchema);