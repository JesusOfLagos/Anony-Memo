const express = require("express")
const { default: createUser } = require("../Controllers/userController")


const router = express.Router()


router.post('/users/create', createUser)