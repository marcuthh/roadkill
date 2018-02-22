'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TripSchema = new Schema({
    //collections
    stops: [{
        name: {
            type: String,
            required: true
        },
        isRequiredStop: Boolean,
        isRestStop: Boolean,
        arrivalTime: {
            type: Date,
            required: true,
        },
        milesInterval: Number, //distance from previous stop to this one
        minutesInterval: Number, //drive time from previous stop to this one
        hasBeenReached: Boolean
    }],
    vehiclesOnTrip: [{
        type: String,
        ref: 'Vehicle'
    }],
    travellersOnTrip: [{
        type: Schema.ObjectId,
        ref: 'Traveller'
    }],
    totalDistance: {
        type: Number,
        required: true
    },
    totalTime: { //stored in minutes
        type: Number,
        required: true
    },
    tripStartTime: {
        type: Date,
        default: Date.now()
    },
    finalArrivalTime: {
        type: Date,
        required: true
    },
    createdOn: {
        type: Date,
        required: true,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    completed: Boolean,
    isInactive: {
        type: Boolean,
        required: true,
        default: false
    }
})

module.exports = mongoose.model('Trip', TripSchema);