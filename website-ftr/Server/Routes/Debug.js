const express = require('express');
const router = express.Router();
const { Officers } = require('../models');
const multer = require('multer');
const sharp = require('sharp');

// Multer storage configuration
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

router.post('/add-officer', upload.single('image'), async (req, res) => {
  try {
    const { name, position, bio, email, phoneNumber, location, youtube, linkedin, instagram, x_social, facebook } = req.body;
    let imageBuffer = req.file ? req.file.buffer : null;

    if (imageBuffer) {
      // Resize image if larger than 300x300
      imageBuffer = await sharp(imageBuffer)
        .resize({ width: 300, height: 300, fit: sharp.fit.cover, withoutEnlargement: true })
        .toBuffer();
    }

    const newOfficer = await Officers.create({
      fullName: name,
      title: position,
      photo: imageBuffer,
      description: bio,
      email,
      phoneNumber,
      location,
      youtube,
      linkedin,
      instagram,
      x_social,
      facebook,
    });

    res.status(201).json(newOfficer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
