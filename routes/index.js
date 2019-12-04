var express = require('express');
var router = express.Router();
const passport = require('passport');
const cardsCtrl = require('../controllers/index')

/* GET home page. */
router.get('/cards/new', cardsCtrl.new);
router.get('/cards/:id', cardsCtrl.show);
router.put('/cards/:id', cardsCtrl.archive);
router.delete('/cards/:id', cardsCtrl.delete);
router.post('/cards', cardsCtrl.create);
router.get('/', cardsCtrl.index);


// Google OAuth login route
router.get('/auth/google', passport.authenticate(
  'google',
  { scope: ['profile', 'email'] }
));

router.get('/oauth2callback', passport.authenticate(
  'google',
  {
    successRedirect : '/',
    failureRedirect : '/'
  }
));

// OAuth logout route
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;
