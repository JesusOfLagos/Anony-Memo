const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
import { Users } from '../Models/Users';
const app = express();
const PORT = 3000;



// Cloudinary configuration
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME, 
  api_key: CLOUDINARY_API_KEY ,   
  api_secret: CLOUDINARY_API_SECRET   
});

// Set up multer storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Profile-pictures', 
    allowed_formats: ['jpg', 'jpeg', 'png'], 
    transformation: [{ width: 150, height: 150, crop: 'thumb', gravity: 'face' }] 
  }
});



const upload = multer({ storage: storage });

// Route to upload a new profile picture
app.post('/upload-profile-picture/:userId', upload.single('profilePicture'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please provide a valid image file' });
  }

  const imageUrl = req.file.path;
  const result = await cloudinary.uploader.upload(imageUrl, { folder: 'Profile-Pictures' });

  try {
    // Save the secure URL in the userSchema
    const user = await Users.findByIdAndUpdate(req.params.userId, { profilePicture: result.secure_url }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ imageUrl: result.secure_url });
  } catch (error) {
    return res.status(500).json({ message: 'Error saving profile picture' });
  }
});

// Route to update an existing profile picture
app.put('/update-profile-picture/:userId', upload.single('profilePicture'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please provide a valid image file' });
  }

  const imageUrl = req.file.path;
  const result = await cloudinary.uploader.upload(imageUrl, { folder: 'Profile-Pictures' });

  try {
    // Save the secure URL in the userSchema
    const user = await Users.findByIdAndUpdate(req.params.userId, { profilePicture: result.secure_url }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ imageUrl: result.secure_url });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating profile picture' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
