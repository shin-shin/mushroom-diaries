const User = require('../models/user');
var Mycelium = require('../models/mycelium');
var Variety = require('../models/variety');

var request = require('request');
var moment = require('moment');

var DARKSKY_URL = `https://api.darksky.net/forecast/${process.env.DARKSKY_SECRET}/30.267153,-97.7430608`;




function index(req, res, next) {
  console.log("Index!!!")
  request(DARKSKY_URL, (err, response, body) => {
    let weatherJSON = JSON.parse(body);
    let temp = Math.round(weatherJSON.currently.temperature)

    let mode = true
    if ('archive' in req.query) {
      mode = false
    }
    let user_id = null
    if (req.user) {
      user_id = req.user._id
    }
    console.log("user_id: ", req.user);
    Mycelium.find({ current: mode, user_id: user_id }).populate('variety').exec(
      function (err, cards) {
        console.log("CARDS ", cards.length);
        console.log(cards);
        res.render('index', {
          user: req.user,
          name: req.query.name,
          title: 'Mushroom Diaries',
          cards,
          temp,
          moment

        });
      }
    )
  });
}

function newCard(req, res, next) {

  request(DARKSKY_URL, (err, response, body) => {
    let weatherJSON = JSON.parse(body);
    let temp = Math.round(weatherJSON.currently.temperature)

    Variety.find({user_id: req.user._id}, function (err, vars) {
      console.log(`FOUND ${vars.length} OF VARS for USER ${req.user._id}`);
      Mycelium.find({}, function (err, cards) {
        res.render('new', {
          // users: null,
          user: req.user,
          name: req.query.name,
          title: 'New card',
          moment,
          temp,
          vars: vars.sort((a,b)=>{
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            let c = 0;
            nameA > nameB ? c = 1 : c = -1;
            return c
          }),
          cards,
          testText: "Foo",
          types: ['liquid culture', 'agar culture', 'slant', 'grain spawn', 'sawdust spawn', 'woodchip spawn', 'plug spawn', 'substrate', 'log', 'outdoor patch']
        })
      })
    })

  })

}

function create(req, res, next) {
  console.log("create starts");
  req.body.user_id = req.user._id;
  req.body.current = true;

  if (!req.body.variety) {

    console.log("NEW VARIETY");
    let variety = new Variety({
      name: req.body.new_variety,
      latin: req.body.new_latin,
      abbr: req.body.new_abbr,
      user_id: req.user._id
    });
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

  request(DARKSKY_URL, (err, response, body) => {
    let weatherJSON = JSON.parse(body);
    let temp = Math.round(weatherJSON.currently.temperature);

    Mycelium.findById(req.params.id)
      .populate('variety')
      .exec(function (err, mycelium) {
        res.render('show', {
          user: req.user,
          name: req.query.name,
          title: mycelium.variety.name,
          moment,
          temp,
          mycelium,
        });
      })
  })
}


function archive(req, res) {
  Mycelium.findById(req.params.id, function (err, mycelium) {
    console.log("ARCHIVE");
    mycelium.current = !mycelium.current;
    mycelium.save(function (err) {
      res.redirect('/');
    })
  })
}


function delMush(req, res) {
  console.log("DELETE MUSHROOM");
  Mycelium.deleteOne({ _id: req.params.id }, function (err) {
    res.redirect('/');
  })
}


function createLog(req, res, next) {

  Mycelium.findById(req.params.id, function (err, mycelium) {

    mycelium.log.push({ text: req.body.text });

    mycelium.save(function (err) {
      res.redirect(`/cards/${req.params.id}`);
    })
  })
}



function editLog(req, res) {

  Mycelium.findById(req.params.id).populate('mycelium.log')
    .exec(function (err, mycelium) {
      console.log("findById error ", err);
      console.log("mycelium.log after populate ");
      console.log("mycelium.log.text ", mycelium.log[req.params.idx].text);
      mycelium.log[req.params.idx].text = req.body.text

      mycelium.save(function (err) {
        console.log("save error ", err);
        res.redirect(`/cards/${req.params.id}`);
      })
    })
}


function deleteLog(req, res) {

  Mycelium.findById(req.params.id).populate('mycelium.log')
    .exec(function (err, mycelium) {
      console.log("findById error ", err);

      console.log("mycelium.log after populate ");
      console.log("mycelium.log.text ", mycelium.log[req.params.idx]._id);

      mycelium.log.splice(req.params.idx, 1)

      mycelium.save(function (err) {
        console.log("save error ", err);
        res.redirect(`/cards/${req.params.id}`);
      })

})}


module.exports = {
  index,
  new: newCard,
  create,
  show,
  archive,
  delete: delMush,
  createLog,
  editLog,
  deleteLog
}