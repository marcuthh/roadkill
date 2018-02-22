var Trip = require('../model/Trip');
var Traveller = require('../model/Traveller');
var User = require('../model/User');
var Vehicle = require('../model/Vehicle');
var mongoose = require('mongoose');

exports.getAllTrips = function (req, res) {
    query = Trip.find({ isInactive: false }, function (err, trips) {
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
    var query = Trip.findOne({ _id: req.params.id, isInactive: false });
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
                let tripQuery = Trip.findOne({ travellersOnTrip: { $all: travellers[i]._id }, isInactive: false });
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
    let tripQuery = Trip.find({ vehiclesOnTrip: { $all: req.params.id }, isInactive: false });
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
                    let tripQuery = Trip.findOne({ travellersOnTrip: { $all: travellers[i]._id }, isInactive: false }).select('_id');
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

exports.addVehicleToTrip = function (req, res) {
    let query = Trip.findOne({ _id: req.params.id, isInactive: false });

    query.exec(function (err, trip) {
        if (req.body.vehs.length) {
            for (let i = 0; i < req.body.vehs.length; i++) {
                let vehicle = req.body.vehs[i];
                //build and write the vehicle object to database
                if (vehicle.reg) {
                    //query database to get the object id of the vehicle
                    var query = Vehicle.findOne({ _id: vehicle.reg });
                    query.exec(function (err, result) {
                        if (err) {
                            console.log(`error finding vehicle: ${err}`);
                            res.send(`error finding vehicle: ${err}`);
                        } else {
                            if (result) { //a vehicle exists with a matching reg - use existing record
                                //append existing vehicle's unique id to the array
                                trip.vehiclesOnTrip.push(result._id);
                                Trip.updateOne({ _id: trip._id },
                                    {
                                        //update array field in user's document
                                        vehiclesOnTrip: trip.vehiclesOnTrip
                                    },
                                    (err, raw) => {
                                        if (err) {
                                            console.log(`error saving vehicle to trip: ${err}`);
                                        } else {
                                            if (i === (req.body.vehs.length - 1)) {
                                                //output completed trip with all vehicles added
                                                //^^has to be done in last callback iteration - otherwise vehicles not included
                                                res.send(trip);
                                            }
                                        }
                                    });
                            } else {
                                vehicle = new Vehicle({
                                    _id: vehicle.reg,
                                    make: vehicle.make,
                                    model: vehicle.model,
                                    colour: vehicle.colour
                                });
                                //default to 5 seats if no value provided
                                if (!vehicle.numSeats || vehicle.numSeats === 5) {
                                    vehicle.seats = [
                                        {
                                            position: 1,
                                            name: "Driver"
                                        },
                                        {
                                            position: 2,
                                            name: "Passenger"
                                        },
                                        {
                                            position: 3,
                                            name: "Back Left"
                                        },
                                        {
                                            position: 4,
                                            name: "Back Right"
                                        },
                                        {
                                            position: 5,
                                            name: "Middle"
                                        }
                                    ];
                                } else if (vehicle.numSeats === 2) {
                                    vehicle.seats = [
                                        {
                                            position: 1,
                                            name: "Driver"
                                        },
                                        {
                                            position: 2,
                                            name: "Passenger"
                                        }
                                    ];
                                } else if (vehicle.numSeats === 7) {
                                    vehicle.seats = [
                                        {
                                            position: 1,
                                            name: "Driver"
                                        },
                                        {
                                            position: 2,
                                            name: "Passenger"
                                        },
                                        {
                                            position: 3,
                                            name: "Back Left"
                                        },
                                        {
                                            position: 4,
                                            name: "Back Right"
                                        },
                                        {
                                            position: 5,
                                            name: "Boot Left"
                                        },
                                        {
                                            position: 6,
                                            name: "Boot Right"
                                        },
                                        {
                                            position: 7,
                                            name: "Middle"
                                        }
                                    ];
                                }
                                //write new vehicle to database
                                vehicle.save(function (err) {
                                    if (err) {
                                        console.log(`error saving vehicle: ${err}`);
                                    } else {
                                        if (vehicle._id) {
                                            //append new vehicle's unique id to the array
                                            trip.vehiclesOnTrip.push(vehicle._id);
                                            //update user's record to include 
                                            Trip.updateOne({ _id: trip._id },
                                                {
                                                    //update array field in user's document
                                                    vehiclesOnTrip: trip.vehiclesOnTrip
                                                },
                                                (err, raw) => {
                                                    if (err) {
                                                        console.log(`error saving user's vehicles: ${err}`);
                                                    } else {
                                                        if (i === (req.body.vehs.length - 1)) {
                                                            //output completed trip with all vehicles added
                                                            //^^has to be done in last callback iteration - otherwise vehicles not included
                                                            res.send(trip);
                                                        }
                                                    }
                                                }
                                            );
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
    });
}

exports.removeVehicleFromTrip = function (req, res) {
    if (req.params.id) {
        let query = Trip.findOne({ _id: req.params.id, isInactive: false });

        query.exec(function (err, trip) {
            if (err) {
                console.log(`error finding trip: ${err}`);
            } else {
                if (req.body.vehs.length) {
                    for (let i = 0; i < req.body.vehs.length; i++) {
                        let matchPos = trip.vehiclesOnTrip.indexOf(req.body.vehs[i]);
                        if (matchPos > - 1) {
                            trip.vehiclesOnTrip.splice(matchPos, 1);

                            //output results on last iteration
                            if (i === (req.body.vehs.length - 1)) {
                                Trip.findByIdAndUpdate(req.params.id,
                                    {
                                        vehiclesOnTrip: trip.vehiclesOnTrip
                                    },
                                    (upErr, result) => {
                                        if (upErr) {
                                            console.log(`error updating trip: ${upErr}`);
                                        } else {
                                            res.send(trip);
                                        }
                                    }
                                );
                            }
                        }
                    }
                }
            }
        });
    }
}

exports.addTravellerToTrip = function (req, res) {
    let query = Trip.findOne({ _id: req.params.id, isInactive: false });

    query.exec(function (err, trip) {
        if (err) {
            console.log(`error getting trip: ${err}`);
        } else {
            var travellers = trip.travellersOnTrip;
            var vehicles = trip.vehiclesOnTrip;
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
                                            trip.travellersOnTrip = travellers;
                                            trip.vehiclesOnTrip = vehicles;

                                            Trip.findByIdAndUpdate(req.params.id,
                                                {
                                                    travellersOnTrip: travellers,
                                                    vehiclesOnTrip: vehicles
                                                },
                                                (err, result) => {
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
        }
    });
}

exports.removeTravellerFromTrip = function (req, res) {
    if (req.params.id) {
        let query = Trip.findOne({ _id: req.params.id, isInactive: false });

        query.exec(function (err, trip) {
            if (err) {
                console.log(`error finding trip: ${err}`);
            } else {
                Traveller.find({ _id: { $in: trip.travellersOnTrip } },
                    (travErr, travs) => {
                        if (travErr) {
                            console.log(`error finding travellers: ${travErr}`);
                        } else {
                            let removedIds = []; //store the ids removed from the trip - need to be kept for record deletion
                            for (let i = 0; i < travs.length; i++) {
                                for (let j = 0; j < req.body.users.length; j++) {
                                    if (travs[i].user === req.body.users[j]) {
                                        let matchPos = trip.travellersOnTrip.indexOf(travs[i]._id);
                                        if (matchPos > -1) {
                                            //store in collection of ids to be removed
                                            removedIds.push(trip.travellersOnTrip[matchPos]);
                                            //remove from original collection of ids currently on trip
                                            trip.travellersOnTrip.splice(matchPos, 1);
                                        }
                                    }
                                }
                            }

                            //remove travellers from the trip
                            Trip.findByIdAndUpdate(req.params.id,
                                {
                                    travellersOnTrip: trip.travellersOnTrip
                                },
                                (upErr, result) => {
                                    if (upErr) {
                                        console.log(`error updating trip: ${upErr}`);
                                    } else {
                                        console.log(`travellers updated for trip`);
                                        //remove the traveller documents from collection
                                        //user records intact
                                        Traveller.remove({ _id: { $in: removedIds } },
                                            (delErr) => {
                                                if (delErr) {
                                                    console.log(`error deleting travellers: ${delErr}`);
                                                } else {
                                                    //success
                                                    //output updated trip data
                                                    res.send(trip);
                                                }
                                            }
                                        );
                                    }
                                }
                            );
                        }
                    }
                );
            }
        });
    }
}

exports.deleteTrip = function (req, res) {
    if (req.params.id) {
        let query = Trip.findOne({ _id: req.params.id, isInactive: false });

        query.exec(function (err, trip) {
            if (err) {
                console.log(`error finding trip: ${err}`);
            } else {
                if (!req.session.user.isSystemAdmin) {
                    Traveller.find({ _id: { $in: trip.travellersOnTrip }, isTripLeader: true },
                        (travErr, travs) => {
                            if (travErr) {
                                console.log(`error finding travellers: ${travErr}`);
                            } else {
                                for (let i = 0; i < travs.length; i++) {
                                    if (travs[i].user === req.session.user._id) {
                                        trip.isInactive = true;

                                        Trip.findByIdAndUpdate(trip._id,
                                            {
                                                isInactive: trip.isInactive
                                            },
                                            (err, result) => {
                                                if (err) {
                                                    console.log(`error updating trip: ${err}`);
                                                } else {
                                                    res.send(trip);
                                                }
                                            }
                                        );
                                    }
                                }
                            }
                        }
                    );
                } else {
                    Trip.findByIdAndRemove(trip._id,
                        (err, result) => {
                            if (err) {
                                console.log(`error removing trip: ${err}`);
                            } else {
                                Traveller.remove({ _id: { $in: trip.travellersOnTrip } },
                                    (err) => {
                                        console.log(`error removing travellers: ${err}`);
                                    }
                                );
                                res.send(`trip '${trip._id}' has been removed from roadKill`);
                            }
                        }
                    );
                }
            }
        });
    }
}