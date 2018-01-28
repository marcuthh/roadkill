var Trip = require('../model/Trip');

exports.create = function(req, res) {
    var trip = new Trip({
        //populate fields...
    });

    trip.save();

    res.redirect(301, '/');
}

exports.getUser = function(req, res) {
    res.render('newtrip', { title: 'roadKill - New Trip'});
}