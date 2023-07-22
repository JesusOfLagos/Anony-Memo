

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

    messages: {
        type: [],
        default: [
            {
                name: "Message 2",
                input: "No message at the moment!"
            }
        ]
    },

    isAdmin: {
        type: Boolean,
        default: false
    }
})