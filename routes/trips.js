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

router.put('/:id/addvehicle', function (req, res) {
    // if (req.session.user) {
    //     //only allow edits by the user themselves or a system admin
    //     if ((req.params.id === req.session.user._id) || req.session.user.isSystemAdmin) {
    return tripCtrl.addVehicleToTrip(req, res);
    //     }
    // } else {
    //     res.send(`you must be logged in as a trip admin or a system admin to perform this operation`);
    // }
});

router.put('/:id/removevehicle', function (req, res) {
    // if (req.session.user) {
    //     //only allow edits by the user themselves or a system admin
    //     if ((req.params.id === req.session.user._id) || req.session.user.isSystemAdmin) {
    return tripCtrl.removeVehicleFromTrip(req, res);
    //     }
    // } else {
    //     res.send(`you must be logged in as a trip admin or a system admin to perform this operation`);
    // }
});

router.put('/:id/addtraveller', function (req, res) {
    return tripCtrl.addVehicleToTrip(req, res);
});

router.put('/:id/removetraveller', function (req, res) {
    return tripCtrl.removeTravellerFromTrip(req, res);
});

router.put('/:id/addstop', function (req, res) {
    return tripCtrl.addStopToTrip(req, res);
});

router.put('/:id/removestop', function (req, res) {
    return tripCtrl.removeStopFromTrip(req, res);
});

router.delete('/:id', function (req, res) {
    if (req.session.user) {
        tripCtrl.deleteTrip(req, res);
    } else {
        res.send(`you must be logged in as a trip admin or a system admin to perform this operation`);
    }
});

module.exports = router;