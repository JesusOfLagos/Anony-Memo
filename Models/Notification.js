




const Mongoose = require("mongoose")
const Schema = Mongoose.Schema





  const notificationSchema = new Schema({
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },

    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
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


  module.exports = {
    notificationSchema: notificationSchema
  }














