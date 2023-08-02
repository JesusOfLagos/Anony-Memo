

const Mongoose = require("mongoose")
const Schema = Mongoose.Schema





  const abuseReportSchema = new Schema({
    reporterId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },

    messageId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'messages',
        required: true
    },

    content: {
        type: String,
        required: true
    },

    time: {
        type: Date,
        default: Date.now
    }

  })


  const ReportAbuse = Mongoose.model('AbuseReport', abuseReportSchema);

  module.exports = ReportAbuse;


    















