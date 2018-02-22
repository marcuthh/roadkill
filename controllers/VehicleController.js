var Vehicle = require('../model/Vehicle');
var User = require('../model/User');

exports.getAllVehicles = function (req, res) {
    let query = Vehicle.findOne({ isInactive: false },
        (err, vehs) => {
            if (err) {
                console.log(`error getting vehicle: ${err}`);
            } else {
                res.send(veh);
            }
        }
    );
}

exports.getVehicle = function (req, res) {
    if (req.params.id) {
        let query = Vehicle.findOne({ _id: req.params.id, isInactive: false },
            (err, veh) => {
                if (err) {
                    console.log(`error getting vehicle: ${err}`);
                } else {
                    res.send(veh);
                }
            });
    }
}

exports.getVehicleDrivers = function (req, res) {
    if (req.params.id) {
        let query = Vehicle.findOne({ _id: req.params.id, isInactive: false },
            (err, veh) => {
                if (err) {
                    console.log(`error getting vehicle: ${err}`);
                } else {
                    let userQuery = User.find({ insuredVehicles: { $all: veh._id }, isInactive: false },
                        (useErr, users) => {
                            if (useErr) {
                                console.log(`error getting drivers: ${useErr}`);
                            } else {
                                res.send(users);
                            }
                        }
                    );
                }
            });
    }
}

exports.deleteVehicle = function (req, res) {
    if (req.params.id) {
        let query = Vehicle.findOne({ _id: req.params.id, isInactive: false },
            (err, veh) => {
                if (err) {
                    console.log(`error getting vehicle: ${err}`);
                } else {
                    let userQuery = User.find({ insuredVehicles: { $all: veh._id }, isInactive: false },
                        (useErr, users) => {
                            if (useErr) {
                                console.log(`error getting drivers: ${useErr}`);
                            } else {
                                if (req.sessions.user.isSystemAdmin) {
                                    Vehicle.findByIdAndRemove(veh._id,
                                        (err, result) => {
                                            if (err) {
                                                console.log(`error removing vehicle: ${err}`);
                                            } else {
                                                for (let i = 0; i < users.length; i++) {
                                                    let matchPos = users[i].insuredVehicles.indexOf(veh._id);
                                                    if (matchPos > -1) {
                                                        users[i].insuredVehicles.splice(matchPos, 1);

                                                        User.findByIdAndUpdate(users[i]._id,
                                                            {
                                                                insuredVehicles: users[i].insuredVehicles
                                                            },
                                                            (err, result) => {
                                                                if (err) {
                                                                    console.log(`error removing drivers from insurance: ${err}`);
                                                                } else {
                                                                    if (i === (users.length - 1)) {
                                                                        res.send(`'${veh._id}' has been removed from roadKill`);
                                                                    }
                                                                }
                                                            }
                                                        );
                                                    }
                                                }
                                            }
                                        });
                                } else {
                                    //only allow user to delete if they are the only insured driver
                                    if (users.length === 1 && users[0]._id === req.session.user._id) {
                                        veh.isInactive = true;
                                        Vehicle.findByIdAndUpdate(veh._id,
                                            {
                                                isInactive: true
                                            },
                                            (err, result) => {
                                                if (err) {
                                                    console.log(`error updating vehicle: ${err}`);
                                                } else {
                                                    res.send(veh);
                                                    //user stays on vehicle insurance incase it is re-activated
                                                }
                                            }
                                        );
                                    }
                                }
                            }
                        }
                    );
                }
            }
        );
    }
}

exports.create = function (req, res) {
    let vehs = [];
    if (req.body.vehs.length) {
        //loop through values in body and build array of Vehicle objects
        for (let i = 0; i < req.body.vehs.length; i++) {
            vehicle = req.body.vehs[i];
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
                    //add vehicle to array of successful saves
                    vehs.push(vehicle);
                    //on last iteration of loop - output saved records
                    if (i === (req.body.vehs.length - 1)) {
                        res.send(vehs);
                    }
                }
            });
        }
    }
}