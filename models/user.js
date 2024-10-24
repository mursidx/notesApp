const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'post' }] // Array to store the user's posts
})

module.exports = mongoose.model('user', userSchema)
