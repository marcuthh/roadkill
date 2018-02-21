var express = require('express');
var router = express.Router();

var userCtrl = require('../controllers/UserController');

router.post('/login', function (req, res) {
  userCtrl.loginUser(req, res);
});

router.post('/logout', function (req, res) {
  userCtrl.LogOutUser(req, res);
});

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

//add one or multiple vehicles to the user
router.put('/:id/addVehicle', function (req, res) {
  if (req.session.user) {
    //only allow edits by the user themselves or a system admin
    if ((req.params.id === req.session.user._id) || req.session.user.isSystemAdmin) {
      userCtrl.addUserVehicle(req, res);
    }
  } else {
    res.send(`you must be logged in as '${req.params.id}' or a system admin to perform this operation`);
  }
});

//remove one or multiple vehicle from the user
router.put('/:id/removeVehicle', function (req, res) {
  if (req.session.user) {
    //only allow edits by the user themselves or a system admin
    if ((req.params.id === req.session.user._id) || req.session.user.isSystemAdmin) {
      userCtrl.removeUserVehicle(req, res);
    }
  } else {
    res.send(`you must be logged in as '${req.params.id}' or a system admin to perform this operation`);
  }
});

router.put('/:id/editProfile', function (req, res) {
  if (req.session.user) {
    //only allow edits by the user themselves or a system admin
    if ((req.params.id === req.session.user._id) || req.session.user.isSystemAdmin) {
      userCtrl.updateUserProfile(req, res);
    }
  } else {
    res.send(`you must be logged in as '${req.params.id}' or a system admin to perform this operation`);
  }
});

router.delete('/:id/deleteUser', function (req, res) {
  if (req.session.user) {
    //only allow edits by the user themselves or a system admin
    if ((req.params.id === req.session.user._id) || req.session.user.isSystemAdmin) {
      userCtrl.deleteUser(req, res);
    }
  } else {
    res.send(`you must be logged in as '${req.params.id}' or a system admin to perform this operation`);
  }
});

module.exports = router;