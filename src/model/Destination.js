import { Timestamp } from '../../../../../../../AppData/Local/Microsoft/TypeScript/2.6/node_modules/@types/bson';

'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var DestinationSchema = new Schema({
    name: {
        type: string,
        required: true
    },
    isRequiredStop: boolean,
    isRestStop: boolean,
    arrivalTime: {
        type: Timestamp,
        required: true
    },
    hasBeenReached: boolean
})

module.exports = mongoose.model('Destination', DestinationSchema);