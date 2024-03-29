require('dotenv').config()

const PORT = process.env.PORT
const JWT_SECRET = process.env.JWT_SECRET
const MONGODB_URI = process.env.MONGODB_URI

module.exports = { PORT, JWT_SECRET, MONGODB_URI }
