
const Mongoose = require("mongoose")
const Schema = Mongoose.Schema





  const moderationSchema = new Schema({
    moderatorId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },

    messageId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'messages',
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
        default: Date.now
    }

  })

  const ModerationAction = Mongoose.model('ModerationAction', moderationSchema);

  module.exports = ModerationAction;





