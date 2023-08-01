
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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



const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
