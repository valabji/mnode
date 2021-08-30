const express = require('express')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
const fileUpload = require('express-fileupload')
const sharp = require('sharp');

const usersRouter = require('./api/routes/users')
const offersRouter = require('./api/routes/offers')
const likesRouter = require('./api/routes/likes')
const commentsRouter = require('./api/routes/comments')
const adminsRouter = require('./api/routes/admins')
const admin = require('./api/adminRoutes')
const fs = require('fs')

// import express from 'express'
// import mongoose from 'mongoose'
// import bodyparser from 'body-parser'
// import usersRouter from './api/routes/users'

const app = express()

function Server() {
    const DBServerIP = "143.198.184.16"
    // Check Test
    mongoose.connect("mongodb://" + DBServerIP + "/bikerz", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    console.log("I'm alive")
    mongoose.connection.once('open', () => { console.log("DB Connected") }).on('error', (error) => { console.log("DB Error : " + error) })
    app.use(bodyparser.urlencoded({ extended: false }))
    app.use(bodyparser.json())
    app.use('/api/images', express.static(__dirname + '/uimages'))
    app.use('/api/videos', express.static(__dirname + '/uvideos'))
    app.use('/', express.static(__dirname + '/website'))
    app.use(fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 },
        debug: true
    }));
    app.get("/api", (req, res) => {
        res.status(200).json({ message: "nothing here" })
        // res.status(200).sen
    })
    app.get("/imagess/:id", (req, res) => {
        res.status(200).sendFile(req.params.id)
        // res.status(200).sen
    })
    app.post('/api/upload', function (req, res) {
        console.log(req.files.image); // the uploaded file object
        // const filename = req.files.image.name + Date.now() + Math.random()
        const filename = Date.now() + Math.floor(1000 + Math.random() * 9000);
        let nsize = 0
        fs.writeFile('./images/' + filename + ".png", req.files.video.data, err => {
            if (err) {
                console.error(err)
                res.status(200).json({ "ok": false })
                return
            }

            sharp(req.files.image.data)
                .resize(500)
                .toFormat('webp')
                .webp({ lossless: false, quality: 60, alphaQuality: 80, force: true })
                .toBuffer()
                .then(newBuffer => {

                    //changing the old jpg image buffer to new webp buffer
                    req.files.image.data = newBuffer;

                    //moving the new webq image to server public folders
                    /* req.files.image.mv('./uimages/' + filename + '.webp', function (err) {
                        if (err) {
                            console.error(err)
                            res.status(200).json({ "ok": false })
                            return
                        }
                        res.status(200).json({ "ok": true, "path": "/images/" + filename + ".webp", size: Math.round((req.files.image.size / 1024) * 100) / 100 + " KB" })
                    }) */

                    fs.writeFile('./uimages/' + filename + ".webp", newBuffer, err => {
                        if (err) {
                            console.error(err)
                            res.status(200).json({ "ok": false })
                            return
                        }
                        var stats = fs.statSync('./uimages/' + filename + ".webp")
                        var fileSizeInBytes = stats["size"]
                        nsize = fileSizeInBytes / 1000.0
                        // res.status(200).json({ "ok": true, "path": "/api/images/" + filename + ".webp", size: Math.round((req.files.image.size / 1024) * 100) / 100 + " KB",compressedSize:newSize+" KB" })
                        //file written successfully


                        sharp(req.files.image.data)
                            .resize(10)
                            .toFormat('webp')
                            .webp({ lossless: false, quality: 40, alphaQuality: 60, force: true })
                            .toBuffer()
                            .then(newBuffer => {

                                //changing the old jpg image buffer to new webp buffer
                                req.files.image.data = newBuffer;

                                //moving the new webq image to server public folders
                                /* req.files.image.mv('./uimages/' + filename + '.webp', function (err) {
                                    if (err) {
                                        console.error(err)
                                        res.status(200).json({ "ok": false })
                                        return
                                    }
                                    res.status(200).json({ "ok": true, "path": "/images/" + filename + ".webp", size: Math.round((req.files.image.size / 1024) * 100) / 100 + " KB" })
                                }) */

                                fs.writeFile('./uimages/' + filename + ".webp.mini", newBuffer, err => {
                                    if (err) {
                                        console.error(err)
                                        res.status(200).json({ "ok": false })
                                        return
                                    }
                                    var stats = fs.statSync('./uimages/' + filename + ".webp.mini")
                                    var fileSizeInBytes = stats["size"]
                                    var newSize = fileSizeInBytes / 1000.0
                                    res.status(200).json({ "ok": true, "path": "/images/" + filename + ".webp", size: Math.round((req.files.image.size / 1024) * 100) / 100 + " KB", compressedSize: nsize + " KB", miniCompressedSize: newSize + " KB" })
                                    //file written successfully
                                })
                            })
                            .catch(err => { console.log(err) });


                    })
                })
                .catch(err => { console.log(err) });

            // res.status(200).json({ "ok": true, "path": "/videos/" + filename + ".mp4" })
        })
    });

    app.post('/api/uploadvideo', function (req, res) {
        const filename = Date.now() + Math.floor(1000 + Math.random() * 9000);
        fs.writeFile('./uvideos/' + filename + ".mp4", req.files.video.data, err => {
            if (err) {
                console.error(err)
                res.status(200).json({ "ok": false })
                return
            }
            res.status(200).json({ "ok": true, "path": "/videos/" + filename + ".mp4" })
        })
    });
    app.use('/api/users', usersRouter)
    app.use('/api/offers', offersRouter)
    app.use('/api/likes', likesRouter)
    app.use('/api/comments', commentsRouter)
    app.use('/api/admins', adminsRouter)
    app.use('/admin', admin)
    app.listen(80)
}

module.exports = Server