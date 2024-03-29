const jwt = require('jsonwebtoken')
const config = require('../config')

function verifyToken(req, res, next) {
    const authHeader = req.header('Authorization')
    if (!authHeader) {
        return res.status(401).json({ error: 'Access denied' })
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET)
        req.userId = decoded.userId
        next()
    } catch (e) {
        res.status(401).json({ error: 'Invalid token' })
    }
}

module.exports = verifyToken
