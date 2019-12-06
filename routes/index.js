var express = require('express');
var router = express.Router();
const passport = require('passport');
const cardsCtrl = require('../controllers/index')

/* GET home page. */
router.get('/cards/new', isLoggedIn, cardsCtrl.new);
router.get('/cards/:id', isLoggedIn, cardsCtrl.show);
router.put('/cards/:id', isLoggedIn, cardsCtrl.archive);
router.delete('/cards/:id', isLoggedIn, cardsCtrl.delete);
router.post('/cards/:id/logs', isLoggedIn, cardsCtrl.createLog);
router.put('/cards/:id/logs/:idx', isLoggedIn, cardsCtrl.editLog);
router.delete('/cards/:id/logs/:idx', isLoggedIn, cardsCtrl.deleteLog);
router.post('/cards', isLoggedIn, cardsCtrl.create);
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

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()) return next();
  res.redirect('/auth/google');
}

module.exports = router;
