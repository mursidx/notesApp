const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    title: String,
    note: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'  // Reference the user model
    }
})

module.exports = mongoose.model('post', postSchema)
    