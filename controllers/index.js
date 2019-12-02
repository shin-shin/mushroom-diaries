const User = require('../models/user');
var Mycelium = require('../models/mycelium');
var Variety = require('../models/variety');

function index(req, res, next) {
  console.log("Index!!!")

  Mycelium.find({}).populate('variety').exec(
    function (err, cards) {
      console.log("found cards")
      res.render('index', {
        // users: null,
        user: req.user,
        name: req.query.name,
        title: 'Log In',
        cards,
      });
    }
  )
  //console.table(req.body);
}

function newCard(req, res, next) {
  Variety.find({}, function (err, vars) {
    console.log("found vars");
    res.render('new', {
      // users: null,
      user: req.user,
      name: req.query.name,
      title: 'New card',
      vars,
      types: ['liquid culture', 'agar culture', 'slant', 'grain spawn', 'sawdust spawn', 'woodchip spawn', 'plug spawn', 'substrate', 'log', 'outdoor patch']
    })
  })
}

function create(req, res, next) {
  console.log("create starts");
  console.log(req.user);
  req.body.user_id = req.user._id;
  let card = new Mycelium(req.body);

  card.save(function (err) {
    if (err) {
      console.log("error when saving a card");
      console.log(err);
    }
    res.redirect('/');
  })
}

module.exports = {
  index,
  new: newCard,
  create
}