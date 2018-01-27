'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {
        type: string,
        unique: true
    },
    //neither name is required by schema
    //at least one name will need to be provided
    //this is handled on form validation
    name: {
        firstName: {
            type: string,
            // required: true
        },
        surname: {
            type: string,
            // required: true
        }
    },
    emailAddress: {
        type: string,
        unique: true
    },
    address: {
        houseNo: int,
        street: string,
        city: string,
        county: string,
        country: string,
        postCode: string
    },
    canDrive: boolean,
    hasThirdParty: boolean,
    //array of vehicles that this user is insured on
    insuredVehicles: [{
        type: Schema.ObjectId,
        ref: 'Vehicle'
    }]
})

module.exports = mongoose.model('User', UserSchema);