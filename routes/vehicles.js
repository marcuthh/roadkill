var express = require('express');
var router = express.Router();

var vehCtrl = require('../controllers/VehicleController');

router.get('/', function (req, res) {
    return vehCtrl.getAllVehicles(req, res);
});

router.get('/:id', function (req, res) {
    if (req.params.id) {
        return vehCtrl.getVehicle(req, res);
    }
});

router.post('/newvehicle', function (req, res) {
    return vehCtrl.create(req, res);
});

router.get('/:id/drivers', function (req, res) {
    if (req.params.id) {
        return vehCtrl.getVehicleDrivers(req, res);
    }
});

//no put methods required for vehicles - nothing is going to change once built

router.delete('/:id', function (req, res) {
    if (req.session.user) {
        return vehCtrl.deleteVehicle(req, res);
    }
});

module.exports = router;