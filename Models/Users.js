

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
        default: [
            {
                name: "Message 2",
                input: "No message at the moment!"
            }
        ]
    },

    password: {
        type: String,
        required: true
    },

    profilePicture: {
        type: String,
        requireed: false,
        default: ""
    },

    isAdmin: {
        type: Boolean,
        default: false
    }
})


export default UserSchema