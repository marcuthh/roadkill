'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    pwd: String,
    name: {
        //neither name is required by schema
        //at least one name will need to be provided
        //this is handled on form validation
        firstName: {
            type: String,
            // required: true
        },
        surname: {
            type: String,
            // required: true
        }
    },
    emailAddress: {
        type: String,
        unique: true
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
    isLoggedIn: {
        type: Boolean,
        required: true,
        default: false
    }
})

module.exports = mongoose.model('User', UserSchema);