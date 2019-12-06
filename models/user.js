var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: String,
  
  googleId: String
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);