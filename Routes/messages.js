const express = require("express")
const { default: createMessages } = require("../Controllers/messageController")


const router = express.Router()


router.post('/users/create', createMessages)




