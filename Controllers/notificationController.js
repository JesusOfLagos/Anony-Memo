import { Notification } from '../Models/Notification';
import { Users } from '../Models/Users';
const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

async function SendNotification(req, res, toUserId, content) {
  try {
    // Create the notification object
    const notification = new Notification({
      to: toUserId,
      from: req.userData._id,
      content: content
    });

    const savedNotification = await notification.save();

    const notificationContent = savedNotification.content;
    await Users.findOne({id: req.userData._id}).then(user => {
      user.notifications.push(notificationId)
      user.save()
    })

    io.to(toUserId).emit('newNotification', notificationContent);

    res.status(201).json({ message: 'Notification sent successfully.', notificationContent });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send notification.' });
  }
}


module.exports = {
  SendNotification: SendNotification
}
