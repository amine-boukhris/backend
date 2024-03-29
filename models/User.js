const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    books: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
        },
    ],
})

// userSchema.set('toJSON', {
//     transform: (document, returnedObject) => {
//         delete returnedObject.passwordHash
//     },
// })

module.exports = mongoose.model('User', userSchema)
