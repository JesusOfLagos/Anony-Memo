
const Mongoose = require("mongoose")
const Schema = Mongoose.Schema





  const moderationSchema = new Schema({
    moderatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },

    messageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Messages',
        required: true
    },

    action: {
        type: String,
        enum: [
            'hide',
            'delete',
            'warning'
        ],
        required: true
    },

    reason: {
        type: String,
        required: true
    },

    time: {
        type: Date,
        default: Date.now()
    }

  })




module.exports = {
    ModerationAction: moderationSchema
}



