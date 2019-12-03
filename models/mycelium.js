const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    image: []
},
{
    timestamps: true
});

const myceliumSchema  = new Schema({
    variety: {
        type: Schema.Types.ObjectId,
        ref: 'Variety',
        required: true
    },
    gen: {
        type: Number,
        // required: true
    },
    suf: String,
    gen_label: {
        type: String
        // not sure how to make it out of Variety abbr + gen + suf
    },
    parent_id: {
        type: Schema.Types.ObjectId,
        ref: "Mycelium" 
    },
    type: {
        type: String,
        enum: ['liquid culture', 'agar culture', 'slant', 'grain spawn', 'sawdust spawn','woodchip spawn', 'plug spawn', 'substrate', 'log', 'outdoor patch'],
        required: true
    },
    date: {
        type: Date,
        default: new Date()
    },
    log: [logSchema],
    note: String,
    current: Boolean,
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},
{
    timestamps:true
});

module.exports = mongoose.model('Mycelium', myceliumSchema)