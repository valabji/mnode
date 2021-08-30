const express = require('express')
const router = express.Router()

const usersRouter = require('./users')
const offersRouter = require('./offers')
const likesRouter = require('./likes')
const commentsRouter = require('./comments')
const adminsRouter = require('./admins')

router.use('/api/users', usersRouter)
router.use('/api/offers', offersRouter)
router.use('/api/likes', likesRouter)
router.use('/api/comments', commentsRouter)
router.use('/api/admins', adminsRouter)

module.exports = router
