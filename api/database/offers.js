const mongoose = require('mongoose')

const Schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    images: { type: [String], required: true },
    video: { type: String },
    cur: { type: String, required: true },
    desc: { type: String, required: true },
    created: { type: Number, required: true },
    price: { type: Number, required: true },
    year: { type: Number, required: true },
    color: { type: String, required: true },
    manufacture: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
})

module.exports = mongoose.model('offer', Schema)