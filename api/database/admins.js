const mongoose = require('mongoose')

const Schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    avatar: { type: String, required: true },
    created: { type: Number, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true }
})

module.exports = mongoose.model('admin',Schema)