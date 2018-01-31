var Trip = require('../model/Trip');

exports.list = function (req, res) {
    var query = Trip.find({ travellersOnTrip: req.user._id });

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
    var trip = new Trip({
        //populate fields...
    });

    trip.save();

    res.redirect(301, '/');
}

exports.getTrip = function (req, res) {
    res.render('newtrip', { title: 'roadKill - New Trip' });
}