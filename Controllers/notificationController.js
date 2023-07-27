



const express = require('express');

const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(app);


// Connect to MongoDB and set up models (User, Message, AbuseReport) as needed

// Middleware to parse JSON requests
app.use(express.json());

// Socket.IO connection handling
io.on('connection', (socket) => {
  // Extract the user ID from the socket handshake (you may have your own authentication process here)
  const userId = socket.handshake.query.userId;

  // Join the user's room using their user ID as the room name
  socket.join(userId);

  // Handle disconnection
  socket.on('disconnect', () => {
    // Clean up when the user disconnects
    // You may have additional logic here depending on your application needs
  });
});


async function SendAMessage (req, res) {
  try {
    const { toUserId } = req.body;
    io.to(req.userData.userId).emit('newMessage', message);
    io.to(toUserId).emit('newMessage', message);

    res.status(201).json({ message: 'Message sent successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send the message.' });
  }
}





async function ReportAbuse (req, res) {
  try {
    const moderatorId = 'moderator123'; 
    io.to(moderatorId).emit('abuseReport', abuseReport);

    res.status(201).json({ message: 'Abuse reported successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to report abuse.' });
  }
}
