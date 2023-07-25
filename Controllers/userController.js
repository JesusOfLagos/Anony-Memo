



const session = require('express-session');
const express = require("express");
const Users = require("../Models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const env = require("dotenv").config();


const { LoginValidator, RegisterValidator } = require("../Validators/userValidators");


const router = express.Router();







// Create A User 


async function CreateUser (req, res) {
    console.log(req.body)
    const {errors, isValid} = RegisterValidator(req.body);
    if (!isValid) {
        res.json({success: false, errors});
    } else {
        const {firstName, lastName, email, password} = req.body;
        const registerUser = new Users({
            firstName, 
            lastName,
            userName: `${firstName} + ${lastName}`,
            email,
            password,
            profilePicture,
            createdAt: new Date()
        });
        await bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (hashErr, hash) => {
                if (err || hashErr) {
                    res.json({"message": "Error Ocurred While Hashing", success: false});
                    return;
                }

                registerUser.password = hash;
                registerUser.save().then(() => {
                    res.json({message: "User Created Successfully", "success": true});
                })
            })
        })
    }
}




// Login A User

async function LoginUser (req, res) {
    const {errors, isValid} = LoginValidator(req.body);

    if (!isValid) {
        res.json({success: false, errors});
    } else {
        Users.findOne({email: req.body.email}).then(user => {
            if (!user) {
                res.json({message: "Email not found", success: false})
            } else {
                bcrypt.compare(req.body.password, user.password).then(success => {
                    if (!success) {
                        res.json({message: "Invalid Password", success: false})
                    } else {
                        req.session.user = user;
                        req.session.loggedIn = true;
                        const payload = {
                            id: user._id,
                            name: user.firstName
                        }
                        jwt.sign(
                            payload,
                            process.env.APP_SECRET, {expiresIn: 2155926},
                            (err, token) => {
                                res.json({
                                    user,
                                    token: `Bearer Token: ` + token,
                                    success: true
                                })
                            }
                        )
                    }
                })
            }
        })
    }
}




// logout A User

function Logout (req, res) {

    // Destroy the session to log out the user
    
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      } else {
        res.send('User logged out successfully.');
      }
    });
  }










// Get A User By Id

async function GetUser (req, res) {
    await Users.findOne({_id: req.params.id}).then(user => {
        res.json({user, success: true}).catch(er => {
            res.json({success: false, message: er.message})
        })
    })
}





async function EditProfile (req, res) {

     

    const {newUserName, newProfilePicture} = req.body

    const newValues = { $set: { userName: newUserName, profilePicture : newProfilePicture } };
    await Users.findOneAndUpdate({_id: req.params.id}, newValues).then(user => {
        user.save()
        res.json({user, success: true, message: "Edited User Profile Successfully"}).catch(error => {
            res.json({message: "Can't Update User Profile", success: false})
        })
    })
}














// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("mydb");
//     var myquery = { address: "Valley 345" };
//     var newvalues = { $set: { name: "Michael", address: "Canyon 123" } };
//     dbo.collection("customers").updateOne(myquery, newvalues, function(err, res) {
//       if (err) throw err;
//       console.log("1 document updated");
//       db.close();
//     });
//   });
  
  






// Attempt A Quiz

// router.put('quizzes/:quizId/attempt', checkAuth, async (req, res) => {

//     const numberOfAttempts = user.numberOfAttempts;
//     const newNumberOfAttempts = numberOfAttempts + 1;
//     const newValues = { $set: { numberOfAttempts: newNumberOfAttempts } };

//     await Users.findOneAndUpdate({_id: req.params.id}, newValues).then(user => {

        // const {newQuestionName, newOptions, newCorrectAnswer} = req.body

        // user.save()

        // const Participants = await Users.findOne(({_id: req.params.id}).then()
//         res.json({user, success: true}).catch(er => {
//             res.json({success: false, message: er.message})
//         })
//     })
// })










// Fetch All Quiz Participants

// router.get('/quizzes/:quizId/participants', async(req, res) => {
//     await Quizzes.findById({_id: req.params.id}).then(quiz => {
//         const quizParticipants = quiz.participants;

//         res.json({quizParticipants, success: true}).catch(er => {
//             res.json({success: false, message: er.message})
//         })

//     })
// })






// Close a quiz and stop allowing access.



// router.post('/quizzes/:quizId/close', checkAuth, async (req, res) => {
//     await Users.findOne({_id: req.params.id}).then(user => {
//         res.json({user, success: true}).catch(er => {
//             res.json({success: false, message: er.message})
//         })
//     })
// })












// module.exports = router;

 








