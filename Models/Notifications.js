




const Mongoose = require("mongoose")
const Schema = Mongoose.Schema

const notificationSchema = new Schema({
  to: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  from: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: new Date
  },
  isRead: {
    type: Boolean,
    default: false
  }
});



const Notification = Mongoose.model('Notification', notificationSchema);

module.exports = Notification;












