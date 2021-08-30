const mongoose = require('mongoose')

const Schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    created: { type: Number, required: true },
    offer: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'offer' },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
})

module.exports = mongoose.model('like',Schema)