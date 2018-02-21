var Trip = require('../model/Trip');
var Traveller = require('../model/Traveller');
var Vehicle = require('../model/Vehicle');
var User = require('../model/User');
var mongoose = require('mongoose');

exports.getUserTrips = function (req, res) {
    var query = Trip.find({ travellersOnTrip: req.session.user._id });

    query.sort({ createdOn: 'desc' })
        .limit(10)
        .exec(function (err, results) {
            res.render('/', {
                title: 'roadKill - My Roadtrips',
                trips: results,
                user: req.user
            });
        });
}

exports.create = function (req, res) {
    var travellers = new Array(req.body.travs.length);
    var vehicles = []; //empty array initially - add ids as they are brought in by travellers
    for (let i = 0; i < req.body.travs.length; i++) {
        let reqTrav = req.body.travs[i];
        if (reqTrav.user) {
            travellers[i] = new Traveller({
                user: reqTrav.user
            });
        } else {
            //no user account
            //build non-user traveller object
            travellers[i] = new Traveller({
                nonuser: {
                    name: {
                        firstName: reqTrav.firstName,
                        surname: reqTrav.surname
                    },
                    address: {
                        houseNo: reqTrav.houseNo,
                        street: reqTrav.street,
                        city: reqTrav.city,
                        county: reqTrav.county,
                        country: reqTrav.country,
                        postCode: reqTrav.postCode
                    },
                    canDrive: reqTrav.canDrive,
                    hasThirdParty: reqTrav.hasThirdParty
                    //vehicle population done in callback
                }
            });
        }

        travellers[i].isTripLeader = reqTrav.isTripLeader;
        travellers[i].isCarLeader = reqTrav.isCarLeader;
        if (reqTrav.travelCar) {
            travellers[i].travelCar = reqTrav.travelCar;
            travellers[i].carSeatPos = reqTrav.carSeatPos;
            if (vehicles.indexOf(reqTrav.travelCar) < 0) {
                vehicles.push(reqTrav.travelCar);
            }
        }
        travellers[i].save(function (err) {
            if (err) {
                console.log('error: ' + err);
            } else {
            }
        });
    }

    // var destinations = [
    //     //in-between stops are added via a separate request
    //     //first stop
    //     {
    //         name: req.body.startPointName,
    //         isRequiredStop: true,
    //         isRestStop: false,
    //         //arrival time at first stop in array effectively functions as departure time
    //         arrivalTime: new Date(req.body.departureTime),
    //         hasBeenReached = false,
    //     },
    //     //last stop
    //     {
    //         name: req.body.endPointName,
    //         isRequiredStop: true,
    //         isRestStop: false,
    //         //arrival time at first stop in array effectively functions as departure time
    //         arrivalTime: new Date(req.body.finalArrivalTime),
    //         hasBeenReached = false,
    //     }
    // ];

    let trip = new Trip({
        travellersOnTrip: travellers,
        vehiclesOnTrip: vehicles
    });

    trip.save(function (err) {
        if (err) {
            console.log(`error saving trip:  + ${err}`);
        } else {
            res.send(trip);
        }
    });
}

exports.getTrip = function (req, res) {
    res.render('newtrip', { title: 'roadKill - New Trip' });
}