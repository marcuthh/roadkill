var express = require('express');
var router = express.Router();

var userCtrl = require('../controllers/UserController');

//POST New User page//
router.post('/newuser', function (req, res) {
  return userCtrl.create(req, res);
});

router.get('/:id', function (req, res) {
  if (req.params.id) {
    userCtrl.getUserProfile(req, res);
  }
});

router.get('/:id/vehicles', function (req, res) {
  if (req.params.id) {
    userCtrl.getUserVehicles(req, res);
  }
});

module.exports = router;