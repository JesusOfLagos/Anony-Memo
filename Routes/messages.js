const express = require("express")
const router = express.Router()
const { isLoggedIn, isAdmin } = require("../Auth/isLoggedIn")
const { GetMessages, SearchMessages, ReportMessageAbuse, ModerateMessage, SendMessage, ReportAbuse, SendAMessage } = require("../Controllers/messageController")



router.get('/users/get-all-messages', isLoggedIn, GetMessages)
router.post('/messages/search', isLoggedIn, SearchMessages)
router.post('/users/send-a-message', isLoggedIn, SendMessage)
router.post('/messages/report/:id', isLoggedIn, ReportMessageAbuse)
router.post('/messages/moderate/:id', isAdmin, ModerateMessage)


module.exports = router;
