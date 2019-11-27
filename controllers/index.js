const User = require('../models/user');

function index(req, res, next) {
    console.log("Index!!!")
    //console.table(req.body);
      res.render('index', {
        // users: null,
        user: req.user,
        name: req.query.name,
        title: 'Log In'
      });
    }

module.exports = {
    index
}