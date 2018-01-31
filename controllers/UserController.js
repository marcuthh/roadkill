var User = require('../model/User');

exports.create = function (req, res) {
    var profile = new User({
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
        insuredVehicles: req.body.insuredVehicles
    });

    profile.save();
    //res.json(profile);
    res.redirect('/myaccount');
}

exports.getUser = function (req, res) {
    res.render('myaccount', { title: 'roadKill - New User' });
    res.send(req.user);
}

exports.loginUser = function (req, res) {
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
        }

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
    });
}