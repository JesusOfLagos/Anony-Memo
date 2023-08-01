



 // import modules

 const session = require('express-session')
 const express = require("express");
 const mongoose = require("mongoose");
 const morgan = require("morgan");
 const cors = require("cors");
 const path = require('path')
 const bodyparser = require("body-parser");
 const passport = require("passport");
 const socketio = require('socket.io');
 const env = require('dotenv').config();
 const http = require('http');
 const app = express();
 const server = http.createServer(app);
 const io = socketio(server);
 const performNotificationCleanup = require('./Controllers/cleanNotifications');


  // middleware
  app.use(express.json());
  app.use(morgan("dev"));
  app.use(cors({ origin: 'https://localhost:3000', credentials: true })); 
   // app.use[cors({ origin: true, credentials: true })];
 
 app.use(
  session({
    secret: 'my-secret', 
    resave: false,
    saveUninitialized: true,
  })
);


 app.use(bodyparser.json());
 app.use(bodyparser.urlencoded({ extended: true }));

 const UserRoutes = require("./Routes/users");
 app.use("/", UserRoutes);

 const MessagesRoutes = require("./Routes/messages");
 app.use("/", MessagesRoutes);






 //db

 mongoose.connect(env.parsed.MONGO_URI).then((data) => {
    console.log("DB Connection was successful");
 })
 .catch(err => console.log(err, "Oops!, an error occured!"));



 //port

 const port = env.parsed.PORT || 8090;


// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle join room event
  // socket.on('joinRoom', (roomId) => {
  //   socket.join(roomId);
  //   console.log(`User joined room: ${roomId}`);
  // });

  // Handle leave room event
  // socket.on('leaveRoom', (roomId) => {
  //   socket.leave(roomId);
  //   console.log(`User left room: ${roomId}`);
  // });

  // Handle disconnect event
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});





 //listener

app.listen(port, (err) => { 
    if(err){
        console.log(err);
    }
    console.log(`Server Is Running on Port ${port}`) 

});

performNotificationCleanup();



