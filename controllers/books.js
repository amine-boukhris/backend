const router = require('express').Router()
const Book = require('../models/Book')
const User = require('../models/User')
const verifyToken = require('../middleware/auth')

router.get('/', verifyToken, async (req, res) => {
    const books = await Book.find({ createdBy: req.userId })
    res.json(books)
})

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
        if (book.createdBy != req.userId) {
            return res.status(403).json({ error: 'Not authorized' })
        }
        res.status(200).json(book)
    } catch (e) {
        res.status(500).json({ error: 'Getting book failed' })
    }
})

router.post('/', verifyToken, async (req, res) => {
    const { title, author, genre, publicationYear } = req.body
    if (!title || !author) {
        return res.status(400).json({ error: 'Missing book data' })
    }
    try {
        const user = await User.findById(req.userId)

        const book = new Book({
            title,
            author,
            genre,
            publicationYear,
            createdBy: req.userId,
        })
        const savedBook = await book.save()
        user.books = user.books.concat(savedBook._id)
        await user.save()
        res.status(201).json({message: "Book added successfully", savedBook})
    } catch (e) {
        res.status(500).json({ error: 'Adding book failed' })
    }
})

router.put('/:id', verifyToken, async (req, res) => {
    const { title, author, genre, publicationYear } = req.body
    if (!title || !author) {
        return res.status(400).json({ error: 'Missing book data' })
    }
    try {
        const book = await Book.findById(req.params.id)
        if (!book) {
            return res.status(404).json({ error: 'Book not found' })
        }
        if (book.createdBy != req.userId) {
            return res.status(403).json({ error: 'Not authorized' })
        }

        book.title = title
        book.author = author
        book.genre = genre
        book.publicationYear = publicationYear

        const updatedBook = await book.save()
        res.status(200).json({message: "Book updated successfully", updatedBook})
    } catch (e) {
        res.status(500).json({ error: 'Updating book failed' })
    }
})

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
        console.log(req.params.id, book)

        if (!book) {
            return res.status(404).json({ error: 'Book not found' })
        }

        if (book.createdBy != req.userId) {
            return res.status(403).json({ error: 'Not authorized' })
        }

        await book.deleteOne()
        res.status(200).json({message: "Book deleted successfully", book})
    } catch (e) {
        res.status(500).json({ error: 'Deleting book failed' })
    }
})

module.exports = router
