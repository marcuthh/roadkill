var Trip = require('../model/Trip');
var Traveller = require('../model/Traveller');
var User = require('../model/User');
var Vehicle = require('../model/Vehicle');
var mongoose = require('mongoose');

exports.getAllTrips = function (req, res) {
    query = Trip.find(function (err, trips) {
        if (err) {
            console.log(`error finding trips: ${err}`);
        } else {
            if (trips.length) {
                res.send(trips);
            } else {
                res.send(`no trips to display`);
            }
        }
    });
}

exports.getTrip = function (req, res) {
    var query = Trip.findById(req.params.id)
    query.exec(function (err, trip) {
        if (err) {
            console.log(`error finding trip: ${err}`);
        } else {
            res.send(trip);
        }
    });
}

exports.getUserTrips = function (req, res) {
    //find all instances where the user has been a traveller on a road trip, and return the traveller object's id
    let travellerQuery = Traveller.find({ user: req.params.id }).select('_id');
    travellerQuery.exec(function (travErr, travellers) {
        if (travErr) {
            console.log(`error finding travellers: ${travErr}`);
        } else {
            let trips = [];
            for (let i = 0; i < travellers.length; i++) {
                let tripQuery = Trip.findOne({ travellersOnTrip: { $all: travellers[i] } });
                tripQuery.exec(function (tripErr, trip) {
                    if (tripErr) {
                        console.log(`error finding trip: ${tripErr}`);
                    } else {
                        //append found trip object to array
                        trips.push(trip);

                        //output array content once all trips have been processed
                        if (i === (travellers.length - 1)) {
                            res.send(trips);
                        }
                    }
                });
            }
        }
    });
}

exports.getVehicleTrips = function (req, res) {
    let tripQuery = Trip.find({ vehiclesOnTrip: { $all: req.params.id } });
    tripQuery.exec(function (tripErr, trips) {
        if (tripErr) {
            console.log(`error finding trip: ${tripErr}`);
        } else {
            if (trips.length) {
                //output results
                res.send(trips);
            } else {
                res.send(`no trips found for vehicle '${req.params.id}'`);
            }
        }
    });
}

exports.getTripsFromSearchCriteria = function (req, res) {
    var query = {};
    let tripIds = [];
    if (req.body.user) {
        let travellerQuery = Traveller.find({ user: req.body.user }).select('_id');
        travellerQuery.exec(function (travErr, travellers) {
            if (travErr) {
                console.log(`error finding travellers: ${travErr}`);
            } else {
                for (let i = 0; i < travellers.length; i++) {
                    let tripQuery = Trip.findOne({ travellersOnTrip: { $all: travellers[i]._id } }).select('_id');
                    tripQuery.exec(function (tripErr, trip) {
                        if (tripErr) {
                            console.log(`error finding trips: ${err}`);
                        } else {
                            console.log(`${travellers[i]._id}'s trip object: ${trip._id}`);
                            //prevent same id being in array twice
                            if (tripIds.indexOf(trip._id) === -1) {
                                //add trip id to list for search criteria
                                tripIds.push(trip._id);
                            }
                            //once all looped through, look at building criteria
                            if (i === (travellers.length - 1)) {
                                //add condition to
                                query["_id"] = { $in: tripIds };
                                console.log(`conditions on line 100: ${query}`);
                                finalQuery = Trip.find(query);
                                finalQuery.exec(function (err, results) {
                                    console.log(results);
                                    res.send(results);
                                });
                            }
                        }
                    });
                }
            }
        });
    }
    if (req.body.veh) {
        //query for all trips that contain a vehicle with this registration
        let tripQuery = Trip.find({ vehiclesOnTrip: { $all: req.body.veh } }).select('_id');
        tripQuery.exec(function (tripErr, trips) {
            if (tripErr) {
                console.log(`error finding trip: ${tripErr}`);
            } else {
                if (trips.length) {
                    for (let i = 0; i < trips.length; i++) {
                        //prevent same id being in array twice
                        if (tripIds.indexOf(trips[i]._id) === -1) {
                            //append trip id to array
                            tripIds.push(trips[i]._id);
                        }
                    }
                    //add completed condition to array
                    query["_id"] = { $in: tripIds };
                    console.log(`conditions on line 125: ${query}`);
                    finalQuery = Trip.find(query);
                    finalQuery.exec(function (err, results) {
                        console.log(results);
                    });
                }
            }
        });
    }
    if (req.body.stops) {

    }
    if (req.body.completed !== undefined) {
        query["completed"] = req.body.completed;
        console.log(`conditions on line 134: ${query}`);
    }

    //default to combining the conditions - more complex filter will typically bring back fewer results
    var finalQuery = Trip.find(query);
    //user can choose to 'or' the conditions
    if (req.body.orConditions) {
        //will bring back anything that meets one or more of the conditions
        //finalQuery = Trip.find(query).or(query);
    }

    console.log(`conditions on line 147: ${query}`);
    //run the query and output results
    finalQuery.exec(function (err, trips) {
        if (err) {
            console.log(`error finding trips: ${err}`);
            res.send(`error finding trips: ${err}`);
        } else {
            if (trips.length) {
                console.log(trips);
            } else {
                console.log(`no trips match your criteria`);
                res.send(`no trips match your criteria`);
            }
        }
    });
}

exports.create = function (req, res) {
    var travellers = [];
    var vehicles = []; //empty array initially - add ids as they are brought in by travellers
    for (let i = 0; i < req.body.travs.length; i++) {
        let reqTrav = req.body.travs[i];
        if (reqTrav.user) {
            let userQuery = User.findById(reqTrav.user);
            userQuery.exec(function (err, profile) {
                if (err) {
                    console.log(`error getting profile: ${err}`);
                } else {
                    if (!profile.isInactive) { //only allow profiles that haven't been 'deleted'
                        let newTraveller;
                        newTraveller = new Traveller({
                            user: reqTrav.user,
                            isTripLeader: reqTrav.isTripLeader
                        });
                        //check that car data exists before populating
                        if (reqTrav.travelCar) {
                            newTraveller.travelCar = reqTrav.travelCar;
                            newTraveller.carSeatPos = reqTrav.carSeatPos;
                            if (vehicles.indexOf(reqTrav.travelCar) < 0) {
                                vehicles.push(reqTrav.travelCar);
                            }
                            newTraveller.isCarLeader = reqTrav.isCarLeader;
                        }
                        newTraveller.save(function (err) {
                            if (err) {
                                console.log('error: ' + err);
                            } else {
                                //place in array that will be added to trip
                                travellers.push(newTraveller);
                                console.log(travellers);
                                //only build & save trip once last traveller has been processed
                                if (i === req.body.travs.length - 1) {
                                    let trip = new Trip({
                                        travellersOnTrip: travellers,
                                        vehiclesOnTrip: vehicles
                                    });

                                    trip.save(function (err) {
                                        if (err) {
                                            console.log(`error saving trip: ${err}`);
                                        } else {
                                            res.send(trip);
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }
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

}