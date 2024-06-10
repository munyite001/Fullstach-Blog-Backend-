const mongoose = require('mongoose')

const Schema = mongoose.Schema

const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String
     },
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    tags: [{type: Schema.Types.ObjectId, ref: 'Tag'}],
    date_published: {
        type: Date,
        default: Date.now
    },
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
    banner_image: {
        type: String
    },
    featured: {
        type: Boolean,
        default: false
    },
    published: {
        type: Boolean,
        default: false
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

module.exports = mongoose.model('Post', PostSchema)