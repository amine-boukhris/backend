const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../config')
const verifyToken = require('../middleware/auth')

router.get('/current', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }
        res.status(200).json(user)
    } catch (e) {
        res.status(500).status({ error: 'Error getting user' })
    }
})

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(400).json({ error: 'Missing registration data' })
        }

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        const newUser = new User({
            username,
            passwordHash,
        })

        await newUser.save()
        res.status(201).json({ message: 'User registered successfully' })
    } catch (e) {
        res.status(500).json({ error: 'Registration failed' })
    }
})

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body

        const user = await User.findOne({ username })

        if (!user) {
            return res.status(401).json({ error: 'Authentication failed' })
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash)

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed' })
        }

        const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, {
            expiresIn: '1h',
        })

        res.status(200).json({ token })
    } catch (e) {
        console.error(e.name, e.message)
        res.status(500).json({ error: 'Login failed' })
    }
})

module.exports = router
