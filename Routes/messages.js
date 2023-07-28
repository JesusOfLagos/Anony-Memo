const express = require("express")
const router = express.Router()
const checkAuth = require("../Auth/checkAuth")
const { GetMessages, SearchMessages, ReportMessageAbuse, ModerateMessage, SendMessage, ReportAbuse, SendAMessage } = require("../Controllers/messageController")



router.get('/users/get-all-messages', GetMessages)
router.get('/messages/search', SearchMessages)
router.post('/users/send-a-message', SendMessage)
router.post('/messages/report/:id', ReportMessageAbuse)
router.post('/messages/moderate', isAdmin, ModerateMessage)




