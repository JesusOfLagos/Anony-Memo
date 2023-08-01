const express = require("express")
const router = express.Router()
const { isLoggedIn, isAdmin } = require("../Auth/isLoggedIn")
const successfullyLoggedIn = require("../Auth/checkAuth")
const { GetMessages, SearchMessages, ReportMessageAbuse, ModerateMessage, SendMessage } = require("../Controllers/messageController")
const SendNotification = require("../Controllers/notificationController")



router.get('/users/get-all-messages/:_id', GetMessages)
router.post('/messages/search', SearchMessages)
router.post('/users/send-a-message/:_id', SendMessage)
router.post('/messages/report/:_id', ReportMessageAbuse)
router.post('/messages/moderate', ModerateMessage)
router.post('/users/send-notification/:_id', SendNotification)


module.exports = router;
