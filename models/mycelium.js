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

const mycelium  =new Schema({
    variety_id: {
        type: Schema.Types.ObjectId,
        ref: 'Varieties',
        required: true
    },
    gen: {
        type: Number,
        // required: true
    },
    gen_label: {
        // not sure how to make it out of Variety abbr + gen 
    },
    parent_id: {
        type: Schema.Types.ObjectId,
        ref: "Mycelium" 
    },
    type: {
        type: String,
        enum: ['liquid culture', 'petri dish', 'slant', 'grain spawn', 'sawdust spawn','woodchip spawn', 'plug spawn', 'substrate', 'log'],
        required: true
    },
    date: {
        type: Date,
        default: new Date()
    },
    log: [logSchema],
    note: String,
    current: true,
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},
{
    timestamps:true
});

module.export = mongoose.module('Mycelium', myceliumSchema)