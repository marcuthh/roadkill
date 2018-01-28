var Destination = require('../model/Destination');

exports.create = function(req, res) {
    var destination = new Destination({
        //populate fields...
    });

    destination.save();

    res.redirect(301, '/');
}

exports.getUser = function(req, res) {
    res.render('newdestination', { title: 'roadKill - New Destination'});
}