var express = require('express');
var router = express.Router();

var tripCtrl = require('../controllers/TripController');

//find trips with no filtering
//should return whole collection
router.get('/', function (req, res) {
        return tripCtrl.getAllTrips(req, res);
});

//find individual trip - :id param is ObjectId for trip document
router.get('/:id', function (req, res) {
    if (req.params.id) {
        return tripCtrl.getTrip(req, res);
    }
});

//find all trips where the user with the :id username travelled
router.get('/usertrips/:id', function (req, res) {
    if (req.params.id) {
        return tripCtrl.getUserTrips(req, res);
    }
});

//find all trips that featured the vehicle with the :id registration
router.get('/vehicletrips/:id', function (req, res) {
    if (req.params.id) {
        return tripCtrl.getVehicleTrips(req, res);
    }
});

router.post('/search', function (req, res) {
    return tripCtrl.getTripsFromSearchCriteria(req, res);
});

router.post('/newtrip', function (req, res) {
    return tripCtrl.create(req, res);
});

module.exports = router;