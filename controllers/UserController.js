var User = require('../model/User');

exports.create = function (req, res) {
    var profile = new User({
        username: req.body.username,
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

    res.redirect(301, '/');
}

exports.getUser = function (req, res) {
    res.render('newuser', { title: 'roadKill - New User' });
}