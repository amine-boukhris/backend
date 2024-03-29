const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require("mongoose")
const usersRouter = require('./controllers/users')
const booksRouter = require('./controllers/books')

const config = require('./config')
mongoose
    .connect(config.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((e) => {
        console.error('Error connecting to MongoDB:', e.message)
    })

app.use(cors())
app.use(express.json())

app.use('/api/users', usersRouter)
app.use('/api/books', booksRouter)

app.get('/', (req, res) => {
    res.send('Welcome to the root of the project')
})

const PORT = config.PORT || 5000 
app.listen(PORT, () => {
    console.log('app listening on port 5000.')
})
