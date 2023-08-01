const express = require("express")
import { isLoggedIn, isAdmin } from "../Auth/isLoggedIn"
const { CreateUser, LoginUser, Logout, GetUser, EditUserName, EditProfilePicture } = require("../Controllers/userController")
const { GetNotifications } = require("../Controllers/messageController")

const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const env = require("dotenv").config();


// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY ,   
  api_secret: process.env.CLOUDINARY_API_SECRET   
});

// Set up multer storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Profile-Pictures', 
    allowed_formats: ['jpg', 'jpeg', 'png'], 
    transformation: [{ width: 150, height: 150, crop: 'thumb', gravity: 'face' }] 
  }
});


const upload = multer({ storage: storage });




const router = express.Router()


router.post('/users/create', upload.single('profilePicture'), CreateUser)
router.post('/users/auth/login', LoginUser)
router.post('/users/auth/logout', isLoggedIn, Logout)
router.get('/users/get-user/:id', isLoggedIn, isAdmin, GetUser)
router.get('/users/get-user-notifications', isLoggedIn, GetNotifications)
router.put('/user/edit-profile/:id', isLoggedIn, EditUserName)
router.put('/update-profile-picture/:id', isLoggedIn, upload.single('profilePicture'), EditProfilePicture)



module.exports = router;
