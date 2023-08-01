

const mongoose = require("mongoose")

const Schema = mongoose.Schema

const UserSchema = new Schema ({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    userName: {
        type: String,
        required: false
    },

    messages: {
        type: [],
        default: []
    },

    notifications: {
        type: [],
        default: []
    },

    password: {
        type: String,
        required: true
    },

    profilePicture: {
        type: String,
        required: true,
    },

    isAdmin: {
        type: Boolean,
        default: false
    },

    warnings: {
        type: Number,
        default: 0
    }
})


module.exports = {
    Users: UserSchema
}

