const mongoose = require('mongoose')

const Schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    avatar: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    created: { type: String, required: true },
    password: { type: String, required: true },
    otp: { type: Number, required: false },
    otpt: { type: Number, required: false },
    vip: { type: Boolean, required: true }
})

module.exports = mongoose.model('user', Schema)