import User from '../model/User';

var userController = function (User) {
    var post = function (req, res) {
        var user = new User();

        user.save();
        res.status(201);
        res.send(user);
    }
    var get = function (req, res) {
        var query = {};
        if (req.query._id) {
            query._id = req.query._id;
        }
        User.find(query, function (err, users) {
            if (err)
                res.status(500).send(err);
            //cleaner way of showing there's an error within the API
            else {
                var returnUsers = [];
                users.forEach(function (element, index, array) {
                    var newUser = element.toJSON();
                    newUser.links = {};
                    newUser.links.self = 'http://' + req.headers.host + '/api/users/' + newUser._id
                    returnUsers.push(newUser);
                });
                res.json(returnUsers);
            }
        });
    }
    return {
        post: post,
        get: get
    }
}
module.exports = userController;