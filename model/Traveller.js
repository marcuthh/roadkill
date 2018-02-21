'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TravellerSchema = new Schema({
    user: {
        type: String,
        ref: 'User'
    },
    nonuser: {
        name: {
            firstName: {
                type: String,
            },
            surname: {
                type: String,
            }
        },
        address: {
            houseNo: Number,
            street: String,
            city: String,
            county: String,
            country: String,
            postCode: String
        },
        canDrive: Boolean,
        hasThirdParty: Boolean,
        //array of vehicles that this user is insured on
        insuredVehicles: [{
            type: Schema.ObjectId,
            ref: 'Vehicle'
        }],
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