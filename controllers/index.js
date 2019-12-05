const User = require('../models/user');
var Mycelium = require('../models/mycelium');
var Variety = require('../models/variety');

var request = require('request');
var moment = require('moment');

const DarkSkyApi = require('dark-sky-api');
var DARKSKY_URL = `https://api.darksky.net/forecast/${process.env.DARKSKY_SECRET}/30.267153,-97.7430608`;




function index(req, res, next) {
  console.log("Index!!!")

  // console.log("DARKSKY_URL: ", DARKSKY_URL + process.env.DARKSKY_SECRET + Navigator.geolocation.getCurrentPosition());


  request(DARKSKY_URL, (err, response, body) => {
    let weatherJSON = JSON.parse(body);
    let temp = Math.round(weatherJSON.currently.temperature)
    // console.log('temperature ' + temp);

    let mode = true
    if ('archive' in req.query) {
      mode = false
    }
    Mycelium.find({ current: mode }).populate('variety').exec(
      function (err, cards) {
        // console.log("found cards")
        res.render('index', {
          // users: null,
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



  //console.table(req.body);
}

function newCard(req, res, next) {

  request(DARKSKY_URL, (err, response, body) => {
    let weatherJSON = JSON.parse(body);
    let temp = Math.round(weatherJSON.currently.temperature)
    // console.log('temperature ' + temp);

    Variety.find({}, function (err, vars) {
      Mycelium.find({}, function (err, cards) {
        // console.log("found vars");
        res.render('new', {
          // users: null,
          user: req.user,
          name: req.query.name,
          title: 'New card',
          moment,
          temp,
          vars,
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
  // console.table(req.body);
  req.body.user_id = req.user._id;
  req.body.current = true;

  // console.log("ID ", req.user._id);
  if (!req.body.variety) {

    console.log("NEW VARIETY");

    let variety = new Variety({
      name: req.body.new_variety,
      latin: req.body.new_latin,
      abbr: req.body.new_abbr
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
    let temp = Math.round(weatherJSON.currently.temperature)

    Mycelium.findById(req.params.id)
      .populate('variety')
      .exec(function (err, mycelium) {
        // console.log("mycelium ", mycelium);

        res.render('show', {

          user: req.user,
          name: req.query.name,
          title: mycelium.variety.name,
          moment,
          temp,
          mycelium,
          // label: `${mycelium.variety.abbr}:${mycelium.gen}:${mycelium.suf}`
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
  // console.log("create LOG starts");
  // console.table(req.body);


  Mycelium.findById(req.params.id, function (err, mycelium) {
    // console.log("NEW STATUS LOG");

    mycelium.log.push({ text: req.body.text });
    // mycelium.log = req.body;

    // console.log("mycelium.log ", mycelium.log);

    mycelium.save(function (err) {
      res.redirect(`/cards/${req.params.id}`);
    })
  })
}

function editLog(req, res) {
  // console.log("EDIT");
  // console.log("*************")
  // console.table(req.body);
  // console.log("******")
  // console.log(req.params.id);
  // console.log("*****************")


  Mycelium.findById(req.params.id).populate('mycelium.log')
    .exec(function (err, mycelium) {
      console.log("findById error ", err);

      console.log("mycelium.log after populate ");
      console.log("mycelium.log.text ", mycelium.log[req.params.idx].text);
      mycelium.log[req.params.idx].text = req.body.text
      // mycelium.log.findById(req.body._id, function (err) {
      //   mycelium.log.text = req.body.text;
      //   mycelium.save(function (err) {
      //     res.redirect(`/cards/${req.params.id}`);
      //   })
      // })

      mycelium.save(function (err) {
        console.log("save error ", err);
        res.redirect(`/cards/${req.params.id}`);
      })
    }
    )
}


module.exports = {
  index,
  new: newCard,
  create,
  show,
  archive,
  delete: delMush,
  createLog,
  editLog
}