 // import modules

 const express = require("express");
 const mongoose = require("mongoose");
 const morgan = require("morgan");
 const cors = require("cors");
 const path = require('path')
 const bodyparser = require("body-parser");
 const passport = require("passport");
 const bcrypt = require("bcrypt");
 const userRoutes = require("./Routes/users")

 const env = require('dotenv').config();

 // app
 const app = express();

 //db

 mongoose.connect(env.parsed.MONGO_URI).then((data) => {
    console.log("DB Connection was successful");
 })
 .catch(err => console.log(err, "Oops!, an error occured!"));

 // middleware
 app.use(express.json());
 app.use[morgan("dev")];
 app.use[cors({ origin: 'https://stale-quiz.onrender.com', credentials: true })];
  // app.use[cors({ origin: true, credentials: true })];
 app.use("/api/users", userRoutes);
 //routes
 const TestRoutes = require("./Routes/test");
 app.use("/", TestRoutes);

 //port

 const port = env.parsed.PORT || 8090;


 //listener

 const server = app.listen(port, (err) => { 
    if(err){
        console.log(err);
    }
    console.log(`Server Is Running on Port ${port}`) 
});
