
const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
import { sendNotification } from './notificationController'



async function SendMessage (req, res) {
  try {


    const message = new MessageSchema({

    })



    const { toUserId } = req.body;
    io.to(req.userData._id).emit('newMessage', message);
    io.to(toUserId).emit('newMessage', message);
    const reason = `You just got a message from ${req.userData.userName}`

    
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

  //   res.status(201).json({ message: 'Message sent successfully.' });
  // } catch (error) {
  //   res.status(500).json({ error: 'Failed to send the message.' });
  // }
// }







 async function ModerateMessage (req, res) {
    try {
      const { action, reason } = req.body;
      const moderatorId = 'moderator123'; 
  

      const messageId = req.params.messageId;
      const Id = reportedMessage.from
      const reportedMessage = await Message.findById(messageId);
      if (!reportedMessage) {
        return res.status(404).json({ error: 'Reported message not found.' });
      }
  
      
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

      const notificationContent = `Message acted upon: ${action}`;
      await sendNotification(req, res, Id, notificationContent);
  
      res.status(200).json({ message: 'Moderation action successful.' })
    } catch (error) {
      res.status(500).json({ error: 'Failed to moderate the message.' })
    }
  }


// async function GetMessages (req, res) {
//     try {
//       const { sort, userId } = req.query;

//       const queryOptions = {};
  
//       if (userId) {
//         queryOptions.$or = [{ fromUser: userId }, { toUser: userId }];
//       }
  
//       // Sorting based on date
//       let sortOptions = { createdAt: 1 }; 
//       if (sort === 'desc') {
//         sortOptions = { createdAt: -1 }; 
//       }



  
//       // Fetch messages from the database based on query options and sort options
//       const messages = await Message.find(queryOptions).sort(sortOptions);
  
//       res.json(messages);
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to fetch messages.' });
//     }
//   }



  async function GetMessages(req, res) {
    try {
      const { sort, userId, fromUser, toUser, keyword } = req.query;
  
      const queryOptions = {};
  
      if (userId) {
        queryOptions.$or = [{ fromUser: userId }, { toUser: userId }];
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
      const messages = await Message.find(queryOptions).sort(sortOptions);
  
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch messages.' });
    }
  }
  





  
  // Search Messages by Keyword
 async function SearchMessages (req, res) {
    try {
      const { keyword } = req.query;
  
      const messages = await Message.find({ content: { $regex: keyword, $options: 'i' } });
  
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to find messages with this keyword.' });
    }
  }



  async function SendAMessage (req, res) {
    try {
      const { toUserId } = req.body;
      io.to(req.userData.userId).emit('newMessage', message);
      io.to(toUserId).emit('newMessage', message);

      const notificationContent = `New message received from: ${req.userData.userName}`;
      await sendNotification(req, res, toUserId, notificationContent);
  
      res.status(201).json({ message: 'Message sent successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send the message.' });
    }
  }
  
  
  






  module.exports = {
    SearchMessages: SearchMessages,
    SendMessage: SendMessage,
    ReportMessageAbuse: ReportMessageAbuse,
    ModerateMessage: ModerateMessage,
    GetMessages: GetMessages,
    SendAMessage: SendAMessage
  };
  

  

  async function ReportMessageAbuse(req, res) {
    try {
      const moderatorId = req.params._id;
      const abuseReport = req.body.abuseReport; // Assuming you have the abuse report data in the request body
  
      // Emit the 'abuseReport' event to the specific moderator
      io.to(moderatorId).emit('abuseReport', abuseReport);
  
      // Send a notification to the moderator about the abuse report
      const notificationContent = `New abuse report received for message ID: ${abuseReport.messageId}`;
      await sendNotification(req, res, moderatorId, notificationContent);
  
      res.status(201).json({ message: 'Abuse reported successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to report abuse.' });
    }
  }
  



  const notificationContent = `New abuse report received for message ID: ${abuseReport.messageId}`;
      await sendNotification(req, res, moderatorId, notificationContent);

