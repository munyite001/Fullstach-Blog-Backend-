const mongoose = require('mongoose')
const { DateTime } = require("luxon")
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    is_admin: {
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

//  Virtual for formatted Date Created
UserSchema.virtual("date_joined_formatted").get(function () {
    return DateTime.fromJSDate(this.created_at).toLocaleString(DateTime.DATE_MED)
})

//  Virtual for date Updated
UserSchema.virtual('date_updated_formatted').get(function () {
    return DateTime.fromJSDate(this.updated_at).toLocaleString(DateTime.DATE_MED)
})

module.exports = mongoose.model('User', UserSchema)
