
const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const sendNotification = require('./notificationController')
const Messages = require('../Models/Messages')
const Users = require('../Models/Users')
const ModerationAction = require('../Models/Moderation')
const ReportAbuse = require('../Models/ReportAbuse')
const Notifications = require('../Models/Notifications')






async function SendMessage(req, res) {
  try {
    const { title, note, to } = req.body;

    const message = new Messages({
      title,
      note,
      to,
      from: req.params._id,
    });

    await message.save();
    console.log(message)

    const toUser = await Users.findOne({ _id: to });
    console.log(toUser)
    if (toUser) {
      toUser.messages.push(message._id);
      await toUser.save();
    }

    const fromUser = await Users.findOne({ _id: req.params._id });
    console.log(fromUser)
    if (fromUser) {
      fromUser.messages.push(message._id);
      await fromUser.save();
    }

    io.to(req.params._id).emit('newMessage', message);
    io.to(to).emit('newMessage', message.note);

    const notificationContent = `New message received from: ${req.params._id}`;
    const from = req.params._id
    await sendNotification(to, from, notificationContent);

    res.status(201).json({ message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send the message.' });
  }
  
}





 async function ModerateMessage (req, res) {
    try {
      const { action, reason } = req.body;
      const moderatorId = 'moderator123'; 
  

      const messageId = req.query._id;
      const reportedMessage = await Messages.findById(messageId);
      if (!reportedMessage) {
        return res.status(404).json({ error: 'Reported message not found.' });
      }
      const Id = reportedMessage.from
  
      
      const newModerationAction = new ModerationAction({ moderatorId, messageId, action, reason });
      await newModerationAction.save();



  
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
      console.log(req.params._id)
      const { sort } = req.query;

      const userId = req.params._id
      const queryOptions = { from: userId };
      let sortOptions = { createdAt: 1 }; 
      if (sort === 'desc') {
        sortOptions = { createdAt: -1 }; 
      }
      console.log(sort)
      console.log(sortOptions)
      console.log(queryOptions)
      // Fetch messages from the database based on query options and sort options
      const notifications = await Notifications.find(queryOptions).sort(sortOptions);
  
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch notifications.' });
    }
  }



  async function GetMessages(req, res) {
    try {
      const { sort, toUserId, keyword } = req.query;
      const userId = req.params._id
  
      const queryOptions = {};
  
      if (userId) {
        queryOptions.$or = [{ note: { $regex: keyword, $options: 'i' } }, { from: userId }, { to: toUserId }];
      }
  
      // if (fromUser) {
      //   queryOptions.from = fromUser;
      // }
  
      // if (toUser) {
      //   queryOptions.to = toUser;
      // }
  
      // if (keyword) {
      //   queryOptions.note = { $regex: keyword, $options: 'i' };
      // }
  
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
      console.log(keyword)
  
      const messages = await Messages.find({ note: { $regex: keyword, $options: 'i' } });
      console.log(messages)
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to find messages with this keyword.' });
    }
  }




  async function ReportMessageAbuse(req, res) {
    try {
      const moderatorId = 'moderator123';
      const reporterId = req.query._id
      console.log(reporterId)
      const messageId = req.params._id;
      console.log(messageId)
      const {content} = req.body;
      console.log(req.body)


      const abuseReport = new ReportAbuse({
       reporterId,
       messageId,
       content
      })
     console.log(abuseReport)
     await abuseReport.save() 
  
  
      // Emit the 'abuseReport' event to the specific moderator
      io.to(moderatorId).emit('abuseReport', abuseReport);
  
      // Send a notification to the moderator about the abuse report
      const notificationContent = `New abuse report received for message ID: ${abuseReport.messageId}`;
      console.log(abuseReport.messageId)
      console.log(notificationContent)
      await sendNotification(messageId, notificationContent);
  
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
  

  

  





