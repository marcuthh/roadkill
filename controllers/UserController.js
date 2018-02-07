var User = require('../model/User');
var Vehicle = require('../model/Vehicle');

exports.create = function (req, res) {
    var vehicle;
    var profile;
    var outputProfileJSon = true; //value used to determine if profile is sent on profile initial save or vehicle save callback
    //build and write the vehicle object to database
    if (req.body.reg) {
        outputProfileJSon = false; //set to false here so profile isn't sent on first save
        vehicle = new Vehicle({
            vehicleReg: req.body.reg,
            make: req.body.make,
            model: req.body.model,
            colour: req.body.colour,
            numSeats: req.body.numSeats,
        });

        vehicle.save(function (err) {
            if (!err) {
                //query database to get the object id of the vehicle
                var query = Vehicle.findOne({ vehicleReg: req.body.reg });
                query.exec(function (err, returnedVehicle) {
                    if (err) {
                        res.redirect('/error');
                    } else {
                        //set vehicle id associated to user
                        profile.insuredVehicles = [returnedVehicle._id];
                        profile.save(function (err, result) {
                            res.send(profile);
                        });
                    }
                });
            } else {
                console.log("error saving vehicle: " + err);
                return;
            }
        });
    }

    //build and write user profile to database
    //do this regardless of car data provided
    //vehicle id only handled in update on callback function
    profile = new User({
        username: req.body.username,
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
            res.redirect('/error');
        } else {
            //save successful
            if (outputProfileJSon) {
                //no vehicle data was provided, so no need to wait for callback to send document
                res.send(profile);
            }
            //else wait for callback on vehicle.save()
        }
    });
}

exports.getUserProfile = function (req, res) {
    var query = User.findOne({ username: req.params.id });

    query.exec(function (err, returnedProfile) {
        if (err) {
            res.redirect('/error');
        } else {
            if (returnedProfile.username === req.user.username) {
                res.redirect('/myaccount');
            } else {
                res.render('userprofile');
            }
        }
    });
}

exports.loginUser = function (req, res) {
    console.log(`username: '${req.body.username}'`);
    console.log(`password: '${req.body.pwd}'`);
    //allow login with either username or email
    var query = User.findOne()
        .or([
            { username: req.body.username },
            { emailAddress: req.body.username }
        ]);

    query.exec(function (err, returnedProfile) {
        let success = true;
        //handle any errors by returning to the login page
        if (err) {
            success = false;
        } else {

            if (returnedProfile) {
                //ignore request if user is already logged in elsewhere
                if (!returnedProfile.isLoggedIn) {
                    //password matches then login is successful
                    if (req.body.pwd === returnedProfile.pwd) {
                        returnedProfile.isLoggedIn = true;
                        req.user = returnedProfile;
                        res.redirect('/myaccount');
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
                //re-render login page for next attempt
                res.render('login', { title: 'roadKill - Login' });
            }
        }
    });
}