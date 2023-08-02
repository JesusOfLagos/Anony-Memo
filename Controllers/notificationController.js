const Notifications = require('../Models/Notifications');
const Users = require('../Models/Users');
const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

async function SendNotification(to, from, notificationContent) {
  try {

    // const from = req.params._id
    // console.log(from)
    // const {to, content} = req.body
    // console.log(toUserId)
    // console.log(content)
    // Create the notification object
    const notification = new Notifications({
      to: to,
      from: from,
      content: notificationContent
    });
    console.log(notification)

    await notification.save();

    const theNotificationContent = notification.content;
    const notificationId = notification._id
    console.log(notification)
    await Users.findById({_id: to}).then(user => {
      user.notifications.push(notificationId)
      user.save()
    })

    io.to(to).emit('newNotification', theNotificationContent);

    // res.status(201).json({ message: 'Notification sent successfully.', notificationContent });
  } catch (error) {
    console.log(error)
    // res.status(500).json({ error: 'Failed to send notification.' });
  }
}


module.exports = SendNotification

