const User = require('../models/user');
var Mycelium = require('../models/mycelium');
var Variety = require('../models/variety');

var request = require('request');

var DarkSkyApi = require('dark-sky-api');

//var DARKSKY_URL = `https://api.darksky.net/forecast/`;
var DARKSKY_URL = `https://api.darksky.net/forecast/${process.env.DARKSKY_SECRET}/37.8267,-122.4233`;




function index(req, res, next) {
  console.log("Index!!!")
  console.log(DARKSKY_URL)
  // console.log("DARKSKY_URL: ", DARKSKY_URL + process.env.DARKSKY_SECRET + Navigator.geolocation.getCurrentPosition());


  request(DARKSKY_URL, (err, response, body) => {
    let weatherJSON = JSON.parse(body);
    let temp = weatherJSON.currently.temperature
    console.log('temperature ' + temp);

    Mycelium.find({}).populate('variety').exec(
      function (err, cards) {
        console.log("found cards")
        res.render('index', {
          // users: null,
          user: req.user,
          name: req.query.name,
          title: 'Mushroom Diaries',
          cards,
          temp,
        });
      }
    )
  });



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
  console.table(req.body);
  req.body.user_id = req.user._id;
  console.log("ID ", req.user._id);
  if (!req.body.variety) {
    
  console.log("NEW VARIETY");

  let variety = new Variety({
    name: req.body.new_variety,
    latin: req.body.new_latin,
    abbr: req.body.new_abbr
  } );
  variety.save(function (err) {
    if (err) {
      console.log("error when saving a variety");
      console.log(err);
    }
    req.body.variety = variety;
    let card = new Mycelium(req.body);

    card.save(function (err) {
    if (err) {
      console.log("error when saving a card");
      console.log(err);
    }
    res.redirect('/');
  })
  })

    console.log("NEW VARIETY - CREATED!!!");
  } else {


  let card = new Mycelium(req.body);

  card.save(function (err) {
    if (err) {
      console.log("error when saving a card");
      console.log(err);
    }
    res.redirect('/');
  })
}
}


function show(req, res) {
  Mycelium.findById(req.params.id)
    .populate('variety')
    .exec(function (err, mycelium) {
      console.log(mycelium);

      res.render('show', {

        user: req.user,
        name: req.query.name,
        title: mycelium.variety.name,
        mycelium,
        // label: `${mycelium.variety.abbr}:${mycelium.gen}:${mycelium.suf}`
      });
    })
}

module.exports = {
  index,
  new: newCard,
  create,
  show
}