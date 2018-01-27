import Traveller from '../model/Traveller';

exports.create = function(req, res) {
    var traveller = new Traveller({
        //populate fields...
    });

    traveller.save();

    res.redirect(301, '/');
}

exports.getUser = function(req, res) {
    res.render('newtraveller', { title: 'roadKill - New Traveller'});
}