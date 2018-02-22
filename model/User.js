'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    _id: String,
    pwd: {
        type: String,
        required: true
    },
    name: {
        firstName: {
            type: String,
            required: true
        },
        surname: {
            type: String,
            required: true
        }
    },
    emailAddress: {
        type: String,
        unique: true,
        required: true
    },
    isSystemAdmin: Boolean,
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
        type: String,
        ref: 'Vehicle'
    }],
    isLoggedIn: {
        type: Boolean,
        required: true,
        default: false
    },
    isInactive: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = mongoose.model('User', UserSchema);