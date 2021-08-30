const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const MyObject = require('../database/likes')
const gtoken = require('../gtoken')

// create object
router.post('/', (req, res, next) => {
    gt = gtoken(req)
    if (gt) {
        const object = new MyObject({
            _id: new mongoose.Types.ObjectId(),
            created: Date.now(),
            offer: req.body.offer,
            user: gt.id
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
            message: "Object NOT Created"
        })
    }
})
// get all objects
router.get('/', (req, res, next) => {
    gt = gtoken(req)
    if (gt) {
        MyObject.find({ user: gt.id })
            .populate('user')
            .populate('offer')
            .exec()
            .then(r => {
                res.status(200).json({
                    ok: true,
                    data: r.reverse()
                })
            })
            .catch(e => {
                res.status(500).json({
                    message: "Error",
                    error: e
                })
            })
    } else {
        res.status(500).json({
            ok: false
        })
    }
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
    gt = gtoken(req)
    if (gt) {
        const id = req.params.id
        MyObject.findOneAndDelete({ user: gt.id, offer: id })
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
    } else {
        res.status(500).json({
            ok: false
        })
    }
})

module.exports = router