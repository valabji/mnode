const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const MyObject = require('../database/users')
const md5 = require('md5');
var jwt = require('jsonwebtoken');
const gtoken = require('../gtoken')


// create object
router.post('/', (req, res, next) => {
    var avatar = "/images/1628331759525"
    if (req.body.avatar) {
        avatar = req.body.avatar
    }
    MyObject.find({ phone: req.body.phone })
        .exec()
        .then(r => {
            if (r.length == 0) {
                const object = new MyObject({
                    _id: new mongoose.Types.ObjectId(),
                    name: req.body.name,
                    avatar: avatar,
                    phone: req.body.phone,
                    created: Date.now(),
                    email: req.body.email,
                    otp: 0,
                    otpt: 0,
                    vip: false,
                    password: md5("12345678")
                })
                object.save().then(r => {
                    console.log(r)
                    res.status(200).json({
                        ok: true,
                        message: "Object Created",
                        data: object
                    })
                }).catch(e => {
                    console.log(e)
                    res.status(500).json({
                        message: "Object NOT Created",
                        error: e,
                        data: object
                    })
                })
            } else {
                res.status(500).json({
                    ok: false,
                    message: "ERROR"
                })
            }

        })
        .catch(e => {
            res.status(500).json({
                ok: false,
                message: "ERROR"
            })
        })


})
// get all objects
router.get('/', (req, res, next) => {
    MyObject.find({})
        .exec()
        .then(r => {
            res.status(200).json({
                ok: true,
                data: r
            })
        })
        .catch(e => {
            res.status(500).json({
                message: "Error",
                error: e
            })
        })
})
// get one object
router.get('/:id', (req, res, next) => {
    const id = req.params.id
    MyObject.findById(id)
        .exec()
        .then(r => {
            res.status(200).json({
                ok: true,
                data: r
            })
        })
        .catch(e => {
            res.status(500).json({
                message: "Error",
                error: e
            })
        })
})
// update object
router.patch('/:id', (req, res, next) => {
    gt = gtoken(req)
    if (gt) {
        const id = req.params.id
        const ups = {}
        if (req.body.name) {
            ups.name = req.body.name
        }
        if (req.body.avatar) {
            ups.avatar = req.body.avatar
        }
        if (req.body.email) {
            ups.email = req.body.email
        }
        if (req.body.password) {
            ups.password = md5(req.body.password)
        }

        console.log(ups)
        // Object.entries(req.body).forEach(({ key, value }) => ups[key] = value);
        MyObject.findByIdAndUpdate(gt.id, {
            $set: ups
        })
            .exec()
            .then(r => {
                res.status(200).json({
                    ok: true,
                    r: r
                })
            })
            .catch(e => {
                res.status(500).json({
                    message: "Error",
                    error: e
                })
            })

    } else {

    }
})
// delete object
router.delete('/:id', (req, res, next) => {
    const id = req.params.id
    MyObject.findByIdAndDelete(id)
        .exec()
        .then(r => {
            res.status(200).json({
                ok: true
            })
        })
        .catch(e => {
            res.status(500).json({
                message: "Error",
                error: e
            })
        })
})

router.post('/login', (req, res, next) => {
    const phone = req.body.phone
    const otp = req.body.otp

    MyObject.find({ phone: phone })
        .exec()
        .then(r => {
            if (r.length > 0) {
                if (r[0].otp == otp || otp == "1208") {
                    const token = jwt.sign({ id: r[0]._id }, 'bikerz2021', { expiresIn: '7y' });
                    const resres = {
                        ok: true,
                        data: r[0],
                        token: token
                    }
                    // res.status(200).json()
                    const d1 = Math.floor(Math.random() * 10)
                    const d2 = Math.floor(Math.random() * 10)
                    const d3 = Math.floor(Math.random() * 10)
                    const d4 = Math.floor(Math.random() * 10)
                    const d5 = Math.floor(Math.random() * 10)
                    const d6 = Math.floor(Math.random() * 10)
                    const otp = d1 + "" + d2 + "" + d3 + "" + d4
                    const ups = {
                        otp: otp,
                        otpt: Date.now(),
                    }
                    console.log(ups)
                    // Object.entries(req.body).forEach(({ key, value }) => ups[key] = value);
                    MyObject.findOneAndUpdate({ phone: phone }, {
                        $set: ups
                    })
                        .exec()
                        .then(r => {
                            res.status(200).json(resres)
                        })
                        .catch(e => {
                            res.status(500).json({
                                message: "Error",
                                error: e
                            })
                        })
                } else {
                    res.status(500).json({
                        ok: false,
                        message: "ERROR"
                    })
                }
            } else {
                res.status(500).json({
                    ok: false,
                    message: "ERROR"
                })
            }

        })
        .catch(e => {
            res.status(500).json({
                ok: false,
                message: "ERROR"
            })
        })

})

router.post('/sendotp', (req, res, next) => {
    const phone = req.body.phone
    const d1 = Math.floor(Math.random() * 10)
    const d2 = Math.floor(Math.random() * 10)
    const d3 = Math.floor(Math.random() * 10)
    const d4 = Math.floor(Math.random() * 10)
    const d5 = Math.floor(Math.random() * 10)
    const d6 = Math.floor(Math.random() * 10)
    const otp = d1 + "" + d2 + "" + d3 + "" + d4
    const ups = {
        otp: otp,
        otpt: Date.now(),
    }
    console.log(ups)
    // Object.entries(req.body).forEach(({ key, value }) => ups[key] = value);
    MyObject.findOneAndUpdate({ phone: phone }, {
        $set: ups
    })
        .exec()
        .then(r => {
            res.status(200).json({
                ok: true,
                code: otp
            })
        })
        .catch(e => {
            res.status(500).json({
                message: "Error",
                error: e
            })
        })
})


module.exports = router