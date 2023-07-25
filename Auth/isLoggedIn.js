
const session = require("express-session")




module.exports = (req, res, next) => {
//   Check if the user is logged in by checking the session data
  if (req.session.loggedIn) {
    res.json('Welcome to the Anony-Memo, ' + req.session.user.firstname + '!');
  } else {
    res.status(401).send('Unauthorized. Please log in.');
  }

  next();
}





