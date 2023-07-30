const express = require("express")
import { isLoggedIn, isAdmin } from "../Auth/isLoggedIn"
const { CreateUser, LoginUser, Logout, GetUser, EditUserName, EditProfilePicture } = require("../Controllers/userController")


const router = express.Router()


router.post('/users/create', upload.single('profilePicture'), CreateUser)
router.post('/users/auth/login', LoginUser)
router.post('/users/auth/logout', isLoggedIn, Logout)
router.get('/users/get-user', isLoggedIn, isAdmin, GetUser)
router.put('/user/edit-profile', isLoggedIn, EditUserName)
router.put('/update-profile-picture/:userId', isLoggedIn, upload.single('profilePicture'), EditProfilePicture)