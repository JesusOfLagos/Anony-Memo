const express = require("express")
const { GetMessages, SearchMessages, ReportMessageAbuse, ModerateMessage, SendMessage } = require("../Controllers/messageController")


const router = express.Router()


router.post('/users/create', createMessages)




