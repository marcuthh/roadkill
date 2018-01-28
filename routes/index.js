var express = require('express');
var router = express.Router();

//controllers
var userCtrl = require('../controllers/UserController');
var vehicleCtrl = require('../controllers/VehicleController');
var travellerCtrl = require('../controllers/TravellerController');
var destinationCtrl = require('../controllers/DestinationController');
var tripCtrl = require('../controllers/TripController');

//GET home page//
router.get('/', function(req, res) {
    res.render('index', { title: 'roadKill' });
});

//GET New User page//
router.get('/newuser', function(req, res) {
    return userCtrl.getUser(req, res);
});

//POST New User page//
router.post('/newuser', function(req, res) {
    return userCtrl.create(req, res);
});

//GET New Vehicle page//
router.get('/newvehicle', function(req, res) {
    return vehicleCtrl.getVehicle(req, res);
});

//POST New Vehicle page//
router.post('/newvehicle', function(req, res) {
    return vehicleCtrl.create(req, res);
});

//GET New Traveller page//
router.get('/newtraveller', function(req, res) {
    return travellerCtrl.getTraveller(req, res);
});

//POST New Traveller page//
router.post('/newtraveller', function(req, res) {
    return travellerCtrl.create(req, res);
});

//GET New Destination page//
router.get('/newdestination', function(req, res) {
    return destinationCtrl.getDestination(req, res);
});

//POST New Destination page//
router.post('/newdestination', function(req, res) {
    return destinationCtrl.create(req, res);
});

//GET New Trip page//
router.get('/newtrip', function(req, res) {
    return tripCtrl.getTrip(req, res);
});

//POST New Trip page//
router.post('/newtrip', function(req, res) {
    return tripCtrl.create(req, res);
});

module.exports = router;