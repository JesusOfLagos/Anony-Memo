



const express = require('express');

const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(app);


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



