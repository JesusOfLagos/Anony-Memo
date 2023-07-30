
const session = require("express-session")




async function isLoggedIn (req, res, next) {
//   Check if the user is logged in by checking the session data
  if (req.session.loggedIn) {
    res.json(`'Welcome to the Anony-Memo, ' + ${req.session.user.firstname} + '!'`);
  } else {
    res.status(401).send('Unauthorized. Please log in.');
  }

  next();
}


async function isAdmin (req, res, next) {
  //   Check if the user is logged in by checking the session data
    if (req.session.user.isAdmin === true) {
      res.json('Authorized, please proceed.');
    } else {
      res.status(401).send('Unauthorized. Admin Access Only.');
    }
  
    next();
  }




module.exports = {
  isLoggedIn: isLoggedIn,
  isAdmin: isAdmin
}




