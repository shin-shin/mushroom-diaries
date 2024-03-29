const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const varietySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    latin: {
        type: String,
        required: true
    },
    abbr: {
        type: String,
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

},
{
    timestamps: true
})

module.exports = mongoose.model('Variety', varietySchema);