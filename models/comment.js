const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
    post: {
        type: Schema.Types.ObjectId, ref: 'Post',
    },
    user: {
        type: Schema.Types.ObjectId, ref: 'User',
    },
    content: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
})