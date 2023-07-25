




const express = require("express");
const Users = require("../Models/Users");
const Quiz = require("../Models/Quizzes")
const Questions = require("../Models/Questions")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkAuth = require("../MiddleWare/check-auth");
const env = require("dotenv").config();

const { LoginValidator, RegisterValidator } = require("../Validators/validators");
const Quizzes = require("../Models/Quizzes");

const router = express.Router();








// Create A User 


export default async function CreateUser (req, res) {
    console.log(req.body)
    const {errors, isValid} = RegisterValidator(req.body);
    if (!isValid) {
        res.json({success: false, errors});
    } else {
        const {firstName, lastName, email, password} = req.body;
        const registerUser = new Users({
            firstName, 
            lastName,
            email,
            password,
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

export default async function LoginUser (req, res) {
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






// Get A User By Id

router.get('users/find/:id', async (req, res) => {
    await Users.findOne({_id: req.params.id}).then(user => {
        res.json({user, success: true}).catch(er => {
            res.json({success: false, message: er.message})
        })
    })
})




// Delete A User
router.delete('users/delete/:id', async (req, res) => {
    await Users.findOneAndDelete({_id: req.params.id}).then(user => {
        res.json({message: "User deleted successfully", success: true}).catch(er => {
            res.json({success: false, message: "Can't Delete User"})
        })
    })
})






// Create a quiz for the user



router.post('/me/create-quiz', async (req, res) => {
    await Users.findOne({email: req.body.email}).then(user => {
        const { quizName, description, imgUrl, category, questionName, options, correctAnswer, email } = req.body;





        const newQuestion = new Questions({
            questionName,
            options,
            correctAnswer,
            createdAt: new Date()
        })
        const newQuiz = new Quizzes({
            quizName,
            questions: newQuestion._id,
            description,
            category,
            imgUrl,
            createdAt: new Date()
        })

        newQuiz.questions.push(newQuestion)
        const Quiz = user.quizzes
        Quiz.push(newQuiz)
        newQuiz.save()
        newQuestion.save()


        res.json({message: "Quiz added successfully", success: true, user}).catch(error => {
            res.json({success: false, message: "Can't create quiz"})
        })
    })
})



// Get all the quizzes for a user


router.get('/me/quizzes', async (req, res) => {
    await Users.findOne({_id: req.params.id}).then(user => {
        const Quiz = user.quizzes;
        res.json({Quiz, success: true, message: "Got all the quizzes"}).catch(error => {
            res.json({message: "Could not fetch the quizzes for the User", success: false})
        })
    })
})





// Fetch All Details For Each Quiz


router.get('/quizzes/quiz/:id', async (req, res) => {
    await Quizzes.findOne({_id: req.params.id}).then(quiz => {
        res.json({quiz, success: true, message: "Got details for the quizzes"}).catch(error => {
            res.json({message: "Could not fetch the details for the quiz", success: false})
        })
    })
})




// Edit Quiz Details


router.put('/quizzes/:quizId', async (req, res) => {

     

    const {newQuizName, newDescription, newCategory, newImgUrl} = req.body

    const newQuestion = new Questions({
        questionName,
        options,
        correctAnswer,
        createdAt: new Date()
    }) 
    const newValues = { $set: { quizName: newQuizName, questions: [newQuestion], category: newCategory, imgUrl : newImgUrl, description : newDescription } };
    await Quizzes.findOneAndUpdate({_id: req.params.id}, newValues).then(quiz => {


        

        



        const {} = req.body;

        
        quiz.quizName = quizName
        res.json({quiz, success: true, message: "Got details for the quizzes"}).catch(error => {
            res.json({message: "Could not fetch the details for the quiz", success: false})
        })
    })
})




// Add Questions to a quiz 



router.post('/quiz/:quizId/questions', async (req, res) => {
    await Quizzes.findOne({_id: req.params.id}).then(quiz => {
        const { questionName, options, correctAnswer } = req.body;





        const newQuestion = new Questions({
            questionName,
            options,
            correctAnswer,
            createdAt: new Date()
        })
    

        quiz.questions.push(newQuestion)
        
        
        quiz.save()
        newQuestion.save()


        res.json({message: "Question added successfully", success: true, quiz}).catch(error => {
            res.json({success: false, message: "Can't add question"})
        })
    })
})




// Add options to the question

router.post('/quiz/:quizId/questions/:questionId/options', async (req, res) => {
    await Questions.findOne({_id: req.params.id}).then(question => {
        // const {  } = req.body;

    const options = [req.body]

        question.options.push(options)
        
        
        question.save()
        


        res.json({message: "Question added successfully", success: true, quiz}).catch(error => {
            res.json({success: false, message: "Can't add question"})
        })
    })
})





// Get Quiz By Id 


router.get('/me/quiz/:id', async (req, res) => {
    await Quizzes.findOne({_id: req.params.id}).then(quiz => {
        res.json({quiz, success: true, message: "Quiz Found"}).catch(error => {
            res.json({success: false, message: "can't find quiz"})
        })
    })
})


// Delete A Quiz

router.delete('/users/quizzes/delete', async (req, res) => {
    await Quizzes.findOneAndDelete({_id: req.params.id}).then(quiz => {
        res.json({message: "User deleted successfully", success: true, quiz}).catch(error => {
            res.json({success: false, message: "Can't delete user"})
        })
    })
})



// Delete A User

router.delete('/users/delete', async(req, res) => {
    await Users.findOneAndDelete({email: req.body.email}).then(user => {
        res.json({message: "User deleted successfully", success: true, user}).catch(error => {
            res.json({success: false, message: "Can't delete user"})
        })
    })
})








// Fetch All Questions For A Quiz


router.get('/me/quizzes/:quizId/questions/:questionId', async (req, res) => {
    await Quizzes.findOne({_id: req.params.id}).then(quiz => {
        const Quiz = quiz.questions;
        res.json({Quiz, success: true, message: "Got all the quizzes"}).catch(error => {
            res.json({message: "Could not fetch the quizzes for the User", success: false})
        })
    })
})







// Edit A Question

router.put('/quizzes/:quizId/questions/:questionId', async (req, res) => {


    const {newQuestionName, newOptions, newCorrectAnswer} = req.body
    const newValues = { $set: { questionName: newQuestionName, options: [newOptions], correctAnswer: newCorrectAnswer } };
    await Questions.findOneAndUpdate({_id: req.params.id}, newValues).then(question => {

        
        res.json({question, success: true, message: "Question Updated Successfully"}).catch(error => {
            res.json({message: "Could not update question", success: false})
        })
    })
})






// Remove A Question in a quiz.



router.delete('/users/quizzes/:quizId/questions/:questionId/remove', async (req, res) => {
    await Quizzes.findOne({_id: req.params.id}).then(quiz => {

        const Question = quiz.questions
        
        Question.find()


        res.json({message: "User deleted successfully", success: true, quiz}).catch(error => {
            res.json({success: false, message: "Can't delete user"})
        })
    })
})






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

router.put('quizzes/:quizId/attempt', checkAuth, async (req, res) => {

    const numberOfAttempts = user.numberOfAttempts;
    const newNumberOfAttempts = numberOfAttempts + 1;
    const newValues = { $set: { numberOfAttempts: newNumberOfAttempts } };

    await Users.findOneAndUpdate({_id: req.params.id}, newValues).then(user => {

        // const {newQuestionName, newOptions, newCorrectAnswer} = req.body

        user.save()

        // const Participants = await Users.findOne(({_id: req.params.id}).then()
        res.json({user, success: true}).catch(er => {
            res.json({success: false, message: er.message})
        })
    })
})










// Fetch All Quiz Participants

router.get('/quizzes/:quizId/participants', async(req, res) => {
    await Quizzes.findById({_id: req.params.id}).then(quiz => {
        const quizParticipants = quiz.participants;

        res.json({quizParticipants, success: true}).catch(er => {
            res.json({success: false, message: er.message})
        })

    })
})






// Close a quiz and stop allowing access.



router.post('/quizzes/:quizId/close', checkAuth, async (req, res) => {
    await Users.findOne({_id: req.params.id}).then(user => {
        res.json({user, success: true}).catch(er => {
            res.json({success: false, message: er.message})
        })
    })
})












module.exports = router;

 








