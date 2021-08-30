const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const MyObject = require('../database/admins')

// create object
router.post('/', (req, res, next) => {
    const object = new MyObject({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        avatar: req.body.avatar,
        created: Date.now(),
        phone: req.body.phone,
        password: req.body.password
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
    const id = req.params.id
    const ups = {}
    Object.entries(req.body).forEach(({ key, value }) => ups[key] = value);
    MyObject.findByIdAndUpdate(id, {
        $set: ups
    })
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

module.exports = router