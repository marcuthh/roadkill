import { Double, Timestamp } from '../../../../../../../AppData/Local/Microsoft/TypeScript/2.6/node_modules/@types/bson';

'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var TripSchema = new Schema({
    //collections
    stops: [{
        type: Schema.ObjectId,
        ref: 'Destination'
    }],
    vehiclesOnTrip: [{
        type: Schema.ObjectId,
        ref: 'Vehicle'
    }],
    travellersOnTrip: [{
        type: Schema.ObjectId,
        ref: 'Traveller'
    }],

    totalDistance: {
        type: Double,
        required: true
    },
    totalTime: { //stored in minutes
        type: int,
        required: true
    },
    finalArrivalTime: {
        type: Timestamp,
        required: true
    },
    completed: boolean
})

module.exports = mongoose.model('Trip', TripSchema);