var User = require('../model/User');
var Vehicle = require('../model/Vehicle');

exports.create = function (req, res) {
    var profile;

    //build and write user profile to database
    //do this regardless of car data provided
    //vehicle id list only handled in update on callback function
    profile = new User({
        _id: req.body.username,
        pwd: req.body.pwd,
        name: {
            firstName: req.body.firstName,
            surname: req.body.surname,
        },
        emailAddress: req.body.emailAddress,
        address: {
            houseNo: req.body.houseNo,
            street: req.body.street,
            city: req.body.city,
            county: req.body.county,
            country: req.body.country,
            postCode: req.body.postCode
        },
        canDrive: req.body.canDrive,
        hasThirdParty: req.body.hasThirdParty,
    });

    profile.save(function (err) {
        if (err) {
            console.log(`error saving profile: ${err}`);
            res.send(`error saving profile: ${err}`);
        } else {
            //save successful
            //handle vehicle data provided
            if (profile.canDrive && req.body.vehs.length) { //don't allow vehicles to be added if user can't drive
                for (let i = 0; i < req.body.vehs.length; i++) {
                    let vehicle = req.body.vehs[i];
                    //build and write the vehicle object to database
                    if (vehicle.reg) {
                        //query database to get the object id of the vehicle
                        var query = Vehicle.findOne({ _id : vehicle.reg });
                        query.exec(function (err, result) {
                            if (err) {
                                console.log(`error finding vehicle: ${err}`);
                                res.send(`error finding vehicle: ${err}`);
                            } else {
                                if (result) { //a vehicle exists with a matching reg - use existing record
                                    //append existing vehicle's unique id to the array
                                    profile.insuredVehicles.push(result._id);
                                    User.updateOne({ _id: profile._id },
                                        {
                                            //update array field in user's document
                                            insuredVehicles: profile.insuredVehicles
                                        },
                                        (err, raw) => {
                                            if (err) {
                                                console.log(`error saving user's vehicles: ${err}`);
                                            } else {
                                                if (i === (req.body.vehs.length - 1)) {
                                                    //output completed profile with all vehicles added
                                                    //^^has to be done in last callback iteration - otherwise vehicles not included
                                                    res.send(profile);
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
                                                profile.insuredVehicles.push(vehicle._id);
                                                //update user's record to include 
                                                User.updateOne({ _id: profile._id },
                                                    {
                                                        //update array field in user's document
                                                        insuredVehicles: profile.insuredVehicles
                                                    },
                                                    (err, raw) => {
                                                        if (err) {
                                                            console.log(`error saving user's vehicles: ${err}`);
                                                        } else {
                                                            if (i === (req.body.vehs.length - 1)) {
                                                                //output completed profile with all vehicles added
                                                                //^^has to be done in last callback iteration - otherwise vehicles not included
                                                                res.send(profile);
                                                            }
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
            } else {
                //no vehicles added
                //output profile data without vehicles
                res.send(profile);
            }
        }
    });
}

exports.getUserProfile = function (req, res) {
    console.log(`getting profile...`);
    var query = User.findOne({ _id : req.params.id });

    //get the profile associated with the username param
    query.exec(function (err, profile) {
        if (err) {
            console.log(`error getting profile: ${err}`);
        } else {
            res.send(profile);
        }
    });
}

//get all the vehicles registered to the user
exports.getUserVehicles = function (req, res) {
    var query = User.findOne({ _id : req.params.id });

    //get the profile associated with the username param
    query.exec(function (err, profile) {
        if (err) {
            console.log(`error fetching profile: ${err}`);
        } else {
            var vehiclesQuery = Vehicle.find({ _id: { $in: profile.insuredVehicles } });

            //get the vehicles that this user is insured to drive
            vehiclesQuery.exec(function (err, vehicles) {
                if (err) {
                    console.log(`error fetching vehicles: ${err}`);
                } else {
                    res.send(vehicles);
                }
            });
        }
    });
}

exports.loginUser = function (req, res) {
    //allow login with either username or email
    var query = User.findOne()
        .or([
            { _id : req.body.username },
            { emailAddress: req.body.username }
        ]);

    query.exec(function (err, profile) {
        let success = true;
        //handle any errors by returning to the login page
        if (err) {
            success = false;
        } else {
            if (profile) {
                //ignore request if user is already logged in elsewhere
                if (!profile.isLoggedIn) {
                    //password matches then login is successful
                    if (req.body.pwd === profile.pwd) {
                        User.updateOne({ _id: profile._id },
                            {
                                isLoggedIn: true //set flag so other log-in attempts will not work
                            },
                            (err, raw) => {
                                if (err) {
                                    console.log(`error logging in: ${err}`);
                                    res.send(`error logging in: ${err}`);
                                } else {
                                    profile.isLoggedIn = true;
                                    //store profile id in session
                                    //on subsequent searches, will return with logged-in flag as true
                                    req.session.userId = profile._id;
                                    //output logged-in user data
                                    res.send(profile);
                                }
                            }
                        )
                    } else {
                        success = false;
                    }
                } else {
                    success = false;
                }
            } else {
                success = false;
            }

            //unsuccessful for any reason
            if (!success) {
                console.log(`unable to log in user '${req.body.username}'`);
                res.send(`unable to log in user '${req.body.username}'`);
            }
        }
    });
}

exports.LogOutUser = function (req, res) {
    if (req.session.userId) {
        var query = User.findOne({ _id: req.session.userId });

        query.exec(function (err, profile) {
            if (err) {
                console.log(`no user logged in`);
                res.send(`no user logged in`);
            } else {
                User.update({ _id: profile._id },
                    {
                        isLoggedIn: false
                    },
                    (err, raw) => {
                        profile.isLoggedIn = false;
                        req.session.destroy(function (err) {
                            if (err) {
                                console.log(`unable to log out '${profile._id}'`);
                                res.send(`unable to log out '${profile._id}'`);
                            } else {
                                res.send(`'${profile._id}' has been logged out`);
                            }
                        });
                    }
                );
            }
        });
    } else {
        console.log(`no user logged in`);
        res.send(`no user logged in`);
    }
}