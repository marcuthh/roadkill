var Vehicle = require('../model/Vehicle');

exports.create = function(req, res) {
    var vehicle = new Vehicle({
        //populate fields...
    });

    vehicle.save();

    res.redirect(301, '/');
}

exports.getVehicle = function(req, res) {
    res.render('newvehicle', { title: 'roadKill - New Vehicle'});
}