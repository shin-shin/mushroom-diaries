var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: String,
  mycelium: {
    type: Schema.Types.ObjectId,
    ref: "Mycelium"
  },
  googleId: String
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);