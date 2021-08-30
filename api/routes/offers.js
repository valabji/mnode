const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const MyObject = require('../database/offers')
const Likes = require('../database/likes')
const gtoken = require('../gtoken')

// create object
router.post('/', (req, res, next) => {
    gt = gtoken(req)
    if (gt) {
        const object = new MyObject({
            _id: new mongoose.Types.ObjectId(),
            images: req.body.images,
            video: req.body.video,
            price: req.body.price,
            created: Date.now(),
            desc: req.body.desc,
            cur: req.body.cur,
            color: req.body.color,
            manufacture: req.body.manufacture,
            year: req.body.year,
            user: gt.id
        })
        object.save().then(r => {
            console.log(r)
            res.status(200).json({
                ok: true,
                message: "Object Created.",
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
            message: "Object NOT Created",
        })
    }

})
// get all objects
router.get('/', (req, res, next) => {
    MyObject.find({})
        .populate('user')
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
})
router.get('/likes', (req, res, next) => {
    gt = gtoken(req)
    if (gt) {
        MyObject.find({})
            .populate('user')
            .exec()
            .then(r => {
                const ofs = r.reverse()
                Likes.find({ user: gt.id })
                    .exec()
                    .then(r => {
                        res.status(200).json({
                            ok: true,
                            data: ofs,
                            likes: r,
                        })
                    })
                    .catch(e => {
                        res.status(500).json({
                            message: "Error",
                            error: e
                        })
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
            message: "Error"
        })
    }

})
// get all vip objects
router.get('/vip', (req, res, next) => {
    MyObject.find({})
        .populate({
            path: 'user',
            match: {
                vip: true,
            }
        })
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
})
router.get('/vip/likes', (req, res, next) => {
    gt = gtoken(req)
    if (gt) {

        MyObject.find({})
            .populate({
                path: 'user',
                match: {
                    vip: true,
                }
            })
            .exec()
            .then(r => {
                const ofs = r.reverse()
                Likes.find({ user: gt.id })
                    .exec()
                    .then(r => {
                        res.status(200).json({
                            ok: true,
                            data: ofs,
                            likes: r,
                        })
                    })
                    .catch(e => {
                        res.status(500).json({
                            message: "Error",
                            error: e
                        })
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
            message: "Error"
        })
    }
})
// get one object
router.get('/:id', (req, res, next) => {
    const id = req.params.id
    MyObject.findById(id)
        .populate('user')
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
router.get('/user/:id', (req, res, next) => {
    const id = req.params.id
    console.log(id)
    MyObject.find({ user: id })
        .populate('user')
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
        MyObject.findById(id)
            .exec()
            .then(r => {
                if (r.user == gt.id) {
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
                } else {
                    res.status(500).json({
                        message: "Error"
                    })
                }
            })
            .catch(e => {
                res.status(500).json({
                    message: "Error",
                    error: e
                })
            })

    } else {
        res.status(500).json({
            message: "Error"
        })
    }
})

module.exports = router