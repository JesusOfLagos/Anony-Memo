import UserSchema from "./Users"


const mongoose = require("mongoose")

const Schema = mongoose.Schema

const MessageSchema = new Schema ({
    title: {
        type: String,
        required: true
    },

    note: {
        type: String,
        required: true,
        unique: true
    },

    sentBy: {
        type: UserSchema,
        default: false
    },

    to: {
        type: UserSchema,
        default: "12222222"
    },

    isHidden: {
        type: Boolean,
        default: false
    },

    isDeleted: {
        type: Boolean,
        default: false
    }
})

