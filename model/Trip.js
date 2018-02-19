'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TripSchema = new Schema({
    //collections
    stops: [{
        name: {
            type: String,
            //required: true
        },
        isRequiredStop: Boolean,
        isRestStop: Boolean,
        arrivalTime: {
            type: Date,
            //required: true,
            default: Date.now()
        },
        hasBeenReached: Boolean
    }],
    vehiclesOnTrip: [{
        type: Schema.Types.ObjectId,
        ref: 'Vehicle'
    }],
    travellersOnTrip: [{
        type: Schema.ObjectId,
        ref: 'Traveller'
    }],

    totalDistance: {
        type: Number,
        //required: true
    },
    totalTime: { //stored in minutes
        type: Number,
        //required: true
    },
    finalArrivalTime: {
        type: Date,
        //required: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    completed: Boolean
})

module.exports = mongoose.model('Trip', TripSchema);