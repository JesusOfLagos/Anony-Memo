
const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
import { sendNotification } from './notificationController'
import { Messages } from '../Models/Messages.js'
import { Users } from '../Models/Users.js'
import { ModerationAction } from '../Models/Moderation.js'
import { ReportAbuse } from '../Models/ReportAbuse.js'
import { Notifications } from '../Models/Notifications.js'


 async function ModerateMessage (req, res) {
    try {
      const { action, reason } = req.body;
      const moderatorId = 'moderator123'; 
  

      const messageId = req.params._id;
      const reportedMessage = await Messages.findById(messageId);
      if (!reportedMessage) {
        return res.status(404).json({ error: 'Reported message not found.' });
      }
      const Id = reportedMessage.from
  
      
      const ModerationAction = new moderationAction({ moderatorId, messageId, action, reason });
      await ModerationAction.save();



  
      switch (action) {
        case 'hide':
          reportedMessage.isHidden = true
          await reportedMessage.save()
          break;
  
        case 'delete':
          reportedMessage.isDeleted = true
          await reportedMessage.save()
          break;
  
        case 'warning':
            reportedMessage.warning++
            await reportedMessage.save()
          break;
  
        default:
          return res.status(400).json({ error: 'Invalid action.' })
      }

      const notificationContent = `Message with id: ${messageId} acted upon: ${action}`;
      await sendNotification(Id, notificationContent);
  
      res.status(200).json({ message: 'Moderation action successful.' })
    } catch (error) {
      res.status(500).json({ error: 'Failed to moderate the message.' })
    }
  }


async function GetNotifications (req, res) {
    try {
      const { sort, userId } = req.query;

      const queryOptions = {};
  
      // if (userId) {
      //   queryOptions.$or = [{ fromUser: userId }, { toUser: userId }];
      // }
  
      // Sorting based on date
      let sortOptions = { createdAt: 1 }; 
      if (sort === 'desc') {
        sortOptions = { createdAt: -1 }; 
      }



  
      // Fetch messages from the database based on query options and sort options
      const notifications = await Notifications.find().sort(sortOptions);
  
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch messages.' });
    }
  }



  async function GetMessages(req, res) {
    try {
      const { sort, toUserId, fromUser, toUser, keyword } = req.query;
      const userId = req.userData._id
  
      const queryOptions = {};
  
      if (userId) {
        queryOptions.$or = [{ fromUser: userId }, { toUser: toUserId }];
      }
  
      if (fromUser) {
        queryOptions.fromUser = fromUser;
      }
  
      if (toUser) {
        queryOptions.toUser = toUser;
      }
  
      if (keyword) {
        queryOptions.content = { $regex: keyword, $options: 'i' };
      }
  
      // Sorting based on date
      let sortOptions = { createdAt: 1 };
      if (sort === 'desc') {
        sortOptions = { createdAt: -1 };
      }
  
      // Fetch messages from the database based on query options and sort options
      const messages = await Messages.find(queryOptions).sort(sortOptions);
  
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch messages.' });
    }
  }
  





  
  // Search Messages by Keyword
 async function SearchMessages (req, res) {
    try {
      const { keyword } = req.query;
  
      const messages = await Messages.find({ content: { $regex: keyword, $options: 'i' } });
  
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to find messages with this keyword.' });
    }
  }



  async function SendMessage (req, res) {
    try {
      const { title, note, toUserId } = req.body;

      const message = new Messages({
          title,
          note,
          to: toUserId,
          from: req.userData._id
      })

     await message.save()
     const user = await Users.find({ id: req.userData._id }).then(user => {
      user.messages.push(message._id)
      user.save()
     })
      io.to(req.userData._id).emit('newMessage', message);
      io.to(toUserId).emit('newMessage', message.note);

      const notificationContent = `New message received from: ${req.userData.userName}`;
      await sendNotification(toUserId, notificationContent);
  
      res.status(201).json({ message: 'Message sent successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send the message.' });
    }
  }
  



  async function ReportMessageAbuse(req, res) {
    try {
      const moderatorId = 'moderator123';
      const reporterId = req.userData._id
      const messageId = req.params._id;


      const abuseReport = new ReportAbuse({
       reporterId,
       messageId,
       content
      })

     await abuseReport.save() 
  
      // Emit the 'abuseReport' event to the specific moderator
      io.to(moderatorId).emit('abuseReport', abuseReport);
  
      // Send a notification to the moderator about the abuse report
      const notificationContent = `New abuse report received for message ID: ${abuseReport.messageId}`;
      await sendNotification(moderatorId, notificationContent);
  
      res.status(201).json({ message: 'Abuse reported successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to report abuse.' });
    }
  }
  






  module.exports = {
    SearchMessages: SearchMessages,
    SendMessage: SendMessage,
    ReportMessageAbuse: ReportMessageAbuse,
    ModerateMessage: ModerateMessage,
    GetMessages: GetMessages,
    GetNotifications: GetNotifications
  };
  

  

  





