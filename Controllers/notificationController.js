import { notificationSchema } from '../Models/Notification';

const socketio = require('socket.io');

const io = socketio(app);


async function SendNotification (req, res, toUserId, content) {
  try {

    const notification = new notificationSchema({
      to: toUserId,
      from: req.userData._id,
      content: reason
    })
    // io.to(req.userData.userId).emit('newNotification', notification)
    io.to(toUserId).emit('newNotification', notification);

    res.status(201).json({ message: 'Notification sent successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send notification.' });
  }
}



module.exports = {
  SendNotification: SendNotification
}
