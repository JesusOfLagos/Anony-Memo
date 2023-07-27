

const Mongoose = require("mongoose")
const Schema = Mongoose.Schema





  const abuseReportSchema = new Schema({
    reporterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },

    messageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Messages',
        required: true
    },

    content: {
        type: String,
        required: true
    },

    time: {
        type: Date,
        default: Date.now()
    }

  })















