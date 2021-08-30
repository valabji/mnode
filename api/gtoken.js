var jwt = require('jsonwebtoken');

function gtoken(req) {
    const token = req.headers["x-access-token"]
    try {
        var decoded = jwt.verify(token, 'bikerz2021');
        return decoded
    } catch (e) {
        return false
    }
}

module.exports = gtoken
